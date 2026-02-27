/**
 * Global Logging Utility for K-POP Korean Learning
 * Provides structured logging with different levels
 */

const logger = (() => {
  const isDevelopment = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';

  // Log levels
  const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };

  // Current log level (DEBUG in dev, INFO in prod)
  const currentLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;

  /**
   * Format log message with timestamp and context
   */
  function formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    return { prefix, message, data };
  }

  /**
   * Send error to external tracking service (e.g., Sentry)
   */
  function trackError(error, context) {
    // TODO: Integrate with Sentry or similar service
    // For now, just log to console
    if (!isDevelopment && window.navigator.onLine) {
      // Production error tracking would go here
      console.error('Error tracked:', error, context);
    }
  }

  return {
    /**
     * Debug level logging (development only)
     */
    debug(message, data = null) {
      if (currentLevel <= LogLevel.DEBUG) {
        const log = formatMessage('DEBUG', message, data);
        console.log(log.prefix, log.message, log.data || '');
      }
    },

    /**
     * Info level logging
     */
    info(message, data = null) {
      if (currentLevel <= LogLevel.INFO) {
        const log = formatMessage('INFO', message, data);
        console.log(log.prefix, log.message, log.data || '');
      }
    },

    /**
     * Warning level logging
     */
    warn(message, data = null) {
      if (currentLevel <= LogLevel.WARN) {
        const log = formatMessage('WARN', message, data);
        console.warn(log.prefix, log.message, log.data || '');
      }
    },

    /**
     * Error level logging with tracking
     */
    error(message, error = null, context = {}) {
      const log = formatMessage('ERROR', message, { error, context });
      console.error(log.prefix, log.message, log.data);

      // Track critical errors
      if (error instanceof Error) {
        trackError(error, { message, ...context });
      }
    },

    /**
     * Log game events for analytics
     */
    gameEvent(eventName, eventData = {}) {
      this.info(`Game Event: ${eventName}`, eventData);

      // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
      if (!isDevelopment && window.gtag) {
        // Example: gtag('event', eventName, eventData);
      }
    },

    /**
     * Log performance metrics
     */
    performance(metric, value, unit = 'ms') {
      this.debug(`Performance: ${metric}`, { value, unit });

      // TODO: Send to performance monitoring service
    },

    /**
     * Log user actions
     */
    userAction(action, details = {}) {
      this.info(`User Action: ${action}`, details);
    }
  };
})();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = logger;
}
