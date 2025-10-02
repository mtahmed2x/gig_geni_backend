import { z } from "zod";

export const createQuizAnswerSchema = z.object({});
export const updateQuizAnswerSchema = createQuizAnswerSchema.partial();

export type CreateQuizAnswerDTO = z.infer<typeof createQuizAnswerSchema>;
export type UpdateQuizAnswerDTO = z.infer<typeof updateQuizAnswerSchema>;
