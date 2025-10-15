import { z } from "zod";

export const createPrivacyPolicySchema = z.object({});
export const updatePrivacyPolicySchema = createPrivacyPolicySchema.partial();

export type CreatePrivacyPolicyDTO = z.infer<typeof createPrivacyPolicySchema>;
export type UpdatePrivacyPolicyDTO = z.infer<typeof updatePrivacyPolicySchema>;
