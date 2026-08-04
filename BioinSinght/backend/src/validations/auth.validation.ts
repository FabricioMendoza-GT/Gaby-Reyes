import { body } from 'express-validator';

export const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('lastName').trim().notEmpty().withMessage('El apellido es obligatorio.'),
  body('email').trim().isEmail().withMessage('El correo no es válido.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('El correo no es válido.').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
];