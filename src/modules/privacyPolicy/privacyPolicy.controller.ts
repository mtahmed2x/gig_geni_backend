import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { privacyPolicyService } from "./privacyPolicy.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllPrivacyPolicy = handleAsync(
  async (_req: Request, res: Response) => {
    const result = await privacyPolicyService.getAllPrivacyPolicy();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Privacy Policy retrieved successfully",
      data: result,
    });
  }
);

const updatePrivacyPolicy = handleAsync(async (req: Request, res: Response) => {
  const result = await privacyPolicyService.updatePrivacyPolicy(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Privacy Policy updated successfully",
    data: result,
  });
});

export const privacyPolicyController = {
  getAllPrivacyPolicy,
  updatePrivacyPolicy,
};
