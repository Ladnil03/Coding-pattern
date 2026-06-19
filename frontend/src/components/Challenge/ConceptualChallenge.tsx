import React, { useState } from 'react';
import type { ConceptualChallenge as ChallengeType } from '../../types/pattern';
import { useProgress } from '../../context/ProgressContext';
import styles from './ConceptualChallenge.module.css';

interface ConceptualChallengeProps {
  patternId: string;
  challenge: ChallengeType;
}

export const ConceptualChallenge: React.FC<ConceptualChallengeProps> = ({
  patternId,
  challenge,
}) => {
  const { toggleComplete, isCompleted } = useProgress();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selectedOption === challenge.correctAnswer;
  const isPatternFinished = isCompleted(patternId);

  const handleOptionSelect = (idx: number) => {
    if (hasChecked && isCorrect) return; // Prevent change after answering correctly
    setSelectedOption(idx);
    setHasChecked(false);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setHasChecked(true);

    // If correct, automatically mark pattern as completed if not already
    if (selectedOption === challenge.correctAnswer && !isPatternFinished) {
      toggleComplete(patternId);
    }
  };

  const handleToggleComplete = () => {
    toggleComplete(patternId);
  };

  return (
    <div className={styles.challengeCard}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.badge}>Conceptual Check</span>
          <h2 className={styles.title}>Test Your Understanding</h2>
        </div>

        {/* Manual completion toggle */}
        <button
          onClick={handleToggleComplete}
          className={`${styles.completionToggle} ${isPatternFinished ? styles.completed : ''}`}
          aria-label={isPatternFinished ? 'Mark pattern incomplete' : 'Mark pattern complete'}
        >
          <span className={styles.checkboxIcon}>
            {isPatternFinished && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          {isPatternFinished ? 'Pattern Completed' : 'Mark Completed'}
        </button>
      </div>

      <p className={styles.question}>{challenge.question}</p>

      <div className={styles.optionsList} role="radiogroup" aria-label="Challenge answers">
        {challenge.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          let optionClass = styles.option;

          if (isSelected) {
            optionClass += ` ${styles.selected}`;
          }

          if (hasChecked) {
            if (idx === challenge.correctAnswer) {
              optionClass += ` ${styles.correct}`;
            } else if (isSelected && !isCorrect) {
              optionClass += ` ${styles.incorrect}`;
            }
          }

          return (
            <button
              key={idx}
              role="radio"
              aria-checked={isSelected}
              disabled={hasChecked && isCorrect}
              onClick={() => handleOptionSelect(idx)}
              className={optionClass}
            >
              <span className={styles.radioCircle}>
                {isSelected && <span className={styles.radioInner} />}
              </span>
              <span className={styles.optionText}>{option}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => setShowHint((prev) => !prev)}
          className={styles.hintBtn}
          aria-expanded={showHint}
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>

        <button
          onClick={handleCheck}
          disabled={selectedOption === null || (hasChecked && isCorrect)}
          className={styles.checkBtn}
        >
          Check Answer
        </button>
      </div>

      {showHint && (
        <div className={styles.hintBox}>
          <strong>Hint:</strong> {challenge.hint}
        </div>
      )}

      {hasChecked && (
        <div className={`${styles.feedbackBox} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <div className={styles.feedbackHeader}>
            <span className={styles.feedbackIcon}>
              {isCorrect ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 8 12 12 14 14" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </span>
            <h3>{isCorrect ? 'Correct!' : 'Incorrect, try again.'}</h3>
          </div>
          <p className={styles.explanationText}>{challenge.explanation}</p>

          {isCorrect && (
            <div className={styles.celebrationBanner}>
              🎉 You've mastered the mechanics of this pattern! The pattern is now marked as complete.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
