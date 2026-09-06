import { BrandMark } from "@/components/brand-mark";
import { socials } from "@/data/site-content";

type SocialLabel = (typeof socials)[number]["label"];

function FooterSocialIcon({ label }: { label: SocialLabel }) {
  if (label === "Instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect height="18" rx="5" width="18" x="3" y="3" />
        <circle cx="12" cy="12" r="4" />
        <circle className="social-list__instagram-dot" cx="17.4" cy="6.6" r="1" />
      </svg>
    );
  }

  if (label === "Behance") {
    return <span aria-hidden="true">Bē</span>;
  }

  if (label === "LinkedIn") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect height="18" rx="1" width="18" x="3" y="3" />
        <path d="M8 10v7M8 7v.01M12 17v-4.1c0-1.6 1-2.9 2.6-2.9 1.5 0 2.4 1 2.4 2.8V17M12 10v7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="7" cy="12" r="5" />
      <rect height="10" rx="1" width="3" x="14" y="7" />
      <rect height="10" rx="1" width="2" x="19" y="7" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" id="contact" aria-labelledby="contact-title">
      <div className="section-canvas site-footer__grid">
        <div className="site-footer__lead">
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
                <a
                  aria-label={social.label}
                  href={social.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FooterSocialIcon label={social.label} />
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
            <a href="#about">About</a>
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <BrandMark className="site-footer__mark" />
      </div>
      <small>© 2026 Raegan Ricafrente. All rights reserved.</small>
    </footer>
  );
}
