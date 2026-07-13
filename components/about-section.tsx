import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/reveal";

export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-canvas about-section__grid">
        <div className="about-section__visual">
          <p className="eyebrow">[ About ]</p>
          <p className="about-section__kicker">Why Choose Me</p>
          <div className="about-section__portrait-stack">
            <span aria-hidden="true" className="about-section__portrait-layer" />
            <MediaPlaceholder
              className="about-section__portrait"
              description="Future portrait illustration of Ananya Mehrotra"
              kind="image"
              label="PORTRAIT IMAGE"
            />
          </div>
        </div>
        <Reveal className="about-section__content">
          <h2 id="about-title">Hi, I&apos;m Ananya Mehrotra</h2>
          <h3>Communication Designer</h3>
          <p className="about-section__copy">
            who blends logic with creativity to craft minimal, thoughtful work,
            with a strong foundation in typography, branding, and digital design.
            I enjoy building visual systems that feel clear, intentional, and
            emotionally resonant, bringing a calm, research-first mindset to
            every design challenge and a love for creating work that fosters
            clarity and connection.
          </p>
          <span className="button button--dark" aria-hidden="true">
            Learn More
          </span>
        </Reveal>
      </div>
    </section>
  );
}
