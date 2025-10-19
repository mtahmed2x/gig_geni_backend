import { ITaskSubmission } from "./taskSubmission.interface";
import { TaskSubmission } from "./taskSubmission.models";

const createTaskSubmission = async (payload: Partial<ITaskSubmission>) => {
  return await TaskSubmission.create(payload);
};

const getAllTaskSubmission = async () => {
  return await TaskSubmission.find().lean();
};

const getTaskSubmissionById = async (id: string) => {
  return await TaskSubmission.findById(id).lean();
};

const updateTaskSubmission = async (id: string, payload: Partial<ITaskSubmission>) => {
  return await TaskSubmission.findByIdAndUpdate(id, payload, { new: true });
};

const deleteTaskSubmission = async (id: string) => {
  return await TaskSubmission.findByIdAndDelete(id);
};

export const taskSubmissionService = {
  createTaskSubmission,
  getAllTaskSubmission,
  getTaskSubmissionById,
  updateTaskSubmission,
  deleteTaskSubmission,
};