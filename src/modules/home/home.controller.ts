import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { homeService } from "./home.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createHome = handleAsync(async (req: Request, res: Response) => {
  const result = await homeService.createHome(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Home successfully created",
    data: result,
  });
});

const getAllHome = handleAsync(async (_req: Request, res: Response) => {
  const result = await homeService.getAllHome();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Homes retrieved successfully",
    data: result,
  });
});

const getHomeById = handleAsync(async (req: Request, res: Response) => {
  const result = await homeService.getHomeById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Home retrieved successfully",
    data: result,
  });
});

const updateHome = handleAsync(async (req: Request, res: Response) => {
  const result = await homeService.updateHome(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Home updated successfully",
    data: result,
  });
});

const deleteHome = handleAsync(async (req: Request, res: Response) => {
  const result = await homeService.deleteHome(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Home deleted successfully",
    data: result,
  });
});

export const homeController = {
  createHome,
  getAllHome,
  getHomeById,
  updateHome,
  deleteHome,
};
