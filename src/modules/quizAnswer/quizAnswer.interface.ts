import { Types } from "mongoose";

export interface IQuizAnswer {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  competitionId: Types.ObjectId;
  questionId: Types.ObjectId;

  answer?: string | string[] | boolean | null;

  isCorrect?: boolean;
  pointsAwarded?: number;
  submittedAt: Date;
}
