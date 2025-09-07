import { z } from "zod";

export const createQuizQuestionSchema = z.object({});
export const updateQuizQuestionSchema = createQuizQuestionSchema.partial();

export type CreateQuizQuestionDTO = z.infer<typeof createQuizQuestionSchema>;
export type UpdateQuizQuestionDTO = z.infer<typeof updateQuizQuestionSchema>;
