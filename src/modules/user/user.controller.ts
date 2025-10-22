import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllUser = handleAsync(async (_req: Request, res: Response) => {
  const result = await userService.getAllUser();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getProfile = handleAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const result = await userService.getUserById(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile successfully",
    data: result,
  });
});

const getUserById = handleAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = handleAsync(async (req: Request, res: Response) => {
  console.log("Body" + req);
  const result = await userService.updateUser(
    req.params.id || req.user!._id.toString(),
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = handleAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
};
