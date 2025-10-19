import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { quizAttemptService } from "./quizAttempt.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";

const submitQuizAttempt = handleAsync(async (req: Request, res: Response) => {
  req.body.userId = req.user!._id;
  const result = await quizAttemptService.submitQuizAttempt(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Quiz attempt submitted successfully",
    data: result,
  });
});

const getQuizAttemptsForCompetition = handleAsync(
  async (req: Request, res: Response) => {
    const { competitionId } = req.query;

    if (!competitionId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Competition ID is required as a query parameter."
      );
    }

    const result = await quizAttemptService.getAllAttemptsForCompetition(
      competitionId as string
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Quiz attempts retrieved successfully",
      data: result,
    });
  }
);

const getQuizAttemptById = handleAsync(async (req: Request, res: Response) => {
  const result = await quizAttemptService.getAttemptById(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Quiz attempt retrieved successfully",
    data: result,
  });
});

export const quizAttemptController = {
  submitQuizAttempt,
  getQuizAttemptsForCompetition,
  getQuizAttemptById,
};
