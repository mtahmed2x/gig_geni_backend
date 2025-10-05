import { IQuizSettings } from "./quizSettings.interface";
import { QuizSettings } from "./quizSettings.models";

const createQuizSettings = async (payload: Partial<IQuizSettings>) => {
  return await QuizSettings.create(payload);
};

const getAllQuizSettings = async (payload: { competitionId?: string }) => {
  const query: Record<string, unknown> = {};
  if (payload.competitionId) {
    query.competitionId = payload.competitionId;
    return await QuizSettings.findOne(query).lean();
  }
  return await QuizSettings.find().lean();
};

const getQuizSettingsById = async (id: string) => {
  return await QuizSettings.findById(id).lean();
};

const updateQuizSettings = async (
  id: string,
  payload: Partial<IQuizSettings>
) => {
  return await QuizSettings.findByIdAndUpdate(id, payload, { new: true });
};

const deleteQuizSettings = async (id: string) => {
  return await QuizSettings.findByIdAndDelete(id);
};

export const quizSettingsService = {
  createQuizSettings,
  getAllQuizSettings,
  getQuizSettingsById,
  updateQuizSettings,
  deleteQuizSettings,
};
