"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { MenuOverlay } from "@/components/menu-overlay";

export function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const projects = document.getElementById("projects");

    if (!header || !projects) {
      return;
    }

    let frame = 0;

    const updateStickyState = () => {
      frame = 0;
      const projectsTop = projects.getBoundingClientRect().top;
      const headerBottom = header.getBoundingClientRect().bottom;
      const isProjectsStuck = String(projectsTop <= headerBottom);

      if (header.dataset.projectsStuck !== isProjectsStuck) {
        header.dataset.projectsStuck = isProjectsStuck;
      }
    };

    const scheduleStickyUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateStickyState);
      }
    };

    updateStickyState();
    window.addEventListener("scroll", scheduleStickyUpdate, { passive: true });
    window.addEventListener("resize", scheduleStickyUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleStickyUpdate);
      window.removeEventListener("resize", scheduleStickyUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  };

  return (
    <>
      <header
        className="site-header"
        data-projects-stuck="false"
        ref={headerRef}
      >
        <div className="site-header__inner">
          <a className="site-header__brand" href="#home" aria-label="Ananya Mehrotra — Home">
            <BrandMark className="site-header__mark" />
            <span>
              Ananya
              <br />
              Mehrotra
            </span>
          </a>
          <p className="site-header__availability">[ Available for project ]</p>
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
