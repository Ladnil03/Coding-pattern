import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import prisma from '../config/database';

const router = Router();

// Get user progress
router.get('/', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const progress = await prisma.progress.findMany({
      where: { userId: req.user.userId }
    });
    res.json(progress); // Frontend expects an array of progress items directly
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update single pattern progress
router.post('/', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const { patternId, completed } = req.body;

    const progress = await prisma.progress.upsert({
      where: {
        userId_patternId: {
          userId: req.user.userId,
          patternId
        }
      },
      update: {
        completed,
        completionPercentage: completed ? 100 : 0
      },
      create: {
        userId: req.user.userId,
        patternId,
        completed,
        completionPercentage: completed ? 100 : 0
      }
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk migrate localStorage progress
router.post('/migrate', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const { progress } = req.body; // Array of { patternId, completed, updatedAt }

    if (!Array.isArray(progress)) {
      res.status(400).json({ success: false, message: 'Invalid payload format' });
      return;
    }

    const userId = req.user.userId;

    // Perform bulk write using Prisma transaction
    await prisma.$transaction(
      progress.map((item: any) =>
        prisma.progress.upsert({
          where: {
            userId_patternId: {
              userId,
              patternId: item.patternId
            }
          },
          update: {
            completed: item.completed,
            completionPercentage: item.completed ? 100 : 0
          },
          create: {
            userId,
            patternId: item.patternId,
            completed: item.completed,
            completionPercentage: item.completed ? 100 : 0
          }
        })
      )
    );

    res.json({ success: true, migratedCount: progress.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
