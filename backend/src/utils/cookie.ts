import { Response } from 'express';

const COOKIE_NAME = 'token';

/**
 * Sets a secure, HTTP-only cookie containing the JWT on the response object.
 */
export const setJWTCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Cookie expires in 30 days (matching JWT expiration if any)
  const maxAge = 30 * 24 * 60 * 60 * 1000; 

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction, // Send only over HTTPS in production
    sameSite: isProduction ? 'strict' : 'lax', // Protect against CSRF
    maxAge: maxAge,
    path: '/',
  });
};

/**
 * Clears the JWT session cookie.
 */
export const clearJWTCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });
};
