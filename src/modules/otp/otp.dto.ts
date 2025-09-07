import { z } from "zod";

export const createOtpSchema = z.object({});
export const updateOtpSchema = createOtpSchema.partial();

export type CreateOtpDTO = z.infer<typeof createOtpSchema>;
export type UpdateOtpDTO = z.infer<typeof updateOtpSchema>;
