import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/response';

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof multer.MulterError) {
    return sendError(res, 400, {
      message: error.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo no puede superar 5 MB.'
        : 'No se pudo procesar el archivo adjunto.',
    });
  }

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
