import { model, Schema } from "mongoose";
import { ITermsAndConditions } from "./termsAndConditions.interface";

const termsAndConditionsSchema = new Schema<ITermsAndConditions>({
  htmlText: {
    type: String,
    default: "<h1>Terms and Conditions</h1>",
  },
});

export const TermsAndConditions = model<ITermsAndConditions>(
  "TermsAndConditions",
  termsAndConditionsSchema
);
