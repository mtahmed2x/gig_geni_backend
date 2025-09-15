import { model, Schema } from "mongoose";
import { ICompetition } from "./competition.interface";

const participantSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    round1: {
      type: String,
      enum: ["not_started", "pending", "passed", "failed"],
      default: "not_started",
    },
    round2: {
      type: String,
      enum: ["not_started", "pending", "approved", "rejected"],
      default: "not_started",
    },
    round3: {
      type: String,
      enum: ["not_started", "scheduled", "approved", "rejected"],
      default: "not_started",
    },
    round4: {
      type: String,
      enum: ["not_started", "completed", "failed"],
      default: "not_started",
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const competitionSchema = new Schema<ICompetition>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    bannerImage: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    experienceLevel: { type: String },
    location: { type: String },
    workType: { type: String },

    skillsTested: { type: String, required: true },
    projectBrief: { type: String },
    evaluationCriteria: { type: String },

    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    resultDate: { type: String },
    prize: { type: String, required: true },
    maxParticipants: { type: Number, default: null },
    registrationFee: { type: String, enum: ["Free", "Paid"], required: true },

    submissionFormats: { type: [String], default: [] },
    additionalFiles: [
      {
        link: { type: String },
        description: { type: String },
      },
    ],
    termsAndConditions: { type: [String], default: [] },

    participants: { type: [participantSchema], default: [] },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "draft"],
      default: "active",
    },
    currentRound: { type: Number, default: 1 },
    totalRounds: { type: Number, default: 4 },
    totalApplicants: { type: Number, default: 1 },
    totalParticipants: { type: Number, default: 1 },
    completionRate: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Competition = model<ICompetition>(
  "Competition",
  competitionSchema
);
