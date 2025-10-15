import { ReviewStatus, Status } from "../competition/competition.constant";
import { Competition } from "../competition/competition.models";
import { UserRole } from "../user/user.constant";
import { User } from "../user/user.models";
import { IAdminDashboard } from "./adminDashboard.interface";
import { AdminDashboard } from "./adminDashboard.models";

const createAdminDashboard = async (payload: Partial<IAdminDashboard>) => {
  return await AdminDashboard.create(payload);
};

const getAllAdminDashboard = async () => {
  const totalUsers = await User.countDocuments({
    role: { $ne: UserRole.Admin },
  });
  const totalCompetitions = await Competition.countDocuments();
  const totalActiveCompetitions = await Competition.countDocuments({
    status: Status.Active,
  });
  const totalRevenue = "125,000";
  const growthRate = "15.3";
  const totalEmployee = await User.countDocuments({ role: UserRole.Employee });
  const totalEmployer = await User.countDocuments({ role: UserRole.Employer });
  const users = await User.find({
    role: { $ne: UserRole.Admin },
    verified: true,
    suspended: false,
    active: true,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  const competitions = await Competition.find({ status: Status.Active })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return {
    totalUsers,
    totalCompetitions,
    totalActiveCompetitions,
    totalRevenue,
    growthRate,
    totalEmployee,
    totalEmployer,
    users,
    competitions,
  };
};

const getAdminDashboardById = async (id: string) => {
  return await AdminDashboard.findById(id).lean();
};

const updateAdminDashboard = async (
  id: string,
  payload: Partial<IAdminDashboard>
) => {
  return await AdminDashboard.findByIdAndUpdate(id, payload, { new: true });
};

const deleteAdminDashboard = async (id: string) => {
  return await AdminDashboard.findByIdAndDelete(id);
};

const getAllUser = async (payload: {
  role?: UserRole;
  page?: number | string;
  limit?: number | string;
}) => {
  await User.updateMany({}, { active: true, suspended: false });
  const page = parseInt(String(payload.page ?? 1), 10);
  const limit = parseInt(String(payload.limit ?? 10), 10);
  const { role } = payload;
  const filter: Record<string, unknown> = { role: { $ne: UserRole.Admin } };
  if (role) {
    filter.role = role;
  }
  const skip = (page - 1) * limit;

  const [
    users,
    total,
    totalUsers,
    activeUsers,
    suspendedUsers,
    employeeCount,
    employerCount,
    verifiedUsers,
  ] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
    User.countDocuments({ role: { $ne: UserRole.Admin } }),
    User.countDocuments({ role: { $ne: UserRole.Admin }, active: true }),
    User.countDocuments({ role: { $ne: UserRole.Admin }, suspended: true }),
    User.countDocuments({ role: UserRole.Employee }),
    User.countDocuments({ role: UserRole.Employer }),
    User.countDocuments({ role: { $ne: UserRole.Admin }, verified: true }),
  ]);

  const data = {
    totalUsers,
    activeUsers,
    suspendedUsers,
    employeeCount,
    employerCount,
    verifiedUsers,
    totalRevenue: "125,000",
    growthRate: "15.3",
    users,
  };

  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

const getAllCompetition = async (payload: {
  page?: number | string;
  limit?: number | string;
}) => {
  const page = parseInt(String(payload.page ?? 1), 10);
  const limit = parseInt(String(payload.limit ?? 10), 10);

  const skip = (page - 1) * limit;

  const [
    competitions,
    total,
    totalPendingCompetitions,
    totalApprovedCompetitions,
    totalActiveCompetitions,
    totalCompletedCompetitions,
    totalRejectedCompetitions,
  ] = await Promise.all([
    Competition.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Competition.countDocuments(),
    Competition.countDocuments({ reviewStatus: ReviewStatus.Pending }),
    Competition.countDocuments({ reviewStatus: ReviewStatus.Approved }),
    Competition.countDocuments({ status: Status.Active }),
    Competition.countDocuments({ status: Status.Completed }),
    Competition.countDocuments({ status: ReviewStatus.Rejected }),
  ]);

  const data = {
    totalPendingCompetitions,
    totalApprovedCompetitions,
    totalActiveCompetitions,
    totalCompletedCompetitions,
    totalRejectedCompetitions,
    competitions,
    total,
  };

  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

export const adminDashboardService = {
  createAdminDashboard,
  getAllAdminDashboard,
  getAdminDashboardById,
  updateAdminDashboard,
  deleteAdminDashboard,
  getAllUser,
  getAllCompetition,
};
