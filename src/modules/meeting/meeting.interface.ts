import { Types } from "mongoose";

export interface IMeeting {
  _id: Types.ObjectId;
  competition: Types.ObjectId;

  round: 3 | 4;

  title: string;
  description?: string;
  meetingLink: string;
  scheduledTime: Date;

  attendees: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}
