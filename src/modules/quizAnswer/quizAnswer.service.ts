import { StatusCodes } from "http-status-codes";
import { QuizQuestion } from "../quizQuestion/quizQuestion.models";
import { IQuizAnswer } from "./quizAnswer.interface";
import { QuizAnswer } from "./quizAnswer.models";
import { AppError } from "../../errors/appError";
import { Types } from "mongoose";
import { QuestionType } from "../quizQuestion/quizQuestion.constant";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizSettings } from "../quizSettings/quizSettings.models";
import { Competition } from "../competition/competition.models";

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
    answer === null ||
    answer === "" ||
    (Array.isArray(answer) && answer.length === 0)
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
        typeof answer === "string" && answer === question.correctAnswer;
    } else if (question.type === QuestionType.Multiple) {
      if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
        const given = new Set(answer);
        const correct = new Set(question.correctAnswer);
        isCorrect =
          given.size === correct.size &&
          [...given].every((val) => correct.has(val));
      }
    } else if (question.type === QuestionType.TrueFalse) {
      isCorrect = answer === question.correctAnswer;
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
Student Answer: ${answer}

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

const evaluate = async (competitionId: string) => {
  const competition = await Competition.findById(competitionId);
  if (!competition)
    throw new AppError(StatusCodes.NOT_FOUND, "Competition not found");
  const settings = await QuizSettings.findOne({ competitionId }).lean();
  if (!settings)
    throw new AppError(StatusCodes.NOT_FOUND, "Quiz settings not found");

  const answers = await QuizAnswer.find({ competitionId }).lean();
  if (!answers || answers.length === 0) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "No quiz answers found for this competition"
    );
  }

  const totalPoints = answers.reduce(
    (sum, answer) => sum + (answer.pointsAwarded || 0),
    0
  );
  if (totalPoints < settings.passingScore) {
    return {
      message:
        "You have not passed the quiz. You need to score at least " +
        settings.passingScore +
        " points to pass.",
      totalPoints,
      passingScore: settings.passingScore,
    };
  } else {
    competition.participants.push({
      user: answers[0]!.userId,
      round1: "passed",
      round2: "not_started",
      round3: "not_started",
      round4: "not_started",
      joinedAt: new Date(),
    });
    return {
      message: "Congratulations! You have passed the quiz.",
      totalPoints,
      passingScore: settings.passingScore,
    };
  }
};

export const quizAnswerService = {
  createQuizAnswer,
  getAllQuizAnswer,
  getQuizAnswerById,
  updateQuizAnswer,
  deleteQuizAnswer,
  evaluate,
};
