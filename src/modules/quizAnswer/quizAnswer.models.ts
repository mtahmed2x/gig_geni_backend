import { Schema, model } from "mongoose";
import { IQuizAnswer } from "./quizAnswer.interface";

const quizAnswerSchema = new Schema<IQuizAnswer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "QuizQuestion",
      required: true,
    },

    answer: { type: Schema.Types.Mixed, required: false },

    isCorrect: { type: Boolean, default: null },
    pointsAwarded: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const QuizAnswer = model("QuizAnswer", quizAnswerSchema);
