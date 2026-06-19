-- PostgreSQL Database Schema

-- Enable UUID extension (useful for generating user IDs if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store user progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL, -- Corresponds to Supabase user sub UUID
  pattern_id VARCHAR(100) NOT NULL, -- ID of the coding pattern (e.g. 'sliding-window')
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Prevent multiple progress entries for the same user-pattern pair
  CONSTRAINT unique_user_pattern UNIQUE (user_id, pattern_id)
);

-- Index user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
