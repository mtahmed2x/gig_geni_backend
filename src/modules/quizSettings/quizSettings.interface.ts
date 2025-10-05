import { Types } from "mongoose";

export interface IQuizSettings {
  _id: Types.ObjectId;
  competitionId: Types.ObjectId;
  passingScore: number;
  timeLimit: number;
  randomizeQuestions: boolean;
  showResults: boolean;
}
