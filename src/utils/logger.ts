type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private sessionId = this.generateSessionId();

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  private getCurrentUserId(): string | undefined {
    // This would typically come from your auth context/state
    // For now, return undefined
    return undefined;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.createLogEntry(level, message, data);

    // Always log to console in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'debug' : level === 'warn' ? 'warn' : level === 'error' ? 'error' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || '');
    }

    // Send to external logging service in production
    if (!this.isDevelopment) {
      this.sendToExternalService(entry);
    }

    // Store in local storage for debugging (limited to last 100 entries)
    this.storeLocally(entry);
  }

  private sendToExternalService(entry: LogEntry) {
    // Here you would send to services like Sentry, LogRocket, etc.
    // For now, we'll just store locally
    try {
      // Example: Send to Sentry
      // Sentry.captureMessage(entry.message, {
      //   level: entry.level,
      //   extra: entry.data,
      //   tags: {
      //     sessionId: entry.sessionId,
      //     userId: entry.userId,
      //   },
      // });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  private storeLocally(entry: LogEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(entry);

      // Keep only the last 100 entries
      if (logs.length > 100) {
        logs.shift();
      }

      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store log locally:', error);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  // Performance logging
  performance(operation: string, startTime: number, data?: any) {
    const duration = Date.now() - startTime;
    this.info(`Performance: ${operation}`, {
      duration: `${duration}ms`,
      ...data,
    });
  }

  // User action logging
  userAction(action: string, data?: any) {
    this.info(`User Action: ${action}`, data);
  }

  // API call logging
  apiCall(endpoint: string, method: string, status: number, duration: number, data?: any) {
    const level = status >= 400 ? 'error' : 'info';
    this.log(level, `API Call: ${method} ${endpoint}`, {
      status,
      duration: `${duration}ms`,
      ...data,
    });
  }

  // Error boundary logging
  errorBoundary(error: Error, errorInfo: any) {
    this.error('Error Boundary Caught Error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  // Get stored logs (for debugging)
  getStoredLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored logs
  clearStoredLogs() {
    try {
      localStorage.removeItem('app_logs');
    } catch (error) {
      console.error('Failed to clear stored logs:', error);
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, data?: any) => logger.debug(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logError = (message: string, data?: any) => logger.error(message, data);

// Performance timing utility
export const startTiming = (label: string) => {
  const startTime = Date.now();
  return {
    end: (data?: any) => {
      logger.performance(label, startTime, data);
      return Date.now() - startTime;
    },
  };
};

// React hook for component logging
export const useLogger = () => {
  return {
    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError,
    performance: logger.performance.bind(logger),
    userAction: logger.userAction.bind(logger),
    apiCall: logger.apiCall.bind(logger),
  };
};
