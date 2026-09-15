"use client";

import { Reveal } from "@/components/reveal";
import { resumeHref } from "@/data/site-content";

export function CtaPrelude({ contactOpen, onSayHello }: {
  contactOpen: boolean;
  onSayHello: () => void;
}) {
  return (
    <section className="cta-prelude" aria-labelledby="cta-prelude-title">
      <Reveal className="cta-prelude__inner">
        <h2 id="cta-prelude-title">
          Every design starts with a
          <br />
          thought worth exploring
        </h2>
        <p>Let&apos;s talk and create something unforgettable.</p>
        <div className="cta-prelude__actions">
          <a className="button" href={resumeHref} rel="noreferrer" target="_blank">
            View Resume <span className="button__dot" aria-hidden="true" />
          </a>
          <button
            className="button button--dark"
            type="button"
            aria-expanded={contactOpen}
            aria-controls="contact-inquiry"
            onClick={onSayHello}
          >
            Say Hello!
          </button>
        </div>
      </Reveal>
    </section>
  );
}
