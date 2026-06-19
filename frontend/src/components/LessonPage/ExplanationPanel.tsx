import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ExplanationPanel.module.css';

interface ExplanationPanelProps {
  title: string;
  explanation: string;
  whenToUse: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  title,
  explanation,
  whenToUse,
  timeComplexity,
  spaceComplexity,
}) => {
  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.metaGrid}>
        <div className={styles.metaCard}>
          <span className={styles.metaLabel}>Time Complexity</span>
          <span className={styles.metaValue}>{timeComplexity}</span>
        </div>
        <div className={styles.metaCard}>
          <span className={styles.metaLabel}>Space Complexity</span>
          <span className={styles.metaValue}>{spaceComplexity}</span>
        </div>
      </div>

      <div className={styles.content}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
      </div>

      <section className={styles.whenToUseSection}>
        <h2 className={styles.sectionTitle}>When to Use</h2>
        <ul className={styles.useList}>
          {whenToUse.map((reason, idx) => (
            <li key={idx} className={styles.useItem}>
              <svg
                className={styles.checkIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
