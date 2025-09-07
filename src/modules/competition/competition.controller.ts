import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { competitionService } from "./competition.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createCompetition = handleAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  req.body.createdBy = req.user!._id;
  const result = await competitionService.createCompetition(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Competition successfully created",
    data: result,
  });
});

const getAllCompetition = handleAsync(async (req: Request, res: Response) => {
  const query = { ...req.query, createdBy: req.user._id!.toString() };
  const result = await competitionService.getAllCompetition(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competitions retrieved successfully",
    data: result,
  });
});

const getCompetitionById = handleAsync(async (req: Request, res: Response) => {
  const result = await competitionService.getCompetitionById(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competition retrieved successfully",
    data: result,
  });
});

const updateCompetition = handleAsync(async (req: Request, res: Response) => {
  const result = await competitionService.updateCompetition(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competition updated successfully",
    data: result,
  });
});

const deleteCompetition = handleAsync(async (req: Request, res: Response) => {
  const result = await competitionService.deleteCompetition(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competition deleted successfully",
    data: result,
  });
});

export const competitionController = {
  createCompetition,
  getAllCompetition,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
};
