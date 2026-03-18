import { useState, useEffect } from "react";

/**
 * Returns a Date that updates every `intervalMs` milliseconds (default: 60s).
 * Used to trigger re-renders so relative timestamps stay current.
 */
export const useNow = (intervalMs = 60_000): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
