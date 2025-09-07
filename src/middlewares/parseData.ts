import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../utils/handleAsync";

const parseData = () => {
  return handleAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      if (req?.body?.data) {
        const parsed = JSON.parse(req.body.data);
        req.body = { ...parsed, ...req.body };
      }

      next();
    }
  );
};
export default parseData;
