import { Types } from 'mongoose';
import { ICompetition } from './competition.interface';
import { Competition } from './competition.models';
import { AppError } from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import { Participant } from '../participant/participant.models';
import { User } from '../user/user.models';
import { QuizQuestion } from '../quizQuestion/quizQuestion.models';

const createCompetition = async (payload: Partial<ICompetition>) => {
  return await Competition.create(payload);
};

const getAllCompetition = async (payload: {
  user?: string;
  userId?: string;
  participant?: string;
}) => {
  const { user, userId, participant } = payload;

  // Define the populate options once to reuse them
  const populateOptions = [
    { path: 'createdBy', select: '-password' },
    // This is the new, nested populate for participants and their users
    {
      path: 'participants', // This populates the virtual field we defined
      populate: {
        path: 'user', // In each participant, populate the 'user' field
        select: '-password', // Exclude the password
      },
    },
  ];

  if (user === 'true' && userId) {
    const query = { createdBy: new Types.ObjectId(userId) };
    return await Competition.find(query).populate(populateOptions).lean({ virtuals: true });
  }

  if (participant === 'true' && userId) {
    const participantEntries = await Participant.find({
      user: new Types.ObjectId(userId),
    })
      .select('competition')
      .lean();

    const competitionIds = participantEntries.map((p) => p.competition);

    if (competitionIds.length === 0) {
      return [];
    }

    const query = { _id: { $in: competitionIds } };
    return await Competition.find(query).populate(populateOptions).lean({ virtuals: true });
  }

  // Default case: get all competitions
  return await Competition.find({}).populate(populateOptions).lean({ virtuals: true });
};

const getCompetitionById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid competition ID format.');
  }

  const result = await Competition.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'participants',
        localField: '_id',
        foreignField: 'competition',
        as: 'participants',
      },
    },
    {
      $addFields: {
        stats: {
          totalParticipants: { $size: '$participants' },
          round1Passed: {
            $size: {
              $filter: {
                input: '$participants',
                as: 'p',
                cond: { $eq: ['$$p.round1_quiz.status', 'passed'] },
              },
            },
          },
          videosPendingReview: {
            $size: {
              $filter: {
                input: '$participants',
                as: 'p',
                cond: {
                  $eq: ['$$p.round2_video.status', 'submitted'],
                },
              },
            },
          },
          interviewsScheduled: {
            $size: {
              $filter: {
                input: '$participants',
                as: 'p',
                cond: {
                  $eq: ['$$p.round3_meeting.status', 'scheduled'],
                },
              },
            },
          },
          tasksCompleted: {
            $size: {
              $filter: {
                input: '$participants',
                as: 'p',
                cond: {
                  $eq: ['$$p.round4_task.status', 'completed'],
                },
              },
            },
          },
        },
      },
    },
  ]);

  if (result.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Competition not found.');
  }

  // These populate calls will now work because the 'User' model is imported.
  await User.populate(result, {
    path: 'participants.user',
    select: '-password',
  });

  await User.populate(result, {
    path: 'createdBy',
    select: '-password',
  });

  return result[0];
};

// ... other service functions

const updateCompetition = async (id: string, payload: Partial<ICompetition>) => {
  return await Competition.findByIdAndUpdate(id, payload, { new: true });
};

const deleteCompetition = async (id: string) => {
  return await Competition.findByIdAndDelete(id);
};

const getCompetitionStats = async (competitionId: string) => {
  const stats = await Competition.aggregate([
    { $match: { _id: new Types.ObjectId(competitionId) } },
    { $unwind: '$participants' },
    {
      $group: {
        _id: null,
        totalParticipants: { $sum: 1 },
        round1Passed: {
          $sum: { $cond: [{ $eq: ['$participants.round1', 'passed'] }, 1, 0] },
        },
        videosPending: {
          $sum: { $cond: [{ $eq: ['$participants.round2', 'pending'] }, 1, 0] },
        },
        interviewsScheduled: {
          $sum: {
            $cond: [{ $eq: ['$participants.round3', 'scheduled'] }, 1, 0],
          },
        },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$participants.round4', 'completed'] }, 1, 0],
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

export const updateQuizPoints = async (competitionId: string) => {
  const pointsAggregation = await QuizQuestion.aggregate([
    {
      $match: { competition: competitionId },
    },
    {
      $group: {
        _id: null,
        totalPoints: { $sum: '$points' },
      },
    },
  ]);

  const totalPoints = pointsAggregation[0]?.totalPoints || 0;

  await Competition.findOneAndUpdate(
    { _id: competitionId },
    { $set: { 'quizSettings.totalPoints': totalPoints } },
    { new: true },
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
