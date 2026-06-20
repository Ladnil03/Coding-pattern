import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, signInAnonymously, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset fields on toggle/close
  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg(null);
  }, [isSignUp, isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password || (isSignUp && !name)) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      if (isSignUp) {
        const res = await signup(name, email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Registration failed.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    }
  };

  const handleGuestLogin = async () => {
    setErrorMsg(null);
    try {
      await signInAnonymously();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in as guest.');
    }
  };

  const handleGoogleClick = () => {
    setErrorMsg('Google OAuth is initiated. Make sure to configure VITE_GOOGLE_CLIENT_ID and complete verification.');
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        <div className={styles.header}>
          <h2 id="auth-title" className={styles.title}>
            {isSignUp ? 'Join PatternLearn' : 'Welcome Back'}
          </h2>
          <p className={styles.subtitle}>
            {isSignUp ? 'Start mastering coding patterns today.' : 'Log in to track your learning progress.'}
          </p>
        </div>

        {errorMsg && (
          <div className={styles.errorBanner} role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <div className={styles.inputGroup}>
              <label htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Smith"
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.socialButtons}>
          <button onClick={handleGoogleClick} className={styles.googleBtn} type="button">
            <svg className={styles.socialIcon} viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button onClick={handleGuestLogin} className={styles.guestBtn} type="button" disabled={loading}>
            🚪 Enter as Guest
          </button>
        </div>

        <div className={styles.footer}>
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button className={styles.switchBtn} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
