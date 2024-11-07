import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay = 200) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value), delay]);

  return debouncedValue;
};