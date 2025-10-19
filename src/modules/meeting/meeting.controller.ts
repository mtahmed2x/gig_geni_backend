import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { meetingService } from "./meeting.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createMeeting = handleAsync(async (req: Request, res: Response) => {
  const result = await meetingService.createMeeting(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Meeting successfully created",
    data: result,
  });
});

const getAllMeeting = handleAsync(async (_req: Request, res: Response) => {
  const result = await meetingService.getAllMeeting();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meetings retrieved successfully",
    data: result,
  });
});

const getMeetingById = handleAsync(async (req: Request, res: Response) => {
  const result = await meetingService.getMeetingById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meeting retrieved successfully",
    data: result,
  });
});

const updateMeeting = handleAsync(async (req: Request, res: Response) => {
  const result = await meetingService.updateMeeting(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meeting updated successfully",
    data: result,
  });
});

const deleteMeeting = handleAsync(async (req: Request, res: Response) => {
  const result = await meetingService.deleteMeeting(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meeting deleted successfully",
    data: result,
  });
});

export const meetingController = {
  createMeeting,
  getAllMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};