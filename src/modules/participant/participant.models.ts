import { Schema, model } from "mongoose";
import { IParticipant } from "./participant.interface";
import { RoundStatus } from "./participant.constant";

const participantSchema = new Schema<IParticipant>(
  {
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isEliminated: { type: Boolean, default: false },
    isWinner: { type: Boolean, default: false },

    round1_quiz: {
      status: {
        type: String,
        enum: Object.values(RoundStatus),
        default: RoundStatus.PENDING,
      },
      score: { type: Number },
      attemptId: { type: Schema.Types.ObjectId, ref: "QuizAttempt" },
    },

    round2_video: {
      status: {
        type: String,
        enum: Object.values(RoundStatus),
        default: RoundStatus.NOT_STARTED,
      },
      videoUrl: { type: String },
      submittedAt: { type: Date },
      feedback: { type: String },
    },

    round3_meeting: {
      status: {
        type: String,
        enum: Object.values(RoundStatus),
        default: RoundStatus.NOT_STARTED,
      },
      meetingId: { type: Schema.Types.ObjectId, ref: "Meeting" },
      feedback: { type: String },
    },

    round4_task: {
      status: {
        type: String,
        enum: Object.values(RoundStatus),
        default: RoundStatus.NOT_STARTED,
      },
      taskSubmissionId: { type: Schema.Types.ObjectId, ref: "TaskSubmission" },
      presentationMeetingId: { type: Schema.Types.ObjectId, ref: "Meeting" },
      feedback: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const Participant = model<IParticipant>(
  "Participant",
  participantSchema
);
