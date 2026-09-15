import type { RefObject } from "react";

type ContactInquiryProps = {
  open: boolean;
  panelRef: RefObject<HTMLElement | null>;
};

export function ContactInquiry({ open, panelRef }: ContactInquiryProps) {
  return (
    <section
      className="contact-inquiry"
      id="contact-inquiry"
      aria-labelledby="contact-inquiry-title"
      hidden={!open}
      ref={panelRef}
      tabIndex={-1}
    >
      <p className="eyebrow">[ Contact ]</p>
      <h2 id="contact-inquiry-title">
        Have a project in mind?
        <span>Let&apos;s Work Together!</span>
      </h2>
      <div className="contact-inquiry__layout">
        <form className="contact-inquiry__form" onSubmit={(event) => event.preventDefault()}>
          <label className="contact-inquiry__field">
            <span>Name</span>
            <input name="name" autoComplete="name" placeholder="Jane Smith" />
          </label>
          <div className="contact-inquiry__pair">
            <label className="contact-inquiry__field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
            </label>
            <label className="contact-inquiry__field">
              <span>Phone Number</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="+63 912 345 6789" />
            </label>
          </div>
          <label className="contact-inquiry__field">
            <span>Services</span>
            <select name="service" defaultValue="">
              <option value="" disabled>Select service...</option>
              <option>Brand Identity</option>
              <option>Product Ads</option>
              <option>Poster Design</option>
              <option>Custom Projects</option>
            </select>
          </label>
          <label className="contact-inquiry__field">
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Tell me about your project, ideas, or any special requests..."
            />
          </label>
          <button className="contact-inquiry__submit" type="submit" disabled aria-describedby="contact-inquiry-note">
            Submit
          </button>
          <p className="contact-inquiry__note" id="contact-inquiry-note">
            Design preview — email sending is not connected yet.
          </p>
        </form>
        <aside className="contact-inquiry__email" aria-label="Email contact">
          <p>Email</p>
          <a href="mailto:rae.ricafrente01@gmail.com">rae.ricafrente01@gmail.com</a>
        </aside>
      </div>
    </section>
  );
}
