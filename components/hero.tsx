import { DisciplineTicker } from "@/components/discipline-ticker";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <div className="hero-stage">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero__availability">[ Available for project ]</div>
        <div className="hero__main">
          <h1 id="hero-title">Design is my favorite way to overthink</h1>
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
      </section>
    </div>
  );
}
