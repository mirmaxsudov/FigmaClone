import React from 'react';

export const useDebouncedValue = <T extends boolean | number | string | null | undefined>(
  value: T,
  delay = 300
) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
