import { body } from 'express-validator';

import { HEALTH_INTERESTS } from '../types/user';

export const updateProfileValidation = [
  body().custom((value) => {
    if (!value.firstName && !value.lastName && !value.email) {
      throw new Error('Debes enviar al menos un dato para actualizar.');
    }

    return true;
  }),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres.'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El apellido debe tener entre 2 y 80 caracteres.'),
  body('email').optional().trim().isEmail().withMessage('El correo no es válido.').normalizeEmail(),
];

export const updatePreferencesValidation = [
  body('healthInterests')
    .isArray({ min: 1, max: HEALTH_INTERESTS.length })
    .withMessage('Selecciona entre 1 y 4 intereses.'),
  body('healthInterests.*')
    .isIn(HEALTH_INTERESTS)
    .withMessage('Se recibió un interés de salud no válido.'),
  body('notificationsEnabled')
    .isBoolean()
    .withMessage('La preferencia de notificaciones debe ser verdadera o falsa.'),
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('La contraseña actual es obligatoria.'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('La nueva contraseña debe tener entre 8 y 128 caracteres.'),
];
