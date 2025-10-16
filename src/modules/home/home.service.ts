import { ReviewStatus, Status } from "../competition/competition.constant";
import { Competition } from "../competition/competition.models";
import { UserRole } from "../user/user.constant";
import { User } from "../user/user.models";
import { IHome } from "./home.interface";
import { Home } from "./home.models";

const createHome = async (payload: Partial<IHome>) => {
  return await Home.create(payload);
};

const getAllHome = async () => {
  const activeCompetitions = await Competition.countDocuments({
    reviewStatus: ReviewStatus.Approved,
    status: Status.Active,
  });
  const completedCompetitions = await Competition.countDocuments({
    reviewStatus: ReviewStatus.Approved,
    status: Status.Completed,
  });
  const activeHirer = await User.countDocuments({ role: UserRole.Employer });
  const activeTalent = await User.countDocuments({ role: UserRole.Employee });
  return {
    activeCompetitions,
    completedCompetitions,
    activeHirer,
    activeTalent,
  };
};

const getHomeById = async (id: string) => {
  return await Home.findById(id).lean();
};

const updateHome = async (id: string, payload: Partial<IHome>) => {
  return await Home.findByIdAndUpdate(id, payload, { new: true });
};

const deleteHome = async (id: string) => {
  return await Home.findByIdAndDelete(id);
};

export const homeService = {
  createHome,
  getAllHome,
  getHomeById,
  updateHome,
  deleteHome,
};
