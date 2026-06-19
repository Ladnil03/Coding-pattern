import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { categories } from '../../data/categories';
import { patterns } from '../../data/patterns';
import styles from './PatternIndex.module.css';

export const PatternIndex: React.FC = () => {
  const { isCompleted, getCategoryProgress, getOverallProgress } = useProgress();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

  // Collapsible categories state (default all open)
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const overall = getOverallProgress();

  // Filter patterns based on search query
  const getFilteredPatterns = (patternIds: string[]) => {
    return patterns.filter(
      (p) =>
        patternIds.includes(p.id) &&
        (p.title.toLowerCase().includes(searchQuery) ||
          p.summary.toLowerCase().includes(searchQuery) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchQuery)))
    );
  };

  const hasMatches = categories.some(
    (cat) => getFilteredPatterns(cat.patternIds).length > 0
  );

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Master Algorithmic Patterns</h1>
        <p className={styles.subtitle}>
          Stop memorizing single solutions. Learn the underlying structural patterns that solve hundreds of coding interview questions.
        </p>

        {/* Global Progress Callout */}
        <div className={styles.progressCard}>
          <div className={styles.progressText}>
            <h2>Your Curriculum Progress</h2>
            <p>
              Complete conceptual checks to finish patterns. Persistent via localStorage.
            </p>
          </div>
          <div className={styles.progressStats}>
            <div className={styles.progressCircle}>
              <svg viewBox="0 0 36 36" className={styles.circularChart}>
                <path
                  className={styles.circleBg}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={styles.circle}
                  strokeDasharray={`${overall.percentage}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className={styles.percentage}>
                  {overall.percentage}%
                </text>
              </svg>
            </div>
            <div className={styles.statsLabel}>
              <span className={styles.statsCount}>
                {overall.completed} / {overall.total}
              </span>
              <span className={styles.statsSub}>Patterns Finished</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main categories listing */}
      <div className={styles.categoriesList}>
        {searchQuery && !hasMatches && (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3>No patterns match "{searchQuery}"</h3>
            <p>Try searching for words like "window", "heap", "pointer", "graph", or "dp".</p>
          </div>
        )}

        {categories.map((category) => {
          const filteredPatterns = getFilteredPatterns(category.patternIds);
          const isCollapsed = collapsedCategories[category.id] || false;
          const catProgress = getCategoryProgress(category.id);

          // If searching, hide categories that don't have matching patterns
          if (searchQuery && filteredPatterns.length === 0) {
            return null;
          }

          return (
            <div
              key={category.id}
              className={`${styles.categoryCard} ${isCollapsed ? styles.collapsed : ''}`}
            >
              <button
                className={styles.categoryHeader}
                onClick={() => toggleCategory(category.id)}
                aria-expanded={!isCollapsed}
              >
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <div>
                    <h2 className={styles.categoryTitle}>{category.title}</h2>
                    <p className={styles.categoryDesc}>{category.description}</p>
                  </div>
                </div>

                <div className={styles.headerRight}>
                  <div className={styles.categoryProgressBadge}>
                    {catProgress.completed}/{catProgress.total} Done
                  </div>
                  <svg
                    className={styles.chevron}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              <div className={styles.patternsGrid}>
                {filteredPatterns.map((pattern) => {
                  const completed = isCompleted(pattern.id);
                  return (
                    <Link
                      key={pattern.id}
                      to={`/pattern/${pattern.id}`}
                      className={`${styles.patternCard} ${
                        completed ? styles.cardCompleted : ''
                      }`}
                    >
                      <div className={styles.cardHeader}>
                        <span className={styles.cardEmoji}>{pattern.icon}</span>
                        <span
                          className={`${styles.difficultyBadge} ${
                            styles[pattern.difficulty]
                          }`}
                        >
                          {pattern.difficulty}
                        </span>
                      </div>

                      <h3 className={styles.cardTitle}>
                        {pattern.title}
                        {completed && (
                          <svg
                            className={styles.completedBadge}
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
                      </h3>

                      <p className={styles.cardSummary}>{pattern.summary}</p>

                      <div className={styles.cardFooter}>
                        {pattern.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.tag}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
