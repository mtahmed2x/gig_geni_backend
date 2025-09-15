import { Types } from "mongoose";

export interface IParticipant {
  user: Types.ObjectId;
  round1: "not_started" | "pending" | "passed" | "failed";
  round2: "not_started" | "pending" | "approved" | "rejected";
  round3: "not_started" | "scheduled" | "approved" | "rejected";
  round4: "not_started" | "completed" | "failed";
  joinedAt: Date;
}

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

  participants: IParticipant[];

  status: "active" | "completed" | "draft" | "paused";
  currentRound: number;
  totalRounds: number;
  totalApplicants: number;
  totalParticipants: number;
  completionRate: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
