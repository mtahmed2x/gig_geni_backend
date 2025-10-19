import { Types } from "mongoose";

export interface IUserAnswer {
  question: Types.ObjectId;
  answer: string | string[] | boolean | null;
  isCorrect: boolean;
  pointsAwarded: number;
}

export interface IQuizAttempt {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  competitionId: Types.ObjectId;

  answers: IUserAnswer[];

  totalScore: number;
  passed: boolean;

  createdAt: Date;
  updatedAt: Date;
}
