import { body, param } from 'express-validator';

import {
  CLINICAL_TEST_SOURCE_MODES,
  CLINICAL_TEST_TYPES,
} from '../types/clinical-test';
import { HEALTH_INTERESTS } from '../types/user';

const optionalNumber = { nullable: true, checkFalsy: true } as const;

export const createClinicalTestValidation = [
  body('category').isIn(HEALTH_INTERESTS).withMessage('La categoría no es válida.'),
  body('testType').isIn(CLINICAL_TEST_TYPES).withMessage('El tipo de prueba no es válido.'),
  body('measuredAt')
    .isISO8601()
    .withMessage('La fecha de la prueba no es válida.')
    .custom((value: string) => new Date(value).getTime() <= Date.now())
    .withMessage('La fecha de la prueba no puede estar en el futuro.'),
  body('value')
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('El valor debe ser un número válido.'),
  body('referenceMin')
    .optional(optionalNumber)
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('El rango mínimo no es válido.'),
  body('referenceMax')
    .optional(optionalNumber)
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('El rango máximo no es válido.'),
  body('notes')
    .optional(optionalNumber)
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden superar 1000 caracteres.'),
  body('sourceMode')
    .isIn(CLINICAL_TEST_SOURCE_MODES)
    .withMessage('La forma de registro no es válida.'),
];

export const clinicalTestIdValidation = [
  param('id').isUUID().withMessage('El identificador de la prueba no es válido.'),
];
