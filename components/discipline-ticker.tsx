"use client";

import { motion, useReducedMotion } from "motion/react";

const displayOrder = [
  "Spatial / Exhibition Design",
  "Layout",
  "Branding",
  "3D",
  "Publication",
  "Packaging",
  "Motion Graphics",
  "Typography",
] as const;

export function DisciplineTicker() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-label="Design disciplines"
      className="discipline-ticker"
      role="group"
    >
      <motion.div
        animate={reducedMotion ? { x: "0%" } : { x: ["0%", "-50%"] }}
        className="discipline-track"
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: 18,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      >
        {[false, true].map((duplicate) => (
          <ul
            aria-hidden={duplicate || undefined}
            className="discipline-list"
            key={String(duplicate)}
          >
            {displayOrder.map((discipline) => (
              <li key={discipline}>{discipline}</li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  );
}
