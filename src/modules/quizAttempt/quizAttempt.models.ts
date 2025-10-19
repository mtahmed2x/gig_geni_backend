import { Schema, model } from "mongoose";
import { IQuizAttempt, IUserAnswer } from "./quizAttempt.interface";

const userAnswerSchema = new Schema<IUserAnswer>(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "QuizQuestion",
      required: true,
    },
    answer: { type: Schema.Types.Mixed },
    isCorrect: { type: Boolean, required: true, default: false },
    pointsAwarded: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    answers: [userAnswerSchema],
    totalScore: { type: Number, required: true, default: 0 },
    passed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const QuizAttempt = model<IQuizAttempt>(
  "QuizAttempt",
  quizAttemptSchema
);
