import { z } from "zod";

export const createParticipantSchema = z.object({});
export const updateParticipantSchema = createParticipantSchema.partial();

export type CreateParticipantDTO = z.infer<typeof createParticipantSchema>;
export type UpdateParticipantDTO = z.infer<typeof updateParticipantSchema>;
