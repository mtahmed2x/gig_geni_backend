import { model, Schema } from "mongoose";
import { ITaskSubmission } from "./taskSubmission.interface";

const taskSubmissionSchema = new Schema<ITaskSubmission>(
  {
    participant: {
      type: Schema.Types.ObjectId,
      ref: "Participant",
    },
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
    },
    submissionLink: {
      type: String,
    },
    submissionNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

export const TaskSubmission = model<ITaskSubmission>(
  "TaskSubmission",
  taskSubmissionSchema
);
