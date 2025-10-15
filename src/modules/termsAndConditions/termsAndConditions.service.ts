import { ITermsAndConditions } from "./termsAndConditions.interface";
import { TermsAndConditions } from "./termsAndConditions.models";

const getAllTermsAndConditions = async () => {
  return await TermsAndConditions.findOne().lean();
};

const updateTermsAndConditions = async (
  id: string,
  payload: Partial<ITermsAndConditions>
) => {
  return await TermsAndConditions.findByIdAndUpdate(id, payload, { new: true });
};

export const termsAndConditionsService = {
  getAllTermsAndConditions,
  updateTermsAndConditions,
};
