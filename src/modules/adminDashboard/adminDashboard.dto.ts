import { z } from "zod";

export const createAdminDashboardSchema = z.object({});
export const updateAdminDashboardSchema = createAdminDashboardSchema.partial();

export type CreateAdminDashboardDTO = z.infer<typeof createAdminDashboardSchema>;
export type UpdateAdminDashboardDTO = z.infer<typeof updateAdminDashboardSchema>;
