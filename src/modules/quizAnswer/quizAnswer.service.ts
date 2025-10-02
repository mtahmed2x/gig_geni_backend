import { StatusCodes } from "http-status-codes";
import { QuizQuestion } from "../quizQuestion/quizQuestion.models";
import { IQuizAnswer } from "./quizAnswer.interface";
import { QuizAnswer } from "./quizAnswer.models";
import { AppError } from "../../errors/appError";
import { Types } from "mongoose";
import { QuestionType } from "../quizQuestion/quizQuestion.constant";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const createQuizAnswer = async (payload: Partial<IQuizAnswer>) => {
  const { userId, competitionId, questionId, answer } = payload;

  const question = await QuizQuestion.findById(questionId).lean();
  if (!question) {
    throw new AppError(StatusCodes.NOT_FOUND, "Question not found");
  }

  let isCorrect = false;
  let pointsAwarded = 0;

  if (
    !answer ||
    answer.value === null ||
    answer.value === "" ||
    (Array.isArray(answer.value) && answer.value.length === 0)
  ) {
    return await QuizAnswer.create({
      userId: new Types.ObjectId(userId),
      competitionId: new Types.ObjectId(competitionId),
      questionId: new Types.ObjectId(questionId),
      answer,
      isCorrect: false,
      pointsAwarded: 0,
      submittedAt: new Date(),
    });
  }

  if (
    question.type === QuestionType.Single ||
    question.type === QuestionType.Multiple ||
    question.type === QuestionType.TrueFalse
  ) {
    if (question.type === QuestionType.Single) {
      isCorrect =
        typeof answer.value === "string" &&
        answer.value === question.correctAnswer;
    } else if (question.type === QuestionType.Multiple) {
      if (
        Array.isArray(answer.value) &&
        Array.isArray(question.correctAnswer)
      ) {
        const given = new Set(answer.value);
        const correct = new Set(question.correctAnswer);
        isCorrect =
          given.size === correct.size &&
          [...given].every((val) => correct.has(val));
      }
    } else if (question.type === QuestionType.TrueFalse) {
      isCorrect = answer.value === question.correctAnswer;
    }

    if (isCorrect) pointsAwarded = question.points;
  }

  if (
    question.type === QuestionType.Short ||
    question.type === QuestionType.Broad
  ) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are an expert exam evaluator.
Evaluate the following student's answer against the correct answer.

Question: ${question.question}
Correct Answer: ${question.correctAnswer}
Student Answer: ${answer.value}

Rules:
1. Reply in JSON.
2. JSON must include:
   {
     "isCorrect": boolean,
     "pointsAwarded": number
   }
3. Award full ${question.points} if fully correct.
4. Award partial points if partially correct.
5. Award 0 if wrong.
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    try {
      const evalResult = JSON.parse(raw);
      isCorrect = evalResult.isCorrect;
      pointsAwarded = evalResult.pointsAwarded;
    } catch (err) {
      console.error("AI evaluation failed:", err, raw);
      isCorrect = false;
      pointsAwarded = 0;
    }
  }

  return await QuizAnswer.create({
    userId: new Types.ObjectId(userId),
    competitionId: new Types.ObjectId(competitionId),
    questionId: new Types.ObjectId(questionId),
    answer,
    isCorrect,
    pointsAwarded,
    submittedAt: new Date(),
  });
};

const getAllQuizAnswer = async () => {
  return await QuizAnswer.find().lean();
};

const getQuizAnswerById = async (id: string) => {
  return await QuizAnswer.findById(id).lean();
};

const updateQuizAnswer = async (id: string, payload: Partial<IQuizAnswer>) => {
  return await QuizAnswer.findByIdAndUpdate(id, payload, { new: true });
};

const deleteQuizAnswer = async (id: string) => {
  return await QuizAnswer.findByIdAndDelete(id);
};

export const quizAnswerService = {
  createQuizAnswer,
  getAllQuizAnswer,
  getQuizAnswerById,
  updateQuizAnswer,
  deleteQuizAnswer,
};
