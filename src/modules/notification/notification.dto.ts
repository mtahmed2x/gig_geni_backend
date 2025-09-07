import { z } from "zod";

export const createNotificationSchema = z.object({});
export const updateNotificationSchema = createNotificationSchema.partial();

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationDTO = z.infer<typeof updateNotificationSchema>;
