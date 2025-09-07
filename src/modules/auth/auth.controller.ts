import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
  loginSchema,
  logoutSchema,
  registerSchema,
  verifyOTPSchema,
} from "./auth.dto";

const register = handleAsync(async (req: Request, res: Response) => {
  registerSchema.parse(req.body);
  const result = await authService.register(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const verifyOTP = handleAsync(async (req: Request, res: Response) => {
  verifyOTPSchema.parse(req.body);
  const result = await authService.verifyOTP(
    req.user!._id.toString(),
    req.body.otp
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Otp verified successfully",
    data: result,
  });
});

const resendOTP = handleAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await authService.resendOTP(user!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Otp resend successfully",
    data: result,
  });
});

const login = handleAsync(async (req: Request, res: Response) => {
  loginSchema.parse(req.body);
  const result = await authService.login(
    req.body.email,
    req.body.password,
    req.body.deviceTokens
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const logout = handleAsync(async (req: Request, res: Response) => {
  logoutSchema.parse(req.body);
  const result = await authService.logout(
    req.user!._id.toString(),
    req.body.deviceToken
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: {},
  });
});

// const deleteAuth = handleAsync(async (req: Request, res: Response) => {
//   const result = await authService.deleteAuth(req.params.id as string);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Auth deleted successfully",
//     data: result,
//   });
// });

export const authController = {
  register,
  verifyOTP,
  resendOTP,
  login,
  logout,
};
