import { Types } from "mongoose";

export interface ICompetition {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;

  bannerImage: string;
  title: string;
  description: string;
  category: string;
  experienceLevel: string;
  location: string;
  workType: string;

  skillsTested: string[];
  projectBrief: string;
  evaluationCriteria: string[];

  startDate: Date;
  endDate: Date;
  resultDate: Date;
  prize: string;
  maxParticipants?: number;
  registrationFee: "Free" | "Paid";

  submissionFormats: string[];
  additionalFiles: { link: string; description?: string }[];
  termsAndConditions: string[];

  createdAt: Date;
  updatedAt: Date;
}
