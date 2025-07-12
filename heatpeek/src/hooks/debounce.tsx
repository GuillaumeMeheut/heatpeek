import { useEffect, useState } from "react";

export function useDebouncedState<T>(
  value: T,
  delay: number,
  onDebounce: (v: T) => void
) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onDebounce(localValue);
      }
    }, delay);
    return () => clearTimeout(handler);
  }, [localValue, value, delay, onDebounce]);

  return [localValue, setLocalValue] as const;
}
