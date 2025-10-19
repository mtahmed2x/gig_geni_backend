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
  const competitionPopulateOptions = [
    { path: "createdBy", select: "-password" },
    {
      path: "participants",
      populate: {
        path: "user",
        select: "-password",
      },
    },
  ];

  const competitions = await Competition.find({ status: Status.Active })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate(competitionPopulateOptions)
    .lean({ virtuals: true });

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

  const totalPage = Math.ceil(total / limit);

  return {
    data: {
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        employeeCount,
        employerCount,
        verifiedUsers,
        totalRevenue: "125,000",
        growthRate: "15.3",
      },
      users,
    },
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

  const result = await Competition.aggregate([
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              totalPendingCompetitions: {
                $sum: {
                  $cond: [
                    { $eq: ["$reviewStatus", ReviewStatus.Pending] },
                    1,
                    0,
                  ],
                },
              },
              totalApprovedCompetitions: {
                $sum: {
                  $cond: [
                    { $eq: ["$reviewStatus", ReviewStatus.Approved] },
                    1,
                    0,
                  ],
                },
              },
              totalActiveCompetitions: {
                $sum: { $cond: [{ $eq: ["$status", Status.Active] }, 1, 0] },
              },
              totalCompletedCompetitions: {
                $sum: { $cond: [{ $eq: ["$status", Status.Completed] }, 1, 0] },
              },
              totalRejectedCompetitions: {
                $sum: {
                  $cond: [
                    { $eq: ["$reviewStatus", ReviewStatus.Rejected] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const competitions = result[0].data;
  const countsData = result[0].metadata[0] || {};

  const total = countsData.total || 0;
  const totalPage = Math.ceil(total / limit);

  return {
    data: {
      stats: {
        totalPendingCompetitions: countsData.totalPendingCompetitions || 0,
        totalApprovedCompetitions: countsData.totalApprovedCompetitions || 0,
        totalActiveCompetitions: countsData.totalActiveCompetitions || 0,
        totalCompletedCompetitions: countsData.totalCompletedCompetitions || 0,
        totalRejectedCompetitions: countsData.totalRejectedCompetitions || 0,
      },
      competitions,
    },

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
