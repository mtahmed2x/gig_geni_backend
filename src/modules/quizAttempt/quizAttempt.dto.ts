import { z } from "zod";

export const createQuizAttemptSchema = z.object({});
export const updateQuizAttemptSchema = createQuizAttemptSchema.partial();

export type CreateQuizAttemptDTO = z.infer<typeof createQuizAttemptSchema>;
export type UpdateQuizAttemptDTO = z.infer<typeof updateQuizAttemptSchema>;
