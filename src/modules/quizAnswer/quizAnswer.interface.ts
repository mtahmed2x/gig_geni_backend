import { Types } from "mongoose";
import { QuizAnswerValue } from "./quizAnswer.constant";

export interface IQuizAnswer {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  competitionId: Types.ObjectId;
  questionId: Types.ObjectId;

  answer?: QuizAnswerValue;

  isCorrect?: boolean;
  pointsAwarded?: number;
  submittedAt: Date;
}
