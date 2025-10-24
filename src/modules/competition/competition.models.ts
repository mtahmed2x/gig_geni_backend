import { model, Schema } from "mongoose";
import { ICompetition } from "./competition.interface";
import { ReviewStatus, Status } from "./competition.constant";

const competitionSchema = new Schema<ICompetition>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    bannerImage: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: [{ type: String, required: true }],
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

    quizSettings: {
      totalPoints: {type: Number, required: true, default: 0 },
      passingScore: { type: Number, required: true, default: 50 },
      timeLimit: { type: Number, required: true, default: 300 },
      randomizeQuestions: { type: Boolean, required: true, default: false },
      showResults: { type: Boolean, required: true, default: true },
    },

    totalParticipants: { type: Number, default: 0 },

    reviewStatus: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.Pending,
    },
    reviewFeedback: { type: String, default: null },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
  }
);

competitionSchema.virtual("participants", {
  ref: "Participant", // The model to use
  localField: "_id", // Find participants where `localField`
  foreignField: "competition", // matches `foreignField`
});

export const Competition = model<ICompetition>(
  "Competition",
  competitionSchema
);
