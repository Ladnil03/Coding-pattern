// src/types/auth.types.ts
import { User, Account, Session } from '@prisma/client';

export type AuthUser = User;
export type AuthAccount = Account;
export type AuthSession = Session;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}
