"use client";

import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect } from "react";

const trailSegments = Array.from({ length: 18 }, (_, index) => index);
const activeCursorClass = "cursor-trail-active";
const activeCursorQuery =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

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
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  useEffect(() => {
    const cursorMedia = window.matchMedia(activeCursorQuery);
    const root = document.documentElement;

    const move = (event: PointerEvent) => {
      rawX.set(event.clientX - 5);
      rawY.set(event.clientY - 5);
    };

    const deactivate = () => {
      window.removeEventListener("pointermove", move);
      root.classList.remove(activeCursorClass);
    };

    const updateActivation = () => {
      deactivate();
      if (!cursorMedia.matches) return;

      window.addEventListener("pointermove", move, { passive: true });
      root.classList.add(activeCursorClass);
    };

    updateActivation();
    cursorMedia.addEventListener("change", updateActivation);

    return () => {
      cursorMedia.removeEventListener("change", updateActivation);
      deactivate();
    };
  }, [rawX, rawY]);

  return (
    <span aria-hidden="true" className="cursor-trail" data-testid="cursor-trail">
      {trailSegments.map((index) => (
        <CursorSegment index={index} key={index} targetX={rawX} targetY={rawY} />
      ))}
    </span>
  );
}
