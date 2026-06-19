import React from 'react';
import { NavLink } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { categories } from '../../data/categories';
import { patterns } from '../../data/patterns';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { getOverallProgress, isCompleted } = useProgress();
  const overall = getOverallProgress();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Overall Progress</span>
            <span className={styles.progressVal}>{overall.completed}/{overall.total}</span>
          </div>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${overall.percentage}%` }}
              role="progressbar"
              aria-valuenow={overall.completed}
              aria-valuemin={0}
              aria-valuemax={overall.total}
              aria-label="Overall pattern learning progress"
            />
          </div>
          <span className={styles.progressPercent}>{overall.percentage}% Complete</span>
        </div>

        <nav className={styles.nav}>
          {categories.map((category) => {
            const categoryPatterns = patterns.filter((p) => category.patternIds.includes(p.id));

            return (
              <div key={category.id} className={styles.categoryGroup}>
                <h3 className={styles.categoryTitle}>
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  {category.title}
                </h3>
                <ul className={styles.patternList}>
                  {categoryPatterns.map((pattern) => {
                    const completed = isCompleted(pattern.id);
                    return (
                      <li key={pattern.id}>
                        <NavLink
                          to={`/pattern/${pattern.id}`}
                          className={({ isActive }) =>
                            `${styles.patternLink} ${isActive ? styles.activeLink : ''}`
                          }
                          onClick={onClose}
                        >
                          <span
                            className={`${styles.statusDot} ${
                              completed ? styles.statusCompleted : styles.statusIncomplete
                            }`}
                            aria-hidden="true"
                          />
                          <span className={styles.patternName}>{pattern.title}</span>
                          {completed && (
                            <svg
                              className={styles.completedIcon}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
