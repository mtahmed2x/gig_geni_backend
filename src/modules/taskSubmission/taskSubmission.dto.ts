import { z } from "zod";

export const createTaskSubmissionSchema = z.object({});
export const updateTaskSubmissionSchema = createTaskSubmissionSchema.partial();

export type CreateTaskSubmissionDTO = z.infer<typeof createTaskSubmissionSchema>;
export type UpdateTaskSubmissionDTO = z.infer<typeof updateTaskSubmissionSchema>;
