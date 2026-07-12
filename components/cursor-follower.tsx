"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect } from "react";

export function CursorFollower() {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { damping: 28, stiffness: 420 });
  const y = useSpring(rawY, { damping: 28, stiffness: 420 });

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      rawX.set(event.clientX - 5);
      rawY.set(event.clientY - 5);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [rawX, rawY, reducedMotion]);

  return (
    <motion.span
      aria-hidden="true"
      className="cursor-follower"
      data-testid="cursor-follower"
      style={{ x, y }}
    />
  );
}
