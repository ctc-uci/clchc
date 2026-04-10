import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./loading.css";

const DOTS = 16;
const Rx = 165;
const Ry = 30;
const SPEED = (2 * Math.PI) / 4000; //4 seconds

export function LoadingScreen() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animId;
    let prevTime;

    const step = (time) => {
      if (prevTime !== undefined) {
        setOffset((o) => (o - (time - prevTime) * SPEED + 2 * Math.PI) % (2 * Math.PI));
      }
      prevTime = time;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.section
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <figure className="ring-container">
        {Array.from({ length: DOTS }).map((_, i) => {
          const angle = (2 * Math.PI * i) / DOTS - Math.PI / 2 + offset;
          const x = Math.cos(angle) * Rx;
          const y = Math.sin(angle) * Ry;
          const brightness = (Math.sin(angle) + 1) / 2;
          const opacity = 0.1 + brightness * 0.9;
          return (
            <span
              key={i}
              className="dot-wrap"
              style={{
                "--x": `${x}px`,
                "--y": `${y}px`,
                opacity,
              }}
            >
              <span
                className="dot"
                style={{
                  transform: `scaleX(${Math.max(0.05, Math.abs(Math.sin(angle))).toFixed(3)})`,
                }}
              />
            </span>
          );
        })}
      </figure>
      <span className="loading-label">Loading...</span>
    </motion.section>
  );
}
