"use client";

import { useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { MenuOverlay } from "@/components/menu-overlay";

export function Header() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__brand" href="#home" aria-label="Ananya Mehrotra — Home">
            <BrandMark className="site-header__mark" />
            <span>
              Ananya
              <br />
              Mehrotra
            </span>
          </a>
          <button
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label="Open menu"
            className="site-header__menu-button"
            onClick={() => setOpen(true)}
            ref={triggerRef}
            type="button"
          >
            <span aria-hidden="true" />
            MENU
          </button>
        </div>
      </header>
      {open ? <MenuOverlay onClose={closeMenu} /> : null}
    </>
  );
}
