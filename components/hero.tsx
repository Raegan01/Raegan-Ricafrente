import { DisciplineTicker } from "@/components/discipline-ticker";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <div className="hero-stage">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__canvas">
          <div className="hero__main">
            <h1 id="hero-title">
              <span className="hero__title-line">Design is my</span>{" "}
              <span className="hero__title-line">favorite way to</span>{" "}
              <span className="hero__title-line">overthink</span>
            </h1>
            <span className="hero__copyright" aria-hidden="true">
              ©
            </span>
          </div>
          <Reveal className="hero__support">
            <p>
              If it looks simple; it&apos;s because I made it look that way
              <br />
              Scroll-Down there is a method in the mess
            </p>
          </Reveal>
          <p className="eyebrow hero__role">[ Graphic Designer ]</p>
          <DisciplineTicker />
        </div>
      </section>
    </div>
  );
}
