import type { Response } from 'express';

type SuccessPayload<T> = {
  message: string;
  data: T;
};

type ErrorPayload = {
  message: string;
  errors?: string[];
};

export function sendSuccess<T>(res: Response, statusCode: number, payload: SuccessPayload<T>) {
  return res.status(statusCode).json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
}

export function sendError(res: Response, statusCode: number, payload: ErrorPayload) {
  return res.status(statusCode).json({
    success: false,
    message: payload.message,
    errors: payload.errors ?? [],
  });
}