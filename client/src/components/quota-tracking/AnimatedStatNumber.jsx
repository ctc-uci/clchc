import { motion, useAnimation } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

export function AnimatedStatNumber({ value, duration }) {
  const display = useAnimatedNumber(value, { duration });
  const controls = useAnimation();
  const prevRef = useRef(value);

  useLayoutEffect(() => {
    const prev = prevRef.current;
    if (prev === value) return;
    prevRef.current = value;
    const up = value > prev;
    const down = value < prev;
    controls.start({
      y: up ? [0, -3, 0] : down ? [0, 3, 0] : 0,
      transition: {
        duration: 0.12,
        delay: 0,
        ease: up ? "easeOut" : [0.22, 1, 0.36, 1],
      },
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
