"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { navigation, resumeHref, socials } from "@/data/site-content";

type MenuOverlayProps = {
  onClose: () => void;
};

export function MenuOverlay({ onClose }: MenuOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      aria-label="Site menu"
      aria-modal="true"
      className="menu-overlay"
      initial={{ opacity: 0, y: -24 }}
      ref={dialogRef}
      role="dialog"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="menu-overlay__header">
        <a className="menu-overlay__brand" href="#home" onClick={onClose}>
          <BrandMark className="menu-overlay__mark" inverted />
          <span>
            Raegan
            <br />
            Ricafrente
          </span>
        </a>
        <button
          aria-label="Close menu"
          className="menu-overlay__close"
          onClick={onClose}
          ref={closeRef}
          type="button"
        >
          <X aria-hidden="true" />
          CLOSE
        </button>
      </div>

      <div className="menu-overlay__contact">
        <a href="mailto:ananya.dezign@gmail.com">ananya.dezign@gmail.com</a>
        <a className="button button--light-outline" href={resumeHref} rel="noreferrer" target="_blank">
          View Resume <span className="button__dot" aria-hidden="true" />
        </a>
      </div>

      <nav className="menu-overlay__nav" aria-label="Primary">
        {navigation.map((item) => (
          <a href={item.href} key={item.label} onClick={onClose}>
            {item.label}
          </a>
        ))}
      </nav>

      <ul className="menu-overlay__socials" aria-label="Menu social links">
        {socials.map((social) => (
          <li key={social.label}>
            <a href={social.href} rel="noreferrer" target="_blank">
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
