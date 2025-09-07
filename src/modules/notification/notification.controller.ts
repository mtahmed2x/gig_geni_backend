import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { notificationService } from "./notification.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createNotification = handleAsync(async (req: Request, res: Response) => {
  const result = await notificationService.createNotification(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Notification successfully created",
    data: result,
  });
});

const getAllNotification = handleAsync(async (_req: Request, res: Response) => {
  const result = await notificationService.getAllNotification();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const getNotificationById = handleAsync(async (req: Request, res: Response) => {
  const result = await notificationService.getNotificationById(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notification retrieved successfully",
    data: result,
  });
});

const updateNotification = handleAsync(async (req: Request, res: Response) => {
  const result = await notificationService.updateNotification(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notification updated successfully",
    data: result,
  });
});

const deleteNotification = handleAsync(async (req: Request, res: Response) => {
  const result = await notificationService.deleteNotification(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});

export const notificationController = {
  createNotification,
  getAllNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
