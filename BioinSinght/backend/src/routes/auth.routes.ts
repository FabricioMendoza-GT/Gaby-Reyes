import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { loginValidation, registerValidation } from '../validations/auth.validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', registerValidation, validateRequest, asyncHandler(AuthController.register));
router.post('/login', loginValidation, validateRequest, asyncHandler(AuthController.login));
router.get('/me', authMiddleware, asyncHandler(AuthController.me));

export default router;