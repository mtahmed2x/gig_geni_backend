import { model, Schema } from "mongoose";
import { ICompetition } from "./competition.interface";

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
  },
  { timestamps: true }
);

export const Competition = model<ICompetition>(
  "Competition",
  competitionSchema
);
