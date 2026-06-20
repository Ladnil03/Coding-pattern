// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import patternRoutes from './routes/pattern.routes';
import progressRoutes from './routes/progress.routes';
import challengeRoutes from './routes/challenge.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFound } from './middlewares/not-found.middleware';
import { patterns } from './data/patterns';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patterns', patternRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/challenges', challengeRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

async function seedDatabase() {
  try {
    const count = await prisma.pattern.count();
    if (count === 0) {
      console.log('[Seed] Seeding patterns into database...');
      for (const pattern of patterns) {
        await prisma.pattern.create({
          data: {
            id: pattern.id,
            slug: pattern.id,
            title: pattern.title,
            category: pattern.category,
            difficulty: pattern.difficulty.toUpperCase() as any,
            description: pattern.summary,
            content: pattern.summary,
            estimatedTime: 30,
          },
        });
      }
      console.log(`[Seed] Seeding complete. Seeded ${patterns.length} patterns.`);
    } else {
      console.log(`[Seed] Database already contains ${count} patterns.`);
    }
  } catch (err) {
    console.error('[Seed] Database seeding failed:', err);
  }
}

// Start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
