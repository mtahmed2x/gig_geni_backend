import { Types } from "mongoose";
import { ICompetition } from "./competition.interface";
import { Competition } from "./competition.models";
import { AppError } from "../../errors/appError";
import { StatusCodes } from "http-status-codes";

const createCompetition = async (payload: Partial<ICompetition>) => {
  return await Competition.create(payload);
};

const getAllCompetition = async (payload: {
  user?: string;
  userId?: string;
  participant?: string;
}) => {
  const { user, userId, participant } = payload;
  const query: Record<string, unknown> = {};

  if (user === "true" && userId) {
    query.createdBy = userId;
  }

  if (participant === "true" && userId) {
    query["participants.user"] = userId;
  }

  return await Competition.find(query)
    .populate([
      { path: "createdBy", select: "-password" },
      { path: "participants.user", select: "-password" },
    ])
    .lean();
};

const getCompetitionById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid competition ID format."
    );
  }

  const result = await Competition.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $addFields: {
        stats: {
          totalParticipants: { $size: "$participants" },

          round1Passed: {
            $size: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: { $eq: ["$$participant.round1", "passed"] },
              },
            },
          },

          // Calculate pending videos for round 2
          videosPending: {
            $size: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: { $eq: ["$$participant.round2", "pending"] },
              },
            },
          },

          // Calculate scheduled interviews for round 3
          interviewsScheduled: {
            $size: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: { $eq: ["$$participant.round3", "scheduled"] },
              },
            },
          },

          // Calculate completed for round 4
          completed: {
            $size: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: { $eq: ["$$participant.round4", "completed"] },
              },
            },
          },
        },
      },
    },
  ]);

  // The aggregation returns an array. If the competition was found, it will be the first element.
  const competitionWithStats = result[0];

  // If no competition was found, the result array will be empty.
  if (!competitionWithStats) {
    throw new AppError(StatusCodes.NOT_FOUND, "Competition not found.");
  }

  return competitionWithStats;
};

const joinCompetition = async (userId: string, competitionId: string) => {
  const competition = await Competition.findById(competitionId);
  if (!competition)
    throw new AppError(StatusCodes.NOT_FOUND, "Competition not found");
  competition.participants.push({
    user: new Types.ObjectId(userId),
    round1: "not_started",
    round2: "not_started",
    round3: "not_started",
    round4: "not_started",
    joinedAt: new Date(),
  });
  await competition.save();
  return competition;
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
  joinCompetition,
};
