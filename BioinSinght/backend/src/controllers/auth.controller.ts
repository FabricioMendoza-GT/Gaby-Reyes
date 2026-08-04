import type { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export class AuthController {
  static async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body);

    return sendSuccess(res, 201, {
      message: 'Usuario registrado correctamente.',
      data: result,
    });
  }

  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body);

    return sendSuccess(res, 200, {
      message: 'Inicio de sesión correcto.',
      data: result,
    });
  }

  static async me(req: Request, res: Response) {
    const userId = req.authUser?.id;

    if (!userId) {
      return sendSuccess(res, 200, {
        message: 'Usuario autenticado.',
        data: null,
      });
    }

    const user = await AuthService.me(userId);

    return sendSuccess(res, 200, {
      message: 'Usuario autenticado.',
      data: user,
    });
  }
}