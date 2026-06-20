import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../Auth/AuthModal';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (location.pathname !== '/') {
      // If we are not on home, navigate to home with the search query
      navigate(`/?q=${encodeURIComponent(value)}`);
    } else {
      if (value) {
        setSearchParams({ q: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logoAndMenu}>
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className={styles.menuBtn}
                aria-label="Toggle navigation menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <Link to="/" className={styles.logoLink} aria-label="Pattern Learn Home">
              <div className={styles.logo}>
                <svg
                  className={styles.logoIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  fill="none"
                >
                  <rect width="64" height="64" rx="14" fill="var(--bg-secondary)" />
                  <path
                    d="M18 22L30 34L18 46"
                    stroke="var(--accent-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M46 42H34"
                    stroke="var(--accent-tertiary-light)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                <span className={styles.logoText}>
                  Pattern<span className={styles.logoHighlight}>Learn</span>
                </span>
              </div>
            </Link>
          </div>

          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search 20 coding patterns..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
              aria-label="Search coding patterns"
            />
          </div>

          <div className={styles.actions}>
            <Link to="/progress" className={styles.progressBtn} aria-label="View Progress Dashboard">
              Progress
            </Link>

            {user ? (
              <div className={styles.profileContainer}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={styles.profileBtn}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  aria-label="User profile options"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className={styles.dropdown} onMouseLeave={() => setDropdownOpen(false)}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user.name}</p>
                      <p className={styles.dropdownEmail}>{user.email || 'Guest Learner'}</p>
                      <span className={styles.roleBadge}>{user.role}</span>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <button onClick={handleSignOut} className={styles.signOutBtn}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={styles.signInBtn}
                aria-label="Sign in to your account"
              >
                Sign In
              </button>
            )}

            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
