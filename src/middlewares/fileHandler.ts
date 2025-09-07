import Cloudinary from "../utils/cloudinary";
import { NextFunction, Request, Response } from "express";
import { FileArray, UploadedFile } from "express-fileupload";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";

const uploadFileToCloudinary = async (
  file: UploadedFile,
  folder: string
): Promise<string> => {
  try {
    return await Cloudinary.upload(file, folder);
  } catch (error: any) {
    throw new Error(`Failed to upload ${folder} file: ${error.message}`);
  }
};

export const fileHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fileFields = [
      { fieldName: "bannerImage", folder: "gig-geni/competition/bannerImage" },
    ];

    const files = req.files as FileArray | undefined;
    console.log(files);

    if (files) {
      await Promise.all(
        fileFields.map(async ({ fieldName, folder }) => {
          const file = files[fieldName];
          console.log(file);

          if (file) {
            if (Array.isArray(file)) {
              const fileUrls = await Promise.all(
                file.map((fileItem: UploadedFile) =>
                  uploadFileToCloudinary(fileItem, folder)
                )
              );
              req.body[fieldName] = fileUrls;
            } else {
              const fileUrl = await uploadFileToCloudinary(
                file as UploadedFile,
                folder
              );
              req.body[fieldName] = fileUrl;
              console.log(req.body);
            }
          }
        })
      );
    }

    next();
  } catch (error: any) {
    next(createError(StatusCodes.BAD_REQUEST, error.message));
  }
};

export default fileHandler;
