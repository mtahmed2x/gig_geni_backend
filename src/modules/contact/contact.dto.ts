import { z } from "zod";

export const createContactSchema = z.object({});
export const updateContactSchema = createContactSchema.partial();

export type CreateContactDTO = z.infer<typeof createContactSchema>;
export type UpdateContactDTO = z.infer<typeof updateContactSchema>;
