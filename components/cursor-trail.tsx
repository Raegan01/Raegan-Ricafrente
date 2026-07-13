"use client";

import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect } from "react";

const trailSegments = Array.from({ length: 18 }, (_, index) => index);

function CursorSegment({
  index,
  targetX,
  targetY,
}: {
  index: number;
  targetX: MotionValue<number>;
  targetY: MotionValue<number>;
}) {
  const stiffness = Math.max(54, 640 - index * 33);
  const damping = Math.max(17, 39 - index * 1.15);
  const x = useSpring(targetX, { damping, stiffness });
  const y = useSpring(targetY, { damping, stiffness });

  return (
    <motion.span
      className="cursor-trail__segment"
      data-segment-index={index}
      style={{ opacity: Math.max(0.42, 1 - index * 0.032), x, y }}
    />
  );
}

export function CursorTrail() {
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
    <span aria-hidden="true" className="cursor-trail" data-testid="cursor-trail">
      {trailSegments.map((index) => (
        <CursorSegment index={index} key={index} targetX={rawX} targetY={rawY} />
      ))}
    </span>
  );
}
