import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { quizQuestionService } from "./quizQuestion.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createQuizQuestion = handleAsync(async (req: Request, res: Response) => {
  const result = await quizQuestionService.createQuizQuestion(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "QuizQuestion successfully created",
    data: result,
  });
});

const getAllQuizQuestion = handleAsync(async (req: Request, res: Response) => {
  const result = await quizQuestionService.getAllQuizQuestion();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizQuestions retrieved successfully",
    data: result,
  });
});

const getQuizQuestionById = handleAsync(async (req: Request, res: Response) => {
  const result = await quizQuestionService.getQuizQuestionById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizQuestion retrieved successfully",
    data: result,
  });
});

const updateQuizQuestion = handleAsync(async (req: Request, res: Response) => {
  const result = await quizQuestionService.updateQuizQuestion(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizQuestion updated successfully",
    data: result,
  });
});

const deleteQuizQuestion = handleAsync(async (req: Request, res: Response) => {
  const result = await quizQuestionService.deleteQuizQuestion(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "QuizQuestion deleted successfully",
    data: result,
  });
});

export const quizQuestionController = {
  createQuizQuestion,
  getAllQuizQuestion,
  getQuizQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
};