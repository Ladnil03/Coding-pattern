// Backend Sentry Instrumentation Wrapper

/**
 * Initializes error tracking on the backend node server.
 */
export function initBackendErrorTracking(): void {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.log('[Telemetry] Backend Sentry DSN not found. Operating in local logger mode.');
    return;
  }

  // Load dynamically to avoid loading issues if dependency not in node_modules yet
  import('@sentry/node').then((Sentry) => {
    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
    });
  }).catch((err) => {
    console.error('Failed to load backend Sentry module:', err);
  });
}

/**
 * Captures exceptions in express route handlers.
 */
export function captureBackendException(error: unknown, context?: Record<string, any>): void {
  console.error('[Backend Error]', error, context);
  
  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    import('@sentry/node').then((Sentry) => {
      Sentry.withScope((scope: any) => {
        if (context) {
          scope.setExtras(context);
        }
        Sentry.captureException(error);
      });
    });
  }
}
