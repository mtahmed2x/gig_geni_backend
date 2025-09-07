import { Types } from "mongoose";
import { ICompetition } from "./competition.interface";
import { Competition } from "./competition.models";

const createCompetition = async (payload: Partial<ICompetition>) => {
  return await Competition.create(payload);
};

const getAllCompetition = async (payload: {
  user?: string;
  createdBy: string;
}) => {
  const { user, createdBy } = payload;
  const query: Record<string, unknown> = {};
  if (user === "true" && createdBy) query.createdBy = createdBy;
  return await Competition.find(query)
    .populate([
      { path: "createdBy", select: "-password" },
      { path: "participants.user", select: "-password" },
    ])
    .lean();
};

const getCompetitionById = async (id: string) => {
  return await Competition.findById(id).lean();
};

const updateCompetition = async (
  id: string,
  payload: Partial<ICompetition>
) => {
  return await Competition.findByIdAndUpdate(id, payload, { new: true });
};

const deleteCompetition = async (id: string) => {
  return await Competition.findByIdAndDelete(id);
};

const getCompetitionStats = async (competitionId: string) => {
  const stats = await Competition.aggregate([
    { $match: { _id: new Types.ObjectId(competitionId) } },
    { $unwind: "$participants" },
    {
      $group: {
        _id: null,
        totalParticipants: { $sum: 1 },
        round1Passed: {
          $sum: { $cond: [{ $eq: ["$participants.round1", "passed"] }, 1, 0] },
        },
        videosPending: {
          $sum: { $cond: [{ $eq: ["$participants.round2", "pending"] }, 1, 0] },
        },
        interviewsScheduled: {
          $sum: {
            $cond: [{ $eq: ["$participants.round3", "scheduled"] }, 1, 0],
          },
        },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$participants.round4", "completed"] }, 1, 0],
          },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalParticipants: 0,
      round1Passed: 0,
      videosPending: 0,
      interviewsScheduled: 0,
      completed: 0,
    }
  );
};

export const competitionService = {
  createCompetition,
  getAllCompetition,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
  getCompetitionStats,
};
