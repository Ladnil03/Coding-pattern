import React, { useState, useEffect } from 'react';
import styles from './MotionWrapper.module.css';

interface MotionWrapperProps {
  children: (props: { prefersReducedMotion: boolean; manualDisableMotion: boolean }) => React.ReactElement;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({ children }) => {
  // 1. Check system query parameters
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // 2. Check local overlay override settings
  const [manualDisableMotion, setManualDisableMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('disable_ui_motion') === 'true';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleManualToggle = () => {
    setManualDisableMotion((prev) => {
      const newValue = !prev;
      localStorage.setItem('disable_ui_motion', newValue ? 'true' : 'false');
      return newValue;
    });
  };

  const isMotionDisabled = prefersReducedMotion || manualDisableMotion;

  return (
    <div className={styles.motionSettingsContainer}>
      <div className={styles.controlsHeader}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={manualDisableMotion}
            onChange={handleManualToggle}
            className={styles.checkboxInput}
          />
          <span className={styles.toggleText}>Reduce UI Transitions</span>
        </label>
        {prefersReducedMotion && (
          <span className={styles.systemBadge}>System Setting Applied</span>
        )}
      </div>
      
      {/* Run child render function passing down motion directives */}
      {children({ prefersReducedMotion, manualDisableMotion: isMotionDisabled })}
    </div>
  );
};
