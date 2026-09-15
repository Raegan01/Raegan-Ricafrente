"use client";

import { useEffect, useRef, useState } from "react";
import { ContactInquiry } from "@/components/contact-inquiry";
import { AboutSection } from "@/components/about-section";
import { CursorTrail } from "@/components/cursor-trail";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { ProjectsSection } from "@/components/projects-section";

export function LandingPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const contactRef = useRef<HTMLElement>(null);

  function scrollToContact() {
    const contact = contactRef.current;
    if (!contact) return;
    contact.focus({ preventScroll: true });
    // Keep the divider visible without the global sticky-header anchor offset.
    window.scrollTo({
      top: contact.getBoundingClientRect().top + window.scrollY - 1,
      behavior: "auto",
    });
  }

  function showContact() {
    if (contactOpen) scrollToContact();
    else setContactOpen(true);
  }

  useEffect(() => {
    if (contactOpen) scrollToContact();
  }, [contactOpen]);

  return (
    <>
      <Header />
      <CursorTrail />
      <main>
        <Hero />
        <div className="landing-flow">
          <ProjectsSection />
          <AboutSection contactOpen={contactOpen} onSayHello={showContact} />
          <ContactInquiry open={contactOpen} panelRef={contactRef} />
        </div>
        <Footer contactOpen={contactOpen} onContact={showContact} />
      </main>
    </>
  );
}
