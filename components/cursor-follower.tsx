"use client";

import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect } from "react";

const trailSegments = Array.from({ length: 14 }, (_, index) => index);

function CursorSegment({
  index,
  targetX,
  targetY,
}: {
  index: number;
  targetX: MotionValue<number>;
  targetY: MotionValue<number>;
}) {
  const stiffness = Math.max(72, 620 - index * 40);
  const damping = Math.max(18, 38 - index * 1.4);
  const x = useSpring(targetX, { damping, stiffness });
  const y = useSpring(targetY, { damping, stiffness });

  return (
    <motion.span
      className="cursor-follower__segment"
      style={{ opacity: 1 - index * 0.035, x, y }}
    />
  );
}

export function CursorFollower() {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

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
    <span aria-hidden="true" className="cursor-follower" data-testid="cursor-follower">
      {trailSegments.map((index) => (
        <CursorSegment index={index} key={index} targetX={rawX} targetY={rawY} />
      ))}
    </span>
  );
}
