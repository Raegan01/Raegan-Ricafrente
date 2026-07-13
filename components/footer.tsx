import { socials } from "@/data/site-content";

export function Footer() {
  return (
    <footer className="site-footer" id="contact" aria-labelledby="contact-title">
      <div className="section-canvas site-footer__grid">
        <div>
          <h2 id="contact-title">
            Let&apos;s create something
            <span>awesome together.</span>
          </h2>
          <a className="site-footer__email" href="mailto:ananya.dezign@gmail.com">
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
        <div className="site-footer__aside">
          <a className="button button--dark" href="mailto:ananya.dezign@gmail.com">
            Contact Me
          </a>
          <nav aria-label="Footer">
            <p>Sitemap</p>
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <span className="site-footer__mark" aria-hidden="true">
          a.
        </span>
      </div>
      <small>© 2026 Ananya Mehrotra. All rights reserved.</small>
    </footer>
  );
}
