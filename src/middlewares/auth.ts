import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/appError';
import { verifyAccessToken, verifyResetToken } from '../utils/jwtUtils';
import { User } from '../modules/user/user.models';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface AuthOptions {
  reset?: boolean;
}

export const auth =
  (...allowedRolesOrOptions: (string | AuthOptions)[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    // extract options and roles
    const options =
      allowedRolesOrOptions.find((arg): arg is AuthOptions => typeof arg === 'object') || {};
    const allowedRoles = allowedRolesOrOptions.filter(
      (arg): arg is string => typeof arg === 'string',
    );

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, 'No token provided'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, 'No token provided'));
    }

    try {
      const decoded = options.reset ? verifyResetToken(token) : verifyAccessToken(token);

      if (!decoded?.userId) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token'));
      }

      const user = await User.findById(decoded.userId).lean();
      if (!user) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'User not found'));
      }

      req.user = user;

      if (!options.reset && allowedRoles.length && !allowedRoles.includes(user.role)) {
        return next(new AppError(StatusCodes.FORBIDDEN, 'Access denied'));
      }

      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(
          new AppError(StatusCodes.UNAUTHORIZED, 'Your session has expired. Please log in again.'),
        );
      }
      if (err instanceof JsonWebTokenError) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token. Please log in again.'));
      }
      return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication failed'));
    }
  };
