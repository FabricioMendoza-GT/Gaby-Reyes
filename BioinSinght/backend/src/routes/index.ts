import { Router } from 'express';

import authRoutes from './auth.routes';
import clinicalTestRoutes from './clinical-test.routes';
import profileRoutes from './profile.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'BioinSight backend is running.', data: { status: 'ok' } });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/tests', clinicalTestRoutes);

export default router;
