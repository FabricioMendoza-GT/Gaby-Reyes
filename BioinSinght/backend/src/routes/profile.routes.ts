import { Router } from 'express';

import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  changePasswordValidation,
  updatePreferencesValidation,
  updateProfileValidation,
} from '../validations/profile.validation';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(ProfileController.get));
router.patch('/', updateProfileValidation, validateRequest, asyncHandler(ProfileController.update));
router.put(
  '/preferences',
  updatePreferencesValidation,
  validateRequest,
  asyncHandler(ProfileController.updatePreferences),
);
router.put(
  '/password',
  changePasswordValidation,
  validateRequest,
  asyncHandler(ProfileController.changePassword),
);

export default router;
