import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { QuizQuestion } from "../quizQuestion/quizQuestion.models";
import { QuestionType } from "../quizQuestion/quizQuestion.constant";
import { Participant } from "../participant/participant.models";
import { IUserAnswer } from "./quizAttempt.interface";
import { QuizAttempt } from "./quizAttempt.models";
import { Competition } from "../competition/competition.models";
import { RoundStatus } from "../participant/participant.constant";

interface SubmissionPayload {
  userId: string;
  competitionId: string;
  answers: {
    questionId: string;
    answer: string | string[] | boolean | null;
  }[];
}

const submitQuizAttempt = async (payload: SubmissionPayload) => {
  const { userId, competitionId, answers: userAnswers } = payload;

  const [competition, questions, participant] = await Promise.all([
    Competition.findById(competitionId).lean(),
    QuizQuestion.find({ competition: competitionId }).lean(),
    Participant.findOne({ user: userId, competition: competitionId }),
  ]);

  if (!competition)
    throw new AppError(StatusCodes.NOT_FOUND, "Competition not found");

  if (!participant) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "You are not a registered participant of this competition."
    );
  }

  const questionsMap = new Map(questions.map((q) => [q._id.toString(), q]));

  const processedAnswers: IUserAnswer[] = [];
  const subjectiveEvaluationPromises: Promise<IUserAnswer>[] = [];

  for (const userAnswer of userAnswers) {
    const question = questionsMap.get(userAnswer.questionId);
    if (!question) continue;

    if (
      question.type === QuestionType.Single ||
      question.type === QuestionType.Multiple ||
      question.type === QuestionType.TrueFalse
    ) {
      processedAnswers.push(
        evaluateObjectiveAnswer(question, userAnswer.answer)
      );
    } else if (
      question.type === QuestionType.Short ||
      question.type === QuestionType.Broad
    ) {
      subjectiveEvaluationPromises.push(
        evaluateSubjectiveAnswer(question, userAnswer.answer)
      );
    }
  }

  const evaluatedSubjectiveAnswers = await Promise.all(
    subjectiveEvaluationPromises
  );
  const allAnswers = [...processedAnswers, ...evaluatedSubjectiveAnswers];

  const totalScore = allAnswers.reduce(
    // By using parseFloat, we ensure that even if the AI returns a string "9.5",
    // it gets correctly converted to a number before being added to the sum.
    (sum, ans) => sum + (parseFloat(String(ans.pointsAwarded)) || 0),
    0
  );
  const passed = totalScore >= competition.quizSettings.passingScore;

  const quizAttempt = await QuizAttempt.create({
    userId,
    competitionId,
    answers: allAnswers,
    totalScore,
    passed,
  });

  participant.round1_quiz.status = passed
    ? RoundStatus.PASSED
    : RoundStatus.FAILED;
  participant.round1_quiz.score = totalScore;
  if (!passed) {
    participant.isEliminated = true;
  }
  await participant.save();

  return {
    message: passed
      ? "Congratulations! You have passed the quiz."
      : "You have not passed the quiz. You needed " +
        competition.quizSettings.passingScore +
        " to pass.",
    attempt: quizAttempt,
  };
};

const evaluateObjectiveAnswer = (question: any, answer: any): IUserAnswer => {
  let isCorrect = false;

  if (
    answer !== null && // Also check for null explicitly
    answer !== undefined &&
    answer !== "" &&
    (!Array.isArray(answer) || answer.length > 0)
  ) {
    if (question.type === QuestionType.Single) {
      isCorrect = answer === question.correctAnswer;
    } else if (question.type === QuestionType.Multiple) {
      if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
        const given = new Set(answer);
        const correct = new Set(question.correctAnswer);
        isCorrect =
          given.size === correct.size &&
          [...given].every((val) => correct.has(val));
      }
    } else if (question.type === QuestionType.TrueFalse) {
      // --- FIX IS HERE ---
      // Convert both the submitted answer and the correct answer to strings before comparing.
      // This handles the case where one is a boolean (false) and the other is a string ("false").
      isCorrect = String(answer) === String(question.correctAnswer);
    }
  }

  return {
    question: question._id,
    answer,
    isCorrect,
    pointsAwarded: isCorrect ? question.points : 0,
  };
};

const evaluateSubjectiveAnswer = async (
  question: any,
  answer: any
): Promise<IUserAnswer> => {
  if (!answer || answer === "") {
    return {
      question: question._id,
      answer,
      isCorrect: false,
      pointsAwarded: 0,
    };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
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

  try {
    const result = await model.generateContent(prompt);
    const evalResult = JSON.parse(result.response.text());
    return {
      question: question._id,
      answer,
      isCorrect: evalResult.isCorrect || false,
      pointsAwarded: Math.min(evalResult.pointsAwarded || 0, question.points), // Ensure AI doesn't award more than max points
    };
  } catch (err) {
    console.error("AI evaluation failed for question:", question._id, err);
    return {
      question: question._id,
      answer,
      isCorrect: false,
      pointsAwarded: 0,
    };
  }
};

const getAllAttemptsForCompetition = async (competitionId: string) => {
  return await QuizAttempt.find({ competitionId }).lean();
};

const getAttemptById = async (id: string) => {
  return await QuizAttempt.findById(id).lean();
};

export const quizAttemptService = {
  submitQuizAttempt,
  getAllAttemptsForCompetition,
  getAttemptById,
};
