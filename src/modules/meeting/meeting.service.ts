import { IMeeting } from "./meeting.interface";
import { Meeting } from "./meeting.models";

const createMeeting = async (payload: Partial<IMeeting>) => {
  return await Meeting.create(payload);
};

const getAllMeeting = async () => {
  return await Meeting.find().lean();
};

const getMeetingById = async (id: string) => {
  return await Meeting.findById(id).lean();
};

const updateMeeting = async (id: string, payload: Partial<IMeeting>) => {
  return await Meeting.findByIdAndUpdate(id, payload, { new: true });
};

const deleteMeeting = async (id: string) => {
  return await Meeting.findByIdAndDelete(id);
};

export const meetingService = {
  createMeeting,
  getAllMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};