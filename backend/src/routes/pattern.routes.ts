import { Router } from 'express';

const router = Router();

// TODO: Implement pattern listing and details
router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Patterns endpoint stub' });
});

export default router;
