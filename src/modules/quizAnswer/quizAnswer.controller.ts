import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { quizAnswerService } from "./quizAnswer.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createQuizAnswer = handleAsync(async (req: Request, res: Response) => {
  req.body.userId = req.user!._id.toString();
  const result = await quizAnswerService.createQuizAnswer(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "QuizAnswer successfully created",
    data: result,
  });
});

const getAllQuizAnswer = handleAsync(async (_req: Request, res: Response) => {
  const result = await quizAnswerService.getAllQuizAnswer();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizAnswers retrieved successfully",
    data: result,
  });
});

const getQuizAnswerById = handleAsync(async (req: Request, res: Response) => {
  const result = await quizAnswerService.getQuizAnswerById(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizAnswer retrieved successfully",
    data: result,
  });
});

const updateQuizAnswer = handleAsync(async (req: Request, res: Response) => {
  const result = await quizAnswerService.updateQuizAnswer(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizAnswer updated successfully",
    data: result,
  });
});

const deleteQuizAnswer = handleAsync(async (req: Request, res: Response) => {
  const result = await quizAnswerService.deleteQuizAnswer(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizAnswer deleted successfully",
    data: result,
  });
});

const evaluate = handleAsync(async (req: Request, res: Response) => {
  const result = await quizAnswerService.evaluate(req.body.competitionId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Quiz evaluated successfully",
    data: result,
  });
});

export const quizAnswerController = {
  createQuizAnswer,
  getAllQuizAnswer,
  getQuizAnswerById,
  updateQuizAnswer,
  deleteQuizAnswer,
  evaluate,
};
