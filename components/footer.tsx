import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";
import { socials } from "@/data/site-content";

const footerSocials = socials;

type SocialLabel = (typeof footerSocials)[number]["label"];

function FooterSocialIcon({ label }: { label: SocialLabel }) {
  if (label === "Upwork") {
    return (
      <Image className="social-list__upwork-logo" src="/images/upwork-logo.png" alt="" width={32} height={32} />
    );
  }

  if (label === "OnlineJobs") {
    return (
      <Image className="social-list__onlinejobs-logo" src="/images/onlinejobs-logo.png" alt="" width={32} height={32} />
    );
  }

  if (label === "LinkedIn") {
    return (
      <Image className="social-list__linkedin-logo" src="/images/linkedin-logo.png" alt="" width={32} height={32} />
    );
  }

  return null;
}

export function Footer({ contactOpen, onContact }: {
  contactOpen: boolean;
  onContact: () => void;
}) {
  return (
    <footer className="site-footer" id="contact" aria-labelledby="contact-title">
      <div className="section-canvas site-footer__grid">
        <div className="site-footer__lead">
          <h2 id="contact-title">
            Let&apos;s create something
            <span>awesome together.</span>
          </h2>
          <a className="site-footer__email" href="mailto:rae.ricafrente01@gmail.com">
            rae.ricafrente01@gmail.com
          </a>
          <ul className="social-list" aria-label="Social links">
            {footerSocials.map((social) => (
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
          <button
            className="button button--dark"
            type="button"
            aria-expanded={contactOpen}
            aria-controls="contact-inquiry"
            onClick={onContact}
          >
            Contact Me
          </button>
          <nav aria-label="Footer">
            <p>Sitemap</p>
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a
              href="#contact-inquiry"
              aria-controls="contact-inquiry"
              aria-expanded={contactOpen}
              onClick={(event) => {
                event.preventDefault();
                onContact();
              }}
            >
              Contact
            </a>
          </nav>
        </div>
        <BrandMark className="site-footer__mark" />
      </div>
      <small>© 2026 Raegan Ricafrente. All rights reserved.</small>
    </footer>
  );
}
