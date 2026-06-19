import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import patternsRouter from './routes/patterns.js';
import { initBackendErrorTracking } from './utils/sentry.js';

dotenv.config();

// Initialize backend error tracking/telemetry
initBackendErrorTracking();

const app = express();
const port = parseInt(process.env.PORT || '3001', 10);

// Basic Security Configuration
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite default port
    credentials: true,
  })
);
app.use(express.json());

// Rate Limiting for Progress write endpoints
const progressLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limits specifically to progress write routes
app.use('/api/v1/progress', progressLimiter);

// Setup routes
app.use('/api/v1', patternsRouter);

// Health check endpoint
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Pattern Learn API Server listening on port ${port}`);
});

export default app;
