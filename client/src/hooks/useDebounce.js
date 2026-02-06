import { useEffect, useMemo, useRef } from "react";

import debounce from "lodash.debounce";

export function useDebounce(fn, delay = 300) {
  const fnRef = useRef(fn); // prevent debounce function recreation

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debouncedFn = useMemo(() => {
    return debounce((...args) => {
      fnRef.current(...args);
    }, delay);
  }, [delay]);

  // Handle cleanup
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
