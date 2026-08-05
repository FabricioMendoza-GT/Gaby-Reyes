import type { Request, Response } from 'express';

import { ClinicalTestService } from '../services/clinical-test.service';
import type {
  ClinicalTestSourceMode,
  ClinicalTestType,
} from '../types/clinical-test';
import type { HealthInterest } from '../types/user';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';

function authenticatedUserId(req: Request) {
  const userId = req.authUser?.id;
  if (!userId) throw new ApiError(401, 'No autorizado.');
  return userId;
}

function optionalNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;
  return Number(value);
}

export class ClinicalTestController {
  static async list(req: Request, res: Response) {
    const tests = await ClinicalTestService.list(authenticatedUserId(req));
    return sendSuccess(res, 200, {
      message: 'Pruebas obtenidas correctamente.',
      data: tests,
    });
  }

  static async create(req: Request, res: Response) {
    const test = await ClinicalTestService.create(
      authenticatedUserId(req),
      {
        category: req.body.category as HealthInterest,
        testType: req.body.testType as ClinicalTestType,
        measuredAt: req.body.measuredAt as string,
        value: Number(req.body.value),
        referenceMin: optionalNumber(req.body.referenceMin),
        referenceMax: optionalNumber(req.body.referenceMax),
        notes: typeof req.body.notes === 'string' && req.body.notes.trim() ? req.body.notes.trim() : null,
        sourceMode: req.body.sourceMode as ClinicalTestSourceMode,
      },
      req.file,
    );

    return sendSuccess(res, 201, {
      message: 'Prueba registrada correctamente.',
      data: test,
    });
  }

  static async attachment(req: Request, res: Response) {
    const attachment = await ClinicalTestService.attachment(authenticatedUserId(req), String(req.params.id));
    const encodedName = encodeURIComponent(attachment.name);

    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
    return res.send(attachment.data);
  }
}
