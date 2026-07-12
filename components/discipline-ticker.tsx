"use client";

import { motion } from "motion/react";
import { disciplines } from "@/data/site-content";

export function DisciplineTicker() {
  return (
    <div className="discipline-ticker">
      <motion.ul
        animate={{ x: [0, -220] }}
        aria-label="Design disciplines"
        className="discipline-list"
        data-clone={disciplines.join("  ·  ")}
        transition={{ duration: 18, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      >
        {disciplines.map((discipline) => (
          <li key={discipline}>{discipline}</li>
        ))}
      </motion.ul>
    </div>
  );
}
