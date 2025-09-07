import { getIO } from "../../socket";
import { INotification } from "./notification.interface";
import { Notification } from "./notification.models";

const createNotification = async (payload: Partial<INotification>) => {
  const notification = await Notification.create({
    ...payload,
    read: false,
  });

  if (notification?.receiver) {
    const io = getIO();
    io.to(notification.receiver.toString()).emit(
      "notification:new",
      notification
    );
  }

  return notification;
};

const getAllNotification = async () => {
  return await Notification.find().lean();
};

const getNotificationById = async (id: string) => {
  return await Notification.findById(id).lean();
};

const updateNotification = async (
  id: string,
  payload: Partial<INotification>
) => {
  return await Notification.findByIdAndUpdate(id, payload, { new: true });
};

const deleteNotification = async (id: string) => {
  return await Notification.findByIdAndDelete(id);
};

export const notificationService = {
  createNotification,
  getAllNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
