import { Types } from "mongoose";
import { QuestionType } from "./quizQuestion.constant";

export interface IQuizQuestion {
  _id: Types.ObjectId;
  competition: Types.ObjectId;
  question: string;
  isMarkdown: boolean;
  type: QuestionType;
  options?: { text: string; isCorrect?: boolean }[];
  correctAnswer?: string | string[] | boolean;
  wordLimit?: number;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: Date;
  updatedAt: Date;
}
