import { IPrivacyPolicy } from "./privacyPolicy.interface";
import { PrivacyPolicy } from "./privacyPolicy.models";

const getAllPrivacyPolicy = async () => {
  return await PrivacyPolicy.findOne().lean();
};

const updatePrivacyPolicy = async (
  id: string,
  payload: Partial<IPrivacyPolicy>
) => {
  return await PrivacyPolicy.findByIdAndUpdate(id, payload, { new: true });
};

export const privacyPolicyService = {
  getAllPrivacyPolicy,
  updatePrivacyPolicy,
};
