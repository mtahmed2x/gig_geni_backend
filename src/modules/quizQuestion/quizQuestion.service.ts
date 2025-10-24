import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../errors/appError';
import { Competition } from '../competition/competition.models';
import { IQuizQuestion } from './quizQuestion.interface';
import { QuizQuestion } from './quizQuestion.models';
import { Types } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { updateQuizPoints } from '../competition/competition.service';

const createQuizQuestion = async (payload: Partial<IQuizQuestion>) => {
  const question = await QuizQuestion.create(payload);
  await updateQuizPoints(question.competition.toString());
  return question;
};

const createMultipleQuizQuestions = async (
  competitionId: string,
  questions: Partial<IQuizQuestion>[],
) => {
  const docsToInsert = questions.map((q) => ({
    ...q,
    competition: new Types.ObjectId(competitionId),
  }));

  if (docsToInsert.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'No question to add');
  }
  const newQuestions = await QuizQuestion.insertMany(docsToInsert);
  await updateQuizPoints(competitionId);
  return newQuestions;
};

const getAllQuizQuestion = async (payload: { competition?: string }) => {
  const { competition } = payload;
  const query: Record<string, unknown> = {};
  if (competition) query.competition = competition;
  return await QuizQuestion.find(query).lean();
};

const getQuizQuestionById = async (id: string) => {
  return await QuizQuestion.findById(id).lean();
};

const updateQuizQuestion = async (id: string, payload: Partial<IQuizQuestion>) => {
  return await QuizQuestion.findByIdAndUpdate(id, payload, { new: true });
};

const deleteQuizQuestion = async (id: string) => {
  return await QuizQuestion.findByIdAndDelete(id);
};

interface GenerateQuizConfig {
  competitionId: string;
  description: string;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  distribution: {
    single: number;
    multiple: number;
    true_false: number;
    short: number;
    broad: number;
  };
  shortWordLimit?: number;
  broadWordLimit?: number;
  pointsPerQuestion?: number;
}

const generateQuizQuestions = async (payload: GenerateQuizConfig) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
  const {
    competitionId,

    description,
    totalQuestions,
    difficulty,
    distribution,
    shortWordLimit = 100,
    broadWordLimit = 500,
    pointsPerQuestion = 10,
  } = payload;

  const competition = await Competition.findById(competitionId).lean();
  if (!competition) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Competition not found');
  }

  const prompt = `
You are an expert exam and interview question setter. 
Generate a set of quiz questions based on the following competition details:

Competition Title: ${competition.title}
Description: ${description}

Experience Level: ${competition.experienceLevel}
Skills Tested: ${competition.skillsTested}
Project Brief: ${competition.projectBrief}
Evaluation Criteria: ${competition.evaluationCriteria}

Instructions:
1. Generate exactly ${totalQuestions} questions.
2. Distribute question types as follows:
   - Single Answer (MCQ): ${distribution.single}
   - Multiple Answer (MCQ): ${distribution.multiple}
   - True/False: ${distribution.true_false}
   - Short Descriptive: ${distribution.short}
   - Broad Questions: ${distribution.broad}
3. Each question must include:
   - question (string)
   - type (one of: single, multiple, true_false, short, broad)
   - options (only for single/multiple/true_false, each with text and isCorrect if applicable)
   - correctAnswer (string | string[] | boolean depending on type)
   - wordLimit (for descriptive/broad, use ${shortWordLimit} for short and ${broadWordLimit} for broad)
   - points (integer) <-- **IMPORTANT: This value MUST be exactly ${pointsPerQuestion} for EVERY question.**
   - difficulty ("easy", "medium", "hard") — use ${difficulty}
4. Ensure questions are practical and skill-based.
5. Return only valid JSON array of objects matching this structure:

{
  question: string;
  type: "single" | "multiple" | "true_false" | "short" | "broad";
  options?: { text: string; isCorrect?: boolean }[];
  correctAnswer?: string | string[] | boolean;
  wordLimit?: number;
  points: number;
  difficulty: "easy" | "medium" | "hard";
}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const rawContent = response.text();

  let questions: Omit<IQuizQuestion, '_id' | 'competition' | 'createdAt' | 'updatedAt'>[] = [];

  try {
    questions = JSON.parse(rawContent);
    return questions;
  } catch (err) {
    console.error('Failed to parse AI response:', err, rawContent);
    throw new Error('AI returned invalid JSON');
  }
};

export const quizQuestionService = {
  createQuizQuestion,
  createMultipleQuizQuestions,
  getAllQuizQuestion,
  getQuizQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
  generateQuizQuestions,
};
