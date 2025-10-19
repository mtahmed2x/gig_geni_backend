import { z } from "zod";

export const createMeetingSchema = z.object({});
export const updateMeetingSchema = createMeetingSchema.partial();

export type CreateMeetingDTO = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingDTO = z.infer<typeof updateMeetingSchema>;
