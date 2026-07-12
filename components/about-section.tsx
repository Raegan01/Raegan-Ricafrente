import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/reveal";

export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <p className="eyebrow">[ About ]</p>
      <div className="about-section__grid">
        <MediaPlaceholder
          className="about-section__portrait"
          description="Future portrait illustration of Ananya Mehrotra"
          kind="image"
          label="PORTRAIT IMAGE"
        />
        <Reveal className="about-section__content">
          <p className="about-section__kicker">Why Choose Me</p>
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
          <a className="button button--dark" href="#about-story">
            Learn More
          </a>
          <p className="about-section__story" id="about-story">
            Behind every simple design is deliberate overthinking—careful
            research, clear systems, and a curiosity for how visual decisions
            help people connect.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
