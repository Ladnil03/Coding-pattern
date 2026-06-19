import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatternById, getLessonByPatternId } from '../../data/patterns';
import { ExplanationPanel } from './ExplanationPanel';
import { CodeVisualizer } from '../Visualizer/CodeVisualizer';
import { CodeTabs } from './CodeTabs';
import { ConceptualChallenge } from '../Challenge/ConceptualChallenge';
import type { Language } from '../../types/pattern';
import styles from './LessonPage.module.css';

export const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const pattern = id ? getPatternById(id) : undefined;
  const lesson = id ? getLessonByPatternId(id) : undefined;

  // Active language tab (shared state)
  const [activeLanguage, setActiveLanguage] = useState<Language>('python');
  // Active step in visualization (shared state)
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  // Reset step index when pattern changes
  useEffect(() => {
    setActiveStepIdx(0);
  }, [id]);

  if (!pattern || !lesson) {
    return (
      <div className={styles.notFound}>
        <h2>Pattern Not Found</h2>
        <p>The coding pattern you are trying to view does not exist.</p>
        <Link to="/" className={styles.backBtn}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Get active step ID (for code line highlighting sync)
  const activeStepId =
    lesson.visualization.steps && lesson.visualization.steps[activeStepIdx]
      ? lesson.visualization.steps[activeStepIdx].logicalStepId
      : null;

  const isStub = pattern.id !== 'sliding-window' && pattern.id !== 'two-pointers';

  return (
    <div className={styles.lessonLayout}>
      {/* Navigation Header */}
      <div className={styles.lessonHeader}>
        <Link to="/" className={styles.backLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.backArrow}
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Patterns
        </Link>
        <div className={styles.headerInfo}>
          <span className={`${styles.difficulty} ${styles[pattern.difficulty]}`}>
            {pattern.difficulty}
          </span>
          <span className={styles.categoryBadge}>{pattern.category.replace('-', ' & ')}</span>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Explanation */}
        <section className={styles.leftCol} aria-label="Pattern Explanation">
          <ExplanationPanel
            title={pattern.title}
            explanation={lesson.explanation}
            whenToUse={lesson.whenToUse}
            timeComplexity={lesson.timeComplexity}
            spaceComplexity={lesson.spaceComplexity}
          />
        </section>

        {/* Right Column: Code & Visualizer */}
        <section className={styles.rightCol} aria-label="Interactive Sandbox">
          {isStub ? (
            <div className={styles.stubContainer}>
              <div className={styles.stubContent}>
                <span className={styles.stubIcon}>🚧</span>
                <h2>{pattern.title} Curriculum Stub</h2>
                <p>
                  This pattern explanation is styled and scaffolded. The complete curriculum content, C++/Python/Java reference implementations, and step-by-step SVG execution traces are being generated.
                </p>
                <div className={styles.stubActions}>
                  <Link to="/" className={styles.backBtn}>
                    Explore Available Patterns
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.workspace}>
              {/* SVG Visualizer Panel */}
              <div className={styles.visualizerPanel}>
                <CodeVisualizer
                  config={lesson.visualization}
                  activeStepIdx={activeStepIdx}
                  setActiveStepIdx={setActiveStepIdx}
                />
              </div>

              {/* Code Tab Syntax Highlighter Panel */}
              <div className={styles.codePanel}>
                <CodeTabs
                  referenceCode={lesson.referenceCode}
                  activeLanguage={activeLanguage}
                  setActiveLanguage={setActiveLanguage}
                  activeStepId={activeStepId}
                />
              </div>

              {/* Conceptual Challenge Section */}
              <div className={styles.challengePanel}>
                <ConceptualChallenge patternId={pattern.id} challenge={lesson.challenge} />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
