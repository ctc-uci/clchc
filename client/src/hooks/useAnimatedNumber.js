import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";


export function useAnimatedNumber(target, options = {}) {
  const { duration = 0.45 } = options;
  const [current, setCurrent] = useState(() => target);
  const lastRef = useRef(target);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      lastRef.current = target;
      setCurrent(target);
      return;
    }

    const from = lastRef.current;
    const controls = animate(from, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        lastRef.current = v;
        setCurrent(v);
      },
      onComplete: () => {
        lastRef.current = target;
      },
    });
    return () => controls.stop();
  }, [target, duration]);

  return Math.round(current);
}
