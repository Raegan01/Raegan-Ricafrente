"use client";

import { motion, useReducedMotion } from "motion/react";
import { disciplines } from "@/data/site-content";

export function DisciplineTicker() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="discipline-ticker">
      <motion.ul
        animate={reducedMotion ? undefined : { x: [0, -220] }}
        aria-label="Design disciplines"
        className="discipline-list"
        data-clone={disciplines.join("  ·  ")}
        transition={
          reducedMotion
            ? undefined
            : { duration: 18, ease: "linear", repeat: Number.POSITIVE_INFINITY }
        }
      >
        {disciplines.map((discipline) => (
          <li key={discipline}>{discipline}</li>
        ))}
      </motion.ul>
    </div>
  );
}
