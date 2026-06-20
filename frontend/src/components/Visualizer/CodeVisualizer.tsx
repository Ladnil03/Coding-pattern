import React, { useState, useEffect, useRef } from 'react';
import type { VisualizationConfig, StepSnapshot } from '../../types/visualization';
import styles from './CodeVisualizer.module.css';
import { ThreeVisualizer } from './ThreeVisualizer';

interface CodeVisualizerProps {
  config: VisualizationConfig;
  activeStepIdx: number;
  setActiveStepIdx: (idx: number) => void;
  prefersReducedMotion?: boolean;
}

export const CodeVisualizer: React.FC<CodeVisualizerProps> = ({
  config,
  activeStepIdx,
  setActiveStepIdx,
  prefersReducedMotion = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const playTimerRef = useRef<number | null>(null);

  const { steps, inputLabel, type } = config;
  const currentStep: StepSnapshot | undefined = steps[activeStepIdx];

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        if (activeStepIdx < steps.length - 1) {
          setActiveStepIdx(activeStepIdx + 1);
        } else {
          setIsPlaying(false);
        }
      }, 2500); // 2.5 seconds per step
    } else {
      if (playTimerRef.current !== null) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }

    return () => {
      if (playTimerRef.current !== null) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, activeStepIdx, steps.length, setActiveStepIdx]);

  // Handle step adjustments
  const handlePrev = () => {
    setIsPlaying(false);
    if (activeStepIdx > 0) {
      setActiveStepIdx(activeStepIdx - 1);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (activeStepIdx < steps.length - 1) {
      setActiveStepIdx(activeStepIdx + 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setActiveStepIdx(parseInt(e.target.value, 10));
  };

  if (steps.length === 0 || !currentStep) {
    return (
      <div className={styles.visualizerContainer}>
        <div className={styles.emptyState}>No visualization data available for this pattern.</div>
      </div>
    );
  }

  const { state, narration, label } = currentStep;

  // Render SVG for Array-based structures
  const renderArrayVisualization = () => {
    const arr = state.array || [];
    const pointers = state.pointers || {};
    const windowBounds = state.window;
    const highlighted = state.highlighted || [];

    const boxSize = 52;
    const gap = 12;
    const paddingX = 40;
    const paddingY = 60; // Extra room for pointers/labels below

    const totalWidth = arr.length * (boxSize + gap) - gap + paddingX * 2;
    const totalHeight = boxSize + paddingY * 2;

    return (
      <svg
        className={styles.svg}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="boxGradNormal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-tertiary)" />
            <stop offset="100%" stopColor="var(--bg-secondary)" />
          </linearGradient>
          <linearGradient id="boxGradHighlighted" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary-hover)" />
            <stop offset="100%" stopColor="var(--accent-primary)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Draw Sliding Window Highlight */}
        {windowBounds && (
          <rect
            x={paddingX + windowBounds[0] * (boxSize + gap) - 6}
            y={paddingY - 6}
            width={(windowBounds[1] - windowBounds[0] + 1) * (boxSize + gap) - gap + 12}
            height={boxSize + 12}
            rx={12}
            className={styles.svgWindow}
            filter="url(#glow)"
          />
        )}

        {/* Draw Array Boxes */}
        {arr.map((val, idx) => {
          const isHighlighted = highlighted.includes(idx);
          const x = paddingX + idx * (boxSize + gap);
          const y = paddingY;

          // Check if index is within the window (for styling)
          const isInWindow = windowBounds && idx >= windowBounds[0] && idx <= windowBounds[1];

          return (
            <g key={idx} className={styles.svgBoxGroup}>
              <rect
                x={x}
                y={y}
                width={boxSize}
                height={boxSize}
                rx={8}
                className={`${styles.svgBox} ${isHighlighted ? styles.svgBoxHighlighted : ''} ${
                  isInWindow ? styles.svgBoxInWindow : ''
                }`}
                fill={isHighlighted ? 'url(#boxGradHighlighted)' : 'url(#boxGradNormal)'}
              />
              <text
                x={x + boxSize / 2}
                y={y + boxSize / 2 + 5}
                className={`${styles.svgBoxText} ${isHighlighted ? styles.svgBoxTextHighlighted : ''}`}
              >
                {val}
              </text>
              <text x={x + boxSize / 2} y={y - 10} className={styles.svgIndexText}>
                {idx}
              </text>
            </g>
          );
        })}

        {/* Draw Pointers */}
        {Object.entries(pointers).map(([name, idx]) => {
          const x = paddingX + idx * (boxSize + gap) + boxSize / 2;
          const y = paddingY + boxSize;

          // Compute arrow offset to prevent overlap if pointing to the same place
          const sameIndexPointers = Object.entries(pointers).filter(([_, i]) => i === idx);
          const isStacked = sameIndexPointers.length > 1;
          const stackIdx = sameIndexPointers.findIndex(([n]) => n === name);
          const xOffset = isStacked ? (stackIdx - (sameIndexPointers.length - 1) / 2) * 14 : 0;

          // Color coded arrows
          const isLeft = name.toLowerCase().includes('left');

          return (
            <g key={name} className={styles.svgPointerGroup} transform={`translate(${xOffset}, 0)`}>
              <path
                d={`M ${x} ${y + 35} L ${x} ${y + 8}`}
                className={`${styles.svgArrow} ${isLeft ? styles.svgArrowLeft : styles.svgArrowRight}`}
                markerEnd="url(#arrow)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Pointer Arrowhead */}
              <polygon
                points={`${x},${y + 8} ${x - 5},${y + 14} ${x + 5},${y + 14}`}
                fill={isLeft ? 'var(--accent-tertiary-light)' : 'var(--accent-primary)'}
              />
              <rect
                x={x - 24}
                y={y + 38}
                width="48"
                height="20"
                rx="4"
                className={`${styles.svgPointerBadge} ${isLeft ? styles.svgBadgeLeft : styles.svgBadgeRight}`}
              />
              <text x={x} y={y + 51} className={styles.svgPointerText}>
                {name}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className={`${styles.visualizerContainer} ${prefersReducedMotion ? styles.reducedMotion : ''}`}>
      <div className={styles.visualizerHeader}>
        <div className={styles.titleInfo}>
          <span className={styles.stepLabel}>Step {activeStepIdx + 1} of {steps.length}</span>
          <h2 className={styles.stepTitle}>{label}</h2>
        </div>
        <div className={styles.headerControls}>
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleBtn} ${viewMode === '2d' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('2d')}
            >
              2D View
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === '3d' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </button>
          </div>
          <div className={styles.inputInfo}>
            <span className={styles.inputBadge}>Input</span>
            <code className={styles.inputCode}>{inputLabel}</code>
          </div>
        </div>
      </div>

      <div className={styles.canvasArea} role="img" aria-label={`Visualization for ${label}. ${narration}`}>
        {viewMode === '3d' ? (
          <ThreeVisualizer config={config} activeStepIdx={activeStepIdx} />
        ) : (
          type === 'array' ? (
            <div className={styles.svgWrapper}>{renderArrayVisualization()}</div>
          ) : (
            <div className={styles.stubVisualizer}>
              <svg viewBox="0 0 400 200" className={styles.stubSvg}>
                <rect width="400" height="200" rx="12" fill="var(--bg-secondary)" stroke="var(--border-color)" />
                <text x="200" y="80" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">
                  {type.toUpperCase()} 2D Visualization
                </text>
                <text x="200" y="110" textAnchor="middle" fill="var(--text-secondary)" fontSize="13">
                  Check out the interactive 3D View for full structural rendering!
                </text>
                <text x="200" y="130" textAnchor="middle" fill="var(--text-muted)" fontSize="12">
                  Active Step ID: {currentStep.logicalStepId}
                </text>
              </svg>
            </div>
          )
        )}
      </div>

      {/* Narration Overlay */}
      <div className={styles.narration}>
        <div className={styles.narrationIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8M12 4a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3z" />
          </svg>
        </div>
        <p className={styles.narrationText}>{narration}</p>
      </div>

      {/* Control Bar */}
      <div className={styles.controls}>
        <div className={styles.mainControls}>
          <button
            onClick={handlePrev}
            disabled={activeStepIdx === 0}
            className={styles.controlBtn}
            aria-label="Previous step"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h2V5H6v14zm3.5-7L18 5v14l-8.5-7z" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className={`${styles.controlBtn} ${styles.playBtn} ${isPlaying ? styles.isPlaying : ''}`}
            aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={activeStepIdx === steps.length - 1}
            className={styles.controlBtn}
            aria-label="Next step"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 19h-2V5h2v14zM5 5v14l8.5-7L5 5z" />
            </svg>
          </button>
        </div>

        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min="0"
            max={steps.length - 1}
            value={activeStepIdx}
            onChange={handleSliderChange}
            className={styles.slider}
            aria-label="Visualization step scrubber"
          />
        </div>
      </div>
    </div>
  );
};
