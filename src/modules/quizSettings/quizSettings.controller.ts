import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { quizSettingsService } from "./quizSettings.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createQuizSettings = handleAsync(async (req: Request, res: Response) => {
  const result = await quizSettingsService.createQuizSettings(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "QuizSettings successfully created",
    data: result,
  });
});

const getAllQuizSettings = handleAsync(async (req: Request, res: Response) => {
  const result = await quizSettingsService.getAllQuizSettings(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizSettingss retrieved successfully",
    data: result,
  });
});

const getQuizSettingsById = handleAsync(async (req: Request, res: Response) => {
  const result = await quizSettingsService.getQuizSettingsById(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizSettings retrieved successfully",
    data: result,
  });
});

const updateQuizSettings = handleAsync(async (req: Request, res: Response) => {
  const result = await quizSettingsService.updateQuizSettings(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizSettings updated successfully",
    data: result,
  });
});

const deleteQuizSettings = handleAsync(async (req: Request, res: Response) => {
  const result = await quizSettingsService.deleteQuizSettings(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizSettings deleted successfully",
    data: result,
  });
});

export const quizSettingsController = {
  createQuizSettings,
  getAllQuizSettings,
  getQuizSettingsById,
  updateQuizSettings,
  deleteQuizSettings,
};
