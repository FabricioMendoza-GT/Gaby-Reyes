import { Router } from 'express';

import { ClinicalTestController } from '../controllers/clinical-test.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { clinicalTestUpload } from '../middlewares/upload.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  clinicalTestIdValidation,
  createClinicalTestValidation,
} from '../validations/clinical-test.validation';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(ClinicalTestController.list));
router.post(
  '/',
  clinicalTestUpload.single('attachment'),
  createClinicalTestValidation,
  validateRequest,
  asyncHandler(ClinicalTestController.create),
);
router.get(
  '/:id/attachment',
  clinicalTestIdValidation,
  validateRequest,
  asyncHandler(ClinicalTestController.attachment),
);

export default router;
