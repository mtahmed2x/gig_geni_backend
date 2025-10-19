import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { taskSubmissionService } from "./taskSubmission.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createTaskSubmission = handleAsync(async (req: Request, res: Response) => {
  const result = await taskSubmissionService.createTaskSubmission(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "TaskSubmission successfully created",
    data: result,
  });
});

const getAllTaskSubmission = handleAsync(async (_req: Request, res: Response) => {
  const result = await taskSubmissionService.getAllTaskSubmission();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "TaskSubmissions retrieved successfully",
    data: result,
  });
});

const getTaskSubmissionById = handleAsync(async (req: Request, res: Response) => {
  const result = await taskSubmissionService.getTaskSubmissionById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "TaskSubmission retrieved successfully",
    data: result,
  });
});

const updateTaskSubmission = handleAsync(async (req: Request, res: Response) => {
  const result = await taskSubmissionService.updateTaskSubmission(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "TaskSubmission updated successfully",
    data: result,
  });
});

const deleteTaskSubmission = handleAsync(async (req: Request, res: Response) => {
  const result = await taskSubmissionService.deleteTaskSubmission(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "TaskSubmission deleted successfully",
    data: result,
  });
});

export const taskSubmissionController = {
  createTaskSubmission,
  getAllTaskSubmission,
  getTaskSubmissionById,
  updateTaskSubmission,
  deleteTaskSubmission,
};