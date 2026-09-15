"use client";

import Image from "next/image";

import { CtaPrelude } from "@/components/cta-prelude";
import { Reveal } from "@/components/reveal";

export function AboutSection({ contactOpen, onSayHello }: {
  contactOpen: boolean;
  onSayHello: () => void;
}) {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-canvas about-section__grid">
        <div className="about-section__visual">
          <p className="eyebrow">[ About ]</p>
          <p className="about-section__kicker">Why Choose Me</p>
          <div className="about-section__portrait-stack">
            <span aria-hidden="true" className="about-section__portrait-layer" />
            <div className="about-section__portrait">
              <Image
                alt="Portrait of Raegan Ricafrente"
                className="about-section__portrait-image"
                fill
                loading="eager"
                sizes="(max-width: 809px) 220px, 270px"
                src="/images/profile2.png"
                unoptimized
              />
            </div>
          </div>
        </div>
        <Reveal className="about-section__content">
          <h2 id="about-title">Hi, I&apos;m Raegan Ricafrente</h2>
          <h3>
            Graphic
            <br />
            Designer
          </h3>
          <p className="about-section__copy">
            who creates clean, engaging visuals with a strong focus on layout,
            typography, branding, and digital design. I enjoy turning ideas into
            clear and polished visual systems, from brand identities and poster
            designs to product ads and social creatives. My approach is thoughtful,
            detail-focused, and driven by making every design feel purposeful,
            consistent, and visually strong.
          </p>
        </Reveal>
      </div>
      <CtaPrelude
        contactOpen={contactOpen}
        onSayHello={onSayHello}
      />
    </section>
  );
}
