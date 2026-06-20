import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/database';
import { config } from '../config/app';
import { setJWTCookie, clearJWTCookie } from '../utils/cookie';

const googleClient = new OAuth2Client(config.google.clientId);

/**
 * Generate a JWT token for the user.
 */
const generateToken = (userId: string, email: string, role: string): string => {
  const secret = process.env.JWT_SECRET || config.jwt.accessSecret;
  const expiresIn = config.jwt.accessExpire || '30d'; // Use 30 days or default access token expiration
  return jwt.sign({ userId, email, role }, secret, { expiresIn });
};

/**
 * Handle user registration (Signup)
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password).' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'A user with this email address already exists.' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        provider: 'EMAIL',
        role: 'USER',
        isVerified: false,
      },
    });

    // Create user preferences
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        theme: 'light',
        reduceMotion: false,
        notificationSettings: {},
      },
    });

    // Generate JWT and set it in cookie
    const token = generateToken(user.id, user.email, user.role);
    setJWTCookie(res, token);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.provider !== 'EMAIL' || !user.passwordHash) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    // Generate JWT and set it in cookie
    const token = generateToken(user.id, user.email, user.role);
    setJWTCookie(res, token);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Google OAuth Sign-in
 */
export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ success: false, message: 'Google ID Token is required.' });
      return;
    }

    // Verify Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.google.clientId,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: `Failed to verify Google token: ${err.message}` });
      return;
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      res.status(400).json({ success: false, message: 'Invalid token payload received from Google.' });
      return;
    }

    const { email, name, sub: googleId, picture: avatarUrl } = payload;

    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { accounts: { some: { providerAccountId: googleId, provider: 'GOOGLE' } } }
        ]
      },
      include: {
        accounts: true,
      },
    });

    if (user) {
      // If user exists but is not linked to Google account relation, link them
      const isLinked = user.accounts.some(acc => acc.providerAccountId === googleId && acc.provider === 'GOOGLE');
      if (!isLinked) {
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'GOOGLE',
            providerAccountId: googleId,
          },
        });
      }
    } else {
      // Create new user using nested writes (automatically transactional in Prisma)
      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email,
          passwordHash: '', // Google users don't have local password hash
          provider: 'GOOGLE',
          role: 'USER',
          isVerified: true,
          avatar: avatarUrl || null,
          accounts: {
            create: {
              type: 'oauth',
              provider: 'GOOGLE',
              providerAccountId: googleId,
            }
          },
          userPreferences: {
            create: {
              theme: 'light',
              reduceMotion: false,
              notificationSettings: {},
            }
          }
        },
        include: {
          accounts: true,
        }
      });
    }

    if (!user) {
      res.status(500).json({ success: false, message: 'Failed to authenticate user.' });
      return;
    }

    // Generate JWT and set it in cookie
    const token = generateToken(user.id, user.email, user.role);
    setJWTCookie(res, token);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user logout
 */
export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    clearJWTCookie(res);
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        role: true,
        avatar: true,
        userPreferences: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
