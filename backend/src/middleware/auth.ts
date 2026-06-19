import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    isAnonymous: boolean;
  };
}

export const verifyAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    // Supabase JWT signature validation (using SUPABASE_JWT_SECRET environment variable)
    const secret = process.env.SUPABASE_JWT_SECRET || 'dev-fallback-jwt-secret-must-be-long-and-secure';
    
    // In local development, if secret is fallback, we can log a warning once
    const decoded = jwt.verify(token, secret) as { sub: string; is_anonymous?: boolean };
    
    req.user = {
      id: decoded.sub,
      isAnonymous: !!decoded.is_anonymous,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired auth token' });
  }
};
