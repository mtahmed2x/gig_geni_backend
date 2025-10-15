import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { contactService } from "./contact.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllContact = handleAsync(async (_req: Request, res: Response) => {
  const result = await contactService.getAllContact();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Contacts retrieved successfully",
    data: result,
  });
});

const updateContact = handleAsync(async (req: Request, res: Response) => {
  const result = await contactService.updateContact(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Contact updated successfully",
    data: result,
  });
});

export const contactController = {
  getAllContact,
  updateContact,
};
