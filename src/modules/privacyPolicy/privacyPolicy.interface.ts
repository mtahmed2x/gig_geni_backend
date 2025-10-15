import { Types } from "mongoose";

export interface IPrivacyPolicy {
  _id: Types.ObjectId;
  htmlText: string;
}
