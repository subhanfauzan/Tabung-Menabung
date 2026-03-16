import { useState, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook for fetch operations with loading and error states
 */
export const useFetch = <T>(fn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { data, loading, error, execute };
};
