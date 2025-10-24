import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/appError';
import { config } from '../config';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.reduce(
      (acc, issue) => {
        const fieldName = issue.path.join('.');
        acc[fieldName] = issue.message;
        return acc;
      },
      {} as Record<string, string>,
    );

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid input provided.',
      errors: formattedErrors,
    });
  }

  const isOperationalError = err instanceof AppError && err.isOperational;

  if (config.app.env === 'development' || !isOperationalError) {
    logger.error({ err, name: err.name }, 'An error occurred');
  }

  if (err instanceof AppError) {
    const message = err.isOperational
      ? err.message
      : 'An unexpected error occurred. Please try again later.';
    return res.status(err.statusCode).json({
      success: false,
      message,
      stack: config.app.env === 'development' ? err.stack : undefined,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
    stack: config.app.env === 'development' ? err.stack : undefined,
  });
};
