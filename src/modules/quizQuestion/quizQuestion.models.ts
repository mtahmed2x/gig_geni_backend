import { Schema, model } from "mongoose";
import { IQuizQuestion } from "./quizQuestion.interface";
import { QuestionType } from "./quizQuestion.constant";

const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    question: { type: String, required: true },
    isMarkdown: {type: Boolean, required: true, default: false },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
    },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    correctAnswer: { type: Schema.Types.Mixed },
    wordLimit: { type: Number },
    points: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  { timestamps: true }
);

export const QuizQuestion = model<IQuizQuestion>(
  "QuizQuestion",
  quizQuestionSchema
);
