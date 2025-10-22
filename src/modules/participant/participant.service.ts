import { Competition } from "../competition/competition.models";
import { RoundStatus } from "./participant.constant";
import { IParticipant } from "./participant.interface";
import { Participant } from "./participant.models";

const createParticipant = async (payload: Partial<IParticipant>) => {
  const participant = await Participant.create(payload);
  await Competition.findByIdAndUpdate(participant.competition, {
    $inc: { totalParticipants: 1 },
  });
  return participant;
};

const getAllParticipant = async (payload: {
  mine?: string;
  userId?: string;
  competitionId?: string;
}) => {
  const { mine, userId, competitionId } = payload;
  const filter: Record<string, unknown> = {};
  if (competitionId) filter.competition = competitionId;
  if (mine && userId) {
    filter.user = userId;
    return await Participant.findOne(filter)
      .populate("user competition")
      .lean();
  }
  return await Participant.find(filter).populate("user competition").lean();
};

const getParticipantById = async (id: string) => {
  return await Participant.findById(id).lean();
};

const updateParticipant = async (
  id: string,
  payload: Partial<IParticipant>
) => {
  return await Participant.findByIdAndUpdate(id, payload, { new: true });
};

const deleteParticipant = async (id: string) => {
  return await Participant.findByIdAndDelete(id);
};

const uploadVideo = async (payload: {
  videoUrl: string;
  userId: string;
  competitionId: string;
}) => {
  const { videoUrl, userId, competitionId } = payload;

  const participant = await Participant.findOneAndUpdate(
    { user: userId, competition: competitionId },
    {
      $set: {
        "round2_video.videoUrl": videoUrl,
        "round2_video.status": RoundStatus.SUBMITTED,
        "round2_video.submittedAt": new Date(),
      },
    },
    { new: true }
  );

  return participant;
};

export const participantService = {
  createParticipant,
  getAllParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
  uploadVideo,
};
