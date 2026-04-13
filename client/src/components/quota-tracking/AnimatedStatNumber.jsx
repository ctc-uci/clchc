import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

/**
 * Integer stat with count-up/down and a short nudge when the value rises or falls.
 */
export function AnimatedStatNumber({ value, duration }) {
  const display = useAnimatedNumber(value, { duration });
  const controls = useAnimation();
  const prevRef = useRef(value);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === value) return;
    prevRef.current = value;
    const up = value > prev;
    const down = value < prev;
    controls.start({
      y: up ? [0, -3, 0] : down ? [0, 3, 0] : 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    });
  }, [value, controls]);

  return (
    <motion.span
      animate={controls}
      style={{
        display: "inline-block",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {display}
    </motion.span>
  );
}
