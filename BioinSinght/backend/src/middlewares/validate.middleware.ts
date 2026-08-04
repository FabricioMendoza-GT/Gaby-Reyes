import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { sendError } from '../utils/response';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return sendError(res, 400, {
      message: 'Errores de validación.',
      errors: result.array().map((error) => error.msg),
    });
  }

  return next();
}