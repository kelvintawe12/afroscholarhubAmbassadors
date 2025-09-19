import { useState, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showToastOnError?: boolean;
  }
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });

        if (options?.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState({ data: null, loading: false, error: errorMessage });

        if (options?.onError) {
          options.onError(errorMessage);
        }

        return null;
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Helper function to extract error message from various error types
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (isPostgrestError(error)) {
    return error.message || 'Database error occurred';
  }

  if (isSupabaseAuthError(error)) {
    return error.message || 'Authentication error occurred';
  }

  return 'An unexpected error occurred';
}

// Type guards for Supabase errors
function isPostgrestError(error: any): error is PostgrestError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
}

function isSupabaseAuthError(error: any): error is { message: string } {
  return error && typeof error === 'object' && 'message' in error && !('code' in error);
}

// Hook for handling async operations with retry logic
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  }
) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
    retryCount: number;
  }>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const execute = useCallback(async () => {
    const maxRetries = options?.maxRetries ?? 3;
    const retryDelay = options?.retryDelay ?? 1000;

    setState(prev => ({ ...prev, loading: true, error: null }));

    let lastError: string = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        setState({
          data: result,
          loading: false,
          error: null,
          retryCount: attempt,
        });

        if (options?.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        lastError = getErrorMessage(error);

        if (attempt < maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          setState(prev => ({ ...prev, retryCount: attempt + 1 }));
        }
      }
    }

    setState({
      data: null,
      loading: false,
      error: lastError,
      retryCount: maxRetries,
    });

    if (options?.onError) {
      options.onError(lastError);
    }

    return null;
  }, [operation, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    canRetry: state.error !== null && state.retryCount < (options?.maxRetries ?? 3),
  };
}
