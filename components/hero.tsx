import { disciplines } from "@/data/site-content";

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__availability">[ Available for project ]</div>
      <div className="hero__main">
        <h1 id="hero-title">Design is my favorite way to overthink</h1>
        <span className="hero__copyright" aria-hidden="true">
          ©
        </span>
      </div>
      <div className="hero__support">
        <p>
          If it looks simple; it&apos;s because I made it look that way
          <br />
          Scroll-Down there is a method in the mess
        </p>
      </div>
      <p className="eyebrow hero__role">[ Graphic Designer ]</p>
      <ul className="discipline-list" aria-label="Design disciplines">
        {disciplines.map((discipline) => (
          <li key={discipline}>{discipline}</li>
        ))}
      </ul>
    </section>
  );
}
