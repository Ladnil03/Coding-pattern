README.md
# Coding Pattern Learning Platform - Backend

## Overview

This is the backend server for the Coding Pattern Learning Platform, built with Node.js, Express.js, and TypeScript.

## Features

- **Authentication**: JWT-based authentication with refresh tokens, Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session management and performance
- **Security**: Helmet, CORS, rate limiting, input validation
- **API Design**: RESTful API with versioning (/api/v1/)
- **Testing**: Jest with Supertest for comprehensive testing

## Project Structure

```
backend/
├── src/
│   ├── config/           # Server configuration
│   ├── controllers/      # HTTP request handlers
│   ├── middlewares/      # Express middlewares
│   ├── modules/          # Feature modules
│   ├── repositories/     # Data access layer
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
│   └── server.ts         # Main server file
├── prisma/                # Prisma schema
├── tests/                 # Backend tests
└── docs/                  # API documentation
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/google` - Google OAuth initiation
- `GET /api/v1/auth/google/callback` - Google OAuth callback

### Patterns
- `GET /api/v1/patterns` - Get all patterns
- `GET /api/v1/patterns/:slug` - Get pattern by slug

### Progress
- `GET /api/v1/progress` - Get user progress
- `POST /api/v1/progress` - Update user progress

### Challenges
- `GET /api/v1/challenges/:id` - Get challenge by ID
- `POST /api/v1/challenges/submit` - Submit challenge answer

### Dashboard
- `GET /api/v1/dashboard` - Get user dashboard data

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Installation

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Initialize database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

For deployment instructions, see the main README.md file.
