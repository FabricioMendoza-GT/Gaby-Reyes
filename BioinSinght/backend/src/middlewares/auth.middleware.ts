import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/response';

type JwtPayload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 401, {
      message: 'No autorizado.',
    });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

    req.authUser = {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    return next();
  } catch {
    return sendError(res, 401, {
      message: 'Token inválido o expirado.',
    });
  }
}