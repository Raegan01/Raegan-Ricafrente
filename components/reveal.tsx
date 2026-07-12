"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={`reveal ${className}`.trim()}
      initial={false}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.25, once: true }}
      whileInView={{ y: 0 }}
    >
      {children}
    </motion.div>
  );
}
