import { Router } from 'express';

import authRoutes from './auth.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'BioinSight backend is running.', data: { status: 'ok' } });
});

router.use('/auth', authRoutes);

export default router;