import React, { useState, useEffect, useRef } from 'react';
import type { Language, ReferenceCode } from '../../types/pattern';
import styles from './CodeTabs.module.css';

interface CodeTabsProps {
  referenceCode: Record<Language, ReferenceCode>;
  activeLanguage: Language;
  setActiveLanguage: (lang: Language) => void;
  activeStepId: string | null;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({
  referenceCode,
  activeLanguage,
  setActiveLanguage,
  activeStepId,
}) => {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCodeData = referenceCode[activeLanguage];
  const codeText = activeCodeData?.code || '';

  // Get lines to highlight for the current step
  const highlightedLines =
    activeStepId && activeCodeData?.lineMapping
      ? activeCodeData.lineMapping[activeStepId] || []
      : [];

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Highlighting with Shiki (async loading)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const highlightCode = async () => {
      try {
        // Dynamic import shiki to speed up initial load and handle browser execution
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(codeText, {
          lang: activeLanguage === 'cpp' ? 'cpp' : activeLanguage === 'java' ? 'java' : 'python',
          theme: 'shades-of-purple',
        });

        if (isMounted) {
          setHighlightedHtml(html);
          setLoading(false);
        }
      } catch (err) {
        console.error('Shiki highlight error, falling back to raw code:', err);
        if (isMounted) {
          // Fallback to simple pre block if Shiki fails
          setHighlightedHtml('');
          setLoading(false);
        }
      }
    };

    highlightCode();

    return () => {
      isMounted = false;
    };
  }, [codeText, activeLanguage]);

  // Adjust scroll position to show highlighted lines
  useEffect(() => {
    if (highlightedLines.length > 0 && containerRef.current) {
      const codeElement = containerRef.current.querySelector('code, pre');
      if (codeElement) {
        // Find line element (Shiki outputs line by line in span.line)
        const lines = codeElement.querySelectorAll('.line');
        const firstHighlightedLineIndex = highlightedLines[0] - 1; // 1-indexed to 0-indexed
        const lineEl = lines[firstHighlightedLineIndex] as HTMLElement;

        if (lineEl) {
          lineEl.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }
    }
  }, [highlightedLines]);

  // Process the HTML to inject custom highlighting class on active lines
  const renderHighlightedCode = () => {
    if (!highlightedHtml) {
      // Manual fallback rendering if Shiki hasn't loaded or failed
      const lines = codeText.split('\n');
      return (
        <pre className={styles.fallbackPre}>
          <code>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isLineHighlighted = highlightedLines.includes(lineNum);
              return (
                <div
                  key={idx}
                  className={`${styles.fallbackLine} ${
                    isLineHighlighted ? styles.highlightedLine : ''
                  }`}
                >
                  <span className={styles.lineNumber}>{lineNum}</span>
                  <span className={styles.lineContent}>{line || ' '}</span>
                </div>
              );
            })}
          </code>
        </pre>
      );
    }

    // Since Shiki wraps each line in `<span class="line">`, we can parse/replace or inject highlights
    // Let's parse the HTML string and add background highlights
    // We can do this cleanly in CSS by targetting line indices or parsing the HTML.
    // However, parsing HTML string with RegExp or DOMParser is very reliable.
    // Let's use a DOMParser to parse the Shiki HTML and inject classNames to matching lines.
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(highlightedHtml, 'text/html');
      const lines = doc.querySelectorAll('.line');

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        // Add line number attribute for CSS counter/content if needed, or pre-render a line number element
        const lineNumSpan = doc.createElement('span');
        lineNumSpan.className = styles.lineNumber;
        lineNumSpan.textContent = lineNum.toString();
        line.insertBefore(lineNumSpan, line.firstChild);

        if (highlightedLines.includes(lineNum)) {
          line.classList.add(styles.shikiHighlightedLine);
        }
      });

      return <div dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
    } catch (e) {
      console.error('Failed to parse highlighted HTML', e);
      return <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />;
    }
  };

  return (
    <div className={styles.codeContainer} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.tabs} role="tablist" aria-label="Code language selection">
          {(['cpp', 'python', 'java'] as Language[]).map((lang) => (
            <button
              key={lang}
              role="tab"
              aria-selected={activeLanguage === lang}
              aria-controls={`panel-${lang}`}
              id={`tab-${lang}`}
              tabIndex={activeLanguage === lang ? 0 : -1}
              onClick={() => setActiveLanguage(lang)}
              className={`${styles.tab} ${activeLanguage === lang ? styles.activeTab : ''}`}
            >
              {lang === 'cpp' ? 'C++' : lang === 'java' ? 'Java' : 'Python'}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className={styles.copyButton}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.copyIcon}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.copyIcon}
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div
        id={`panel-${activeLanguage}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeLanguage}`}
        className={styles.codeBlock}
      >
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>Highlighting code...</span>
          </div>
        ) : (
          renderHighlightedCode()
        )}
      </div>
    </div>
  );
};
