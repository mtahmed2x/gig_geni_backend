import { Types } from "mongoose";
import { QuestionType } from "./quizQuestion.constant";

export interface IQuizQuestion {
  _id: Types.ObjectId;
  competition: Types.ObjectId;
  question: string;
  type: QuestionType;
  options?: { text: string; isCorrect?: boolean }[];
  correctAnswer?: string | string[] | boolean;
  wordLimit?: number;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
