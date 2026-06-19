import { Router, Response } from 'express';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { patterns, getLessonByPatternId } from '../data/patterns.js';
import { pool } from '../db/index.js';

const router = Router();

// GET /v1/patterns - Retrieve list of patterns with metadata
router.get('/patterns', (_req, res: Response) => {
  try {
    // Return only public pattern metadata, not full lessons
    res.json(patterns);
  } catch (error) {
    console.error('Error fetching patterns list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /v1/patterns/:id - Retrieve detailed lesson content
router.get('/patterns/:id', (req, res: Response) => {
  try {
    const patternId = req.params.id;
    const lesson = getLessonByPatternId(patternId);
    if (!lesson) {
      res.status(404).json({ error: 'Pattern not found' });
      return;
    }
    res.json(lesson);
  } catch (error) {
    console.error(`Error fetching pattern ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /v1/progress - Fetch user progress
router.get('/progress', verifyAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await pool.query(
      'SELECT pattern_id AS "patternId", completed, updated_at AS "updatedAt" FROM user_progress WHERE user_id = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /v1/progress - Update status for single pattern
router.post('/progress', verifyAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { patternId, completed } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!patternId || typeof completed !== 'boolean') {
      res.status(400).json({ error: 'Missing patternId or completed boolean' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO user_progress (user_id, pattern_id, completed, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
       ON CONFLICT (user_id, pattern_id) 
       DO UPDATE SET completed = EXCLUDED.completed, updated_at = CURRENT_TIMESTAMP 
       RETURNING pattern_id AS "patternId", completed, updated_at AS "updatedAt"`,
      [userId, patternId, completed]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /v1/progress/migrate - Sync bulk storage records with timestamps (Conflict Resolution: Latest wins)
router.post('/progress/migrate', verifyAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { progress } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!Array.isArray(progress)) {
      res.status(400).json({ error: 'Expected progress array of items' });
      return;
    }

    if (progress.length === 0) {
      res.json({ success: true, count: 0 });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const item of progress) {
        const { patternId, completed, updatedAt } = item;
        
        // Skip malformed records
        if (!patternId || typeof completed !== 'boolean' || !updatedAt) {
          continue;
        }

        // Keep the latest timestamp:
        // If there's an existing record, update only if client's updatedAt is newer.
        await client.query(
          `INSERT INTO user_progress (user_id, pattern_id, completed, updated_at) 
           VALUES ($1, $2, $3, $4::timestamp with time zone) 
           ON CONFLICT (user_id, pattern_id) 
           DO UPDATE SET 
             completed = CASE WHEN EXCLUDED.updated_at > user_progress.updated_at THEN EXCLUDED.completed ELSE user_progress.completed END,
             updated_at = CASE WHEN EXCLUDED.updated_at > user_progress.updated_at THEN EXCLUDED.updated_at ELSE user_progress.updated_at END`,
          [userId, patternId, completed, updatedAt]
        );
      }

      await client.query('COMMIT');
      res.json({ success: true, count: progress.length });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error migrating user progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
