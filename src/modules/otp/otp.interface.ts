import { Types } from "mongoose";

export interface IOtp {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}
