import { resumeHref, socials } from "@/data/site-content";

export function ContactSection() {
  return (
    <footer className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-section__prelude">
        <div>
          <p>Every design starts with a thought worth exploring.</p>
          <p>Let&apos;s talk and create something unforgettable.</p>
        </div>
        <p>[ Available for project ]</p>
        <div className="contact-section__actions">
          <a className="button" href={resumeHref} rel="noreferrer" target="_blank">
            View Resume
          </a>
          <a className="button button--dark" href="mailto:ananya.dezign@gmail.com">
            Say Hello!
          </a>
        </div>
      </div>

      <div className="contact-section__footer">
        <div>
          <h2 id="contact-title">Let&apos;s create something awesome together.</h2>
          <a
            className="contact-section__email"
            href="mailto:ananya.dezign@gmail.com"
          >
            ananya.dezign@gmail.com
          </a>
          <ul className="social-list" aria-label="Social links">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} rel="noreferrer" target="_blank">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer">
          <p>Sitemap</p>
          <a href="#about">About</a>
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="contact-section__mark" aria-hidden="true">
          a.
        </span>
      </div>
      <small>© 2026 Ananya Mehrotra. All rights reserved.</small>
    </footer>
  );
}
