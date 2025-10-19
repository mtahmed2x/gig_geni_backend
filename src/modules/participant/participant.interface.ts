import { Types } from "mongoose";
import { RoundStatus } from "./participant.constant";

export interface IParticipant {
  _id: Types.ObjectId;

  competition: Types.ObjectId;
  user: Types.ObjectId;

  isEliminated: boolean;
  isWinner: boolean;

  round1_quiz: {
    status: RoundStatus;
    score?: number;
    attemptId?: Types.ObjectId;
  };

  round2_video: {
    status: RoundStatus;
    videoUrl?: string;
    submittedAt?: Date;
    feedback?: string;
  };

  round3_meeting: {
    status: RoundStatus;
    meetingId?: Types.ObjectId;
    feedback?: string;
  };

  round4_task: {
    status: RoundStatus;
    taskSubmissionId?: Types.ObjectId;
    presentationMeetingId?: Types.ObjectId;
    feedback?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
