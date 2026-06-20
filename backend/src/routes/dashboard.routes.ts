import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authenticate, (_req, res) => {
  res.json({ success: true, stats: { totalCompleted: 0, timeSpent: 0 } });
});

export default router;
