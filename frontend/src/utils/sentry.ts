// Frontend Sentry Instrumentation Wrapper

/**
 * Initializes error tracking.
 * In a full production env, this imports @sentry/react and runs Sentry.init()
 */
export function initErrorTracking(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.log('[Telemetry] Sentry DSN not found. Operating in local logger mode.');
    return;
  }

  // Dynamic import to keep initial bundle size light
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.05,
      replaysOnErrorSampleRate: 1.0,
    });
  }).catch((err) => {
    console.error('Failed to dynamically load Sentry library:', err);
  });
}

/**
 * Logs an error to tracking service.
 */
export function captureException(error: unknown, context?: Record<string, any>): void {
  console.error('[Logged Error]', error, context);
  
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (dsn) {
    import('@sentry/react').then((Sentry) => {
      Sentry.withScope((scope: any) => {
        if (context) {
          scope.setExtras(context);
        }
        Sentry.captureException(error);
      });
    });
  }
}
