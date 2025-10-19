import { Types } from "mongoose";
import { ReviewStatus, Status } from "./competition.constant";

export interface ICompetition {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;

  bannerImage: string;
  title: string;
  description: string;
  category: string[];
  experienceLevel: string;
  location: string;
  workType: string;

  skillsTested: string;
  projectBrief: string;
  evaluationCriteria: string;

  startDate: string;
  endDate: string;
  resultDate: string;
  prize: string;
  maxParticipants?: number;
  registrationFee: "Free" | "Paid";

  submissionFormats: string[];
  additionalFiles: { link: string; description?: string }[];
  termsAndConditions: string[];

  quizSettings: {
    passingScore: number;
    timeLimit: number;
    randomizeQuestions: boolean;
    showResults: boolean;
  };

  totalParticipants: number;

  reviewStatus: ReviewStatus;
  reviewFeedback?: string;
  status: Status;

  createdAt: Date;
  updatedAt: Date;
}
