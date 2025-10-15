import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { termsAndConditionsService } from "./termsAndConditions.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllTermsAndConditions = handleAsync(
  async (_req: Request, res: Response) => {
    const result = await termsAndConditionsService.getAllTermsAndConditions();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Terms And Conditions retrieved successfully",
      data: result,
    });
  }
);

const updateTermsAndConditions = handleAsync(
  async (req: Request, res: Response) => {
    const result = await termsAndConditionsService.updateTermsAndConditions(
      req.params.id as string,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "TermsAndConditions updated successfully",
      data: result,
    });
  }
);

export const termsAndConditionsController = {
  getAllTermsAndConditions,
  updateTermsAndConditions,
};
