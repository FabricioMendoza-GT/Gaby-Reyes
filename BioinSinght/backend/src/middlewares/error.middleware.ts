import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/response';

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return sendError(res, error.statusCode, {
      message: error.message,
      errors: error.errors,
    });
  }

  return sendError(res, 500, {
    message: 'Error interno del servidor.',
  });
}