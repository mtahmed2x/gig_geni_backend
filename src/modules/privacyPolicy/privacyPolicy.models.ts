import { model, Schema } from "mongoose";
import { IPrivacyPolicy } from "./privacyPolicy.interface";

const privacyPolicySchema = new Schema<IPrivacyPolicy>({
  htmlText: {
    type: String,
    default: "<h1>Privacy Policy</h1>",
  },
});

export const PrivacyPolicy = model<IPrivacyPolicy>(
  "PrivacyPolicy",
  privacyPolicySchema
);
