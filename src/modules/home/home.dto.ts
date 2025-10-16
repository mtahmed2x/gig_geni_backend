import { z } from "zod";

export const createHomeSchema = z.object({});
export const updateHomeSchema = createHomeSchema.partial();

export type CreateHomeDTO = z.infer<typeof createHomeSchema>;
export type UpdateHomeDTO = z.infer<typeof updateHomeSchema>;
