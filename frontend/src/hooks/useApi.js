import { useState, useEffect, useCallback } from 'react';

/**
 * Reusable hook for calling centralized API services with loading, error, retry, and fallback states.
 *
 * @param {Function} apiFn - API service function returning { success, data, message, error }
 * @param {Array} params - Static parameters to pass to apiFn
 * @param {Object} options - Configuration options: { immediate, fallbackData, transform }
 */
export function useApi(apiFn, params = [], options = {}) {
  const { immediate = true, fallbackData = null, transform = (d) => d } = options;

  const [data, setData] = useState(() => (fallbackData ? transform(fallbackData) : null));
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...overrideParams) => {
    setLoading(true);
    setError(null);
    try {
      const callParams = overrideParams.length > 0 ? overrideParams : params;
      const res = await apiFn(...callParams);

      if (res && res.success) {
        const transformed = transform(res.data);
        setData(transformed);
        return { success: true, data: transformed };
      } else {
        const errMsg = res?.error || res?.message || 'Server returned an unsuccessful response.';
        setError(errMsg);
        if (fallbackData) {
          setData(transform(fallbackData));
        }
        return { success: false, error: errMsg };
      }
    } catch (err) {
      const errMsg = err.message || 'Network request failed. Please check connectivity.';
      setError(errMsg);
      if (fallbackData) {
        setData(transform(fallbackData));
      }
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, [apiFn, JSON.stringify(params), fallbackData]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData
  };
}

export default useApi;
