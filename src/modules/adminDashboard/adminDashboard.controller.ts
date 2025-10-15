import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { adminDashboardService } from "./adminDashboard.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createAdminDashboard = handleAsync(
  async (req: Request, res: Response) => {
    const result = await adminDashboardService.createAdminDashboard(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "AdminDashboard successfully created",
      data: result,
    });
  }
);

const getAllAdminDashboard = handleAsync(
  async (_req: Request, res: Response) => {
    const result = await adminDashboardService.getAllAdminDashboard();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "AdminDashboards retrieved successfully",
      data: result,
    });
  }
);

const getAdminDashboardById = handleAsync(
  async (req: Request, res: Response) => {
    const result = await adminDashboardService.getAdminDashboardById(
      req.params.id as string
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "AdminDashboard retrieved successfully",
      data: result,
    });
  }
);

const updateAdminDashboard = handleAsync(
  async (req: Request, res: Response) => {
    const result = await adminDashboardService.updateAdminDashboard(
      req.params.id as string,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "AdminDashboard updated successfully",
      data: result,
    });
  }
);

const deleteAdminDashboard = handleAsync(
  async (req: Request, res: Response) => {
    const result = await adminDashboardService.deleteAdminDashboard(
      req.params.id as string
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "AdminDashboard deleted successfully",
      data: result,
    });
  }
);

const getAllUser = handleAsync(async (req: Request, res: Response) => {
  const result = await adminDashboardService.getAllUser(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Users retrieved successfully",
    data: result,
  });
});

const getAllCompetition = handleAsync(async (req: Request, res: Response) => {
  const result = await adminDashboardService.getAllCompetition(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Competitions retrieved successfully",
    data: result,
  });
});

export const adminDashboardController = {
  createAdminDashboard,
  getAllAdminDashboard,
  getAdminDashboardById,
  updateAdminDashboard,
  deleteAdminDashboard,
  getAllUser,
  getAllCompetition,
};
