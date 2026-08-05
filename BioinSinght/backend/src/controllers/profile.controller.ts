import type { Request, Response } from 'express';

import { ProfileService } from '../services/profile.service';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';

function authenticatedUserId(req: Request) {
  const userId = req.authUser?.id;

  if (!userId) {
    throw new ApiError(401, 'No autorizado.');
  }

  return userId;
}

export class ProfileController {
  static async get(req: Request, res: Response) {
    const profile = await ProfileService.get(authenticatedUserId(req));

    return sendSuccess(res, 200, {
      message: 'Perfil obtenido correctamente.',
      data: profile,
    });
  }

  static async update(req: Request, res: Response) {
    const profile = await ProfileService.update(authenticatedUserId(req), req.body);

    return sendSuccess(res, 200, {
      message: 'Perfil actualizado correctamente.',
      data: profile,
    });
  }

  static async updatePreferences(req: Request, res: Response) {
    const profile = await ProfileService.updatePreferences(authenticatedUserId(req), req.body);

    return sendSuccess(res, 200, {
      message: 'Preferencias guardadas correctamente.',
      data: profile,
    });
  }

  static async changePassword(req: Request, res: Response) {
    await ProfileService.changePassword(authenticatedUserId(req), req.body);

    return sendSuccess(res, 200, {
      message: 'Contraseña actualizada correctamente.',
      data: null,
    });
  }
}
