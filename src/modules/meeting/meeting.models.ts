import { model, Schema } from "mongoose";
import { IMeeting } from "./meeting.interface";

const meetingSchema = new Schema<IMeeting>(
  {
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    round: {
      type: Number,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    meetingLink: {
      type: String,
    },
    scheduledTime: {
      type: Date,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
  },
  { timestamps: true }
);

export const Meeting = model<IMeeting>("Meeting", meetingSchema);
