import { model, Schema } from "mongoose";
import { IQuizSettings } from "./quizSettings.interface";

const quizSettingsSchema = new Schema<IQuizSettings>(
  {
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    passingScore: { type: Number, required: true, default: 50 },
    timeLimit: { type: Number, required: true, default: 300 }, // in seconds
    randomizeQuestions: { type: Boolean, required: true, default: false },
    showResults: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

export const QuizSettings = model<IQuizSettings>(
  "QuizSettings",
  quizSettingsSchema
);
