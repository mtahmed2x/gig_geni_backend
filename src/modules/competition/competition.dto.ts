import { z } from "zod";

export const createCompetitionSchema = z.object({});
export const updateCompetitionSchema = createCompetitionSchema.partial();

export type CreateCompetitionDTO = z.infer<typeof createCompetitionSchema>;
export type UpdateCompetitionDTO = z.infer<typeof updateCompetitionSchema>;
