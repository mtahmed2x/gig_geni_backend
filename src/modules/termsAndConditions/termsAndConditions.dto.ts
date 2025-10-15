import { z } from "zod";

export const createTermsAndConditionsSchema = z.object({});
export const updateTermsAndConditionsSchema = createTermsAndConditionsSchema.partial();

export type CreateTermsAndConditionsDTO = z.infer<typeof createTermsAndConditionsSchema>;
export type UpdateTermsAndConditionsDTO = z.infer<typeof updateTermsAndConditionsSchema>;
