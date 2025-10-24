import { StatusCodes } from 'http-status-codes';
interface AppErrorOptions {
  cause?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: StatusCodes;
  public readonly success: boolean;
  public readonly isOperational: boolean;

  constructor(statusCode: StatusCodes, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });

    this.statusCode = statusCode;
    this.success = false;
    this.name = this.constructor.name;

    this.isOperational = options.isOperational ?? (options.cause ? false : true);

    if (options.cause instanceof Error && options.cause.stack) {
      this.stack = options.cause.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
