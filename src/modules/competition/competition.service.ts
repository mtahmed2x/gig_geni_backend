import { ICompetition } from "./competition.interface";
import { Competition } from "./competition.models";

const createCompetition = async (payload: Partial<ICompetition>) => {
  return await Competition.create(payload);
};

const getAllCompetition = async () => {
  return await Competition.find().lean();
};

const getCompetitionById = async (id: string) => {
  return await Competition.findById(id).lean();
};

const updateCompetition = async (id: string, payload: Partial<ICompetition>) => {
  return await Competition.findByIdAndUpdate(id, payload, { new: true });
};

const deleteCompetition = async (id: string) => {
  return await Competition.findByIdAndDelete(id);
};

export const competitionService = {
  createCompetition,
  getAllCompetition,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
};