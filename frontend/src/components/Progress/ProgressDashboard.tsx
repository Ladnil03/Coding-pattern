import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { categories } from '../../data/categories';
import { patterns } from '../../data/patterns';
import styles from './ProgressDashboard.module.css';

export const ProgressDashboard: React.FC = () => {
  const { completedPatterns, getCategoryProgress, getOverallProgress } = useProgress();
  const overall = getOverallProgress();

  // Find recently completed patterns (last completed first, in this case we'll list completed patterns)
  const completedList = patterns.filter((p) => completedPatterns.includes(p.id));

  // Find suggested next patterns: up to 3 uncompleted patterns, prioritising beginner difficulty
  const uncompletedList = patterns.filter((p) => !completedPatterns.includes(p.id));
  const suggestedNext = [...uncompletedList]
    .sort((a, b) => {
      const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    })
    .slice(0, 3);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Your Learning Progress</h1>
      <p className={styles.subtitle}>
        Track your progress through the 20 fundamental coding patterns. Complete conceptual challenges to finish patterns.
      </p>

      {/* Overall Progress Block */}
      <section className={styles.overallSection} aria-label="Overall Progress Summary">
        <div className={styles.overallStats}>
          <div className={styles.statGroup}>
            <span className={styles.statLabel}>Completed Patterns</span>
            <span className={styles.statValue}>
              {overall.completed} <span className={styles.statTotal}>/ {overall.total}</span>
            </span>
          </div>
          <div className={styles.statGroup}>
            <span className={styles.statLabel}>Completion Rate</span>
            <span className={styles.statValue}>{overall.percentage}%</span>
          </div>
        </div>

        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${overall.percentage}%` }}
              role="progressbar"
              aria-valuenow={overall.completed}
              aria-valuemin={0}
              aria-valuemax={overall.total}
              aria-label="Overall progress bar"
            />
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        {/* Category Breakdown */}
        <section className={styles.card} aria-label="Category Progress Breakdown">
          <h2 className={styles.cardTitle}>Category Breakdown</h2>
          <div className={styles.categoryList}>
            {categories.map((cat) => {
              const progress = getCategoryProgress(cat.id);
              const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

              return (
                <div key={cat.id} className={styles.categoryItem}>
                  <div className={styles.categoryMeta}>
                    <div className={styles.categoryTitleWrapper}>
                      <span className={styles.categoryIcon}>{cat.icon}</span>
                      <span className={styles.categoryTitle}>{cat.title}</span>
                    </div>
                    <span className={styles.categoryCount}>
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  <div className={styles.itemBarBg}>
                    <div
                      className={styles.itemBarFill}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Suggested Next & History */}
        <div className={styles.sideStack}>
          {/* Suggested Next Patterns */}
          <section className={styles.card} aria-label="Suggested Next Patterns">
            <h2 className={styles.cardTitle}>Suggested Next</h2>
            {suggestedNext.length === 0 ? (
              <div className={styles.emptyPrompt}>
                🎉 Outstanding work! You have mastered all 20 coding patterns!
              </div>
            ) : (
              <div className={styles.suggestedList}>
                {suggestedNext.map((p) => (
                  <Link key={p.id} to={`/pattern/${p.id}`} className={styles.suggestedCard}>
                    <div className={styles.suggestedHeader}>
                      <span className={styles.suggestedIcon}>{p.icon}</span>
                      <span className={`${styles.difficulty} ${styles[p.difficulty]}`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <h3 className={styles.suggestedTitle}>{p.title}</h3>
                    <p className={styles.suggestedSummary}>{p.summary}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recently Completed */}
          <section className={styles.card} aria-label="Recently Completed Patterns">
            <h2 className={styles.cardTitle}>Completed Patterns</h2>
            {completedList.length === 0 ? (
              <div className={styles.emptyPrompt}>
                No completed patterns yet. Open a pattern, learn its mechanics, and solve its conceptual check to mark it finished!
              </div>
            ) : (
              <ul className={styles.completedList}>
                {completedList.map((p) => (
                  <li key={p.id} className={styles.completedItem}>
                    <Link to={`/pattern/${p.id}`} className={styles.completedLink}>
                      <div className={styles.completedMeta}>
                        <span className={styles.completedIcon}>{p.icon}</span>
                        <span className={styles.completedTitle}>{p.title}</span>
                      </div>
                      <svg
                        className={styles.checkIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
