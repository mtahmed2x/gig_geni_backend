import { z } from "zod";

export const createQuizSettingsSchema = z.object({});
export const updateQuizSettingsSchema = createQuizSettingsSchema.partial();

export type CreateQuizSettingsDTO = z.infer<typeof createQuizSettingsSchema>;
export type UpdateQuizSettingsDTO = z.infer<typeof updateQuizSettingsSchema>;
