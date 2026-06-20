import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  provider: 'EMAIL' | 'GOOGLE' | 'GITHUB';
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  avatar?: string;
  is_anonymous?: boolean;
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (idToken: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check backend session on mount
  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const fetchedUser = data.data;
          setUser(fetchedUser);
          
          // Generate a client-side mock JWT token or read cookie
          // To keep compatibility, we expose a dummy token if cookies handle auth
          setSession({
            access_token: 'cookie-session-active',
            user: fetchedUser,
          });
        }
      } else {
        // Fallback to local storage anonymous user if saved
        const savedMockUser = localStorage.getItem('mock_auth_user');
        if (savedMockUser) {
          const u = JSON.parse(savedMockUser);
          setUser(u);
          setSession({
            access_token: 'mock-jwt-token-for-dev',
            user: u,
          });
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const signInAnonymously = async () => {
    setLoading(true);
    try {
      const mockUserId = '11111111-2222-3333-4444-555555555555';
      const dummyUser: User = {
        id: mockUserId,
        name: 'Guest Learner',
        email: '',
        is_anonymous: true,
        provider: 'EMAIL',
        role: 'USER',
      };

      localStorage.setItem('mock_auth_user', JSON.stringify(dummyUser));
      setUser(dummyUser);
      setSession({
        access_token: 'mock-jwt-token-for-dev',
        user: dummyUser,
      });
    } catch (err) {
      console.error('Anonymous sign-in failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.data);
        setSession({
          access_token: 'cookie-session-active',
          user: data.data,
        });
        localStorage.removeItem('mock_auth_user'); // Remove mock if login succeeds
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.data);
        setSession({
          access_token: 'cookie-session-active',
          user: data.data,
        });
        localStorage.removeItem('mock_auth_user');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.data);
        setSession({
          access_token: 'cookie-session-active',
          user: data.data,
        });
        localStorage.removeItem('mock_auth_user');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Google authentication failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error on server:', error);
    } finally {
      localStorage.removeItem('mock_auth_user');
      setUser(null);
      setSession(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInAnonymously, signOut, login, signup, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
