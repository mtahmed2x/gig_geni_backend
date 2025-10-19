import { Types } from "mongoose";

export interface ITaskSubmission {
  _id: Types.ObjectId;

  participant: Types.ObjectId;
  competition: Types.ObjectId;

  submissionLink: string;
  submissionNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}
