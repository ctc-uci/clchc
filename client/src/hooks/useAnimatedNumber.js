import { animate } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

function displayInteger(current, target) {

  if (Math.abs(current - target) < 1e-4) {
    return Math.round(target);
  }
  if (target > current) {
    return Math.min(target, Math.ceil(current - 1e-9));
  }
  return Math.max(target, Math.floor(current + 1e-9));
}

export function useAnimatedNumber(target, options = {}) {
  const { duration = 0.12 } = options;
  const [current, setCurrent] = useState(() => target);
  const lastRef = useRef(target);
  const didMount = useRef(false);

  useLayoutEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      lastRef.current = target;
      setCurrent(target);
      return;
    }

    const from = lastRef.current;
    if (from === target) {
      setCurrent(target);
      return;
    }

    const goingUp = target > from;
    const controls = animate(from, target, {
      duration,
      ease: goingUp ? "easeOut" : [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        lastRef.current = v;
        setCurrent(v);
      },
      onComplete: () => {
        lastRef.current = target;
        setCurrent(target);
      },
    });
    return () => controls.stop();
  }, [target, duration]);

  return displayInteger(current, target);
}
