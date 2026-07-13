import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";

describe("LandingPage", () => {
  it("renders the approved single-page sections and copy", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /design is my favorite way to overthink/i,
      }),
    ).toBeInTheDocument();
    expect(document.querySelector("#home")).toBeInTheDocument();
    expect(document.querySelector("#about")).toBeInTheDocument();
    expect(document.querySelector("#projects")).toBeInTheDocument();
    expect(document.querySelector("#contact")).toBeInTheDocument();
  });

  it("renders the recorded three-project composition without inner links", () => {
    render(<LandingPage />);
    const section = screen.getByRole("region", { name: /selected projects/i });

    expect(within(section).getAllByRole("article")).toHaveLength(3);
    expect(within(section).getByText("Desk Mate")).toBeInTheDocument();
    expect(within(section).getByText("Ragas & Rhythms")).toBeInTheDocument();
    expect(within(section).getByText("Bound & Beyond")).toBeInTheDocument();
    expect(within(section).queryByText("adidas x D.O.N.")).not.toBeInTheDocument();
    expect(within(section).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("Side Quests")).not.toBeInTheDocument();

    const cards = within(section).getAllByRole("article");
    expect(cards[0]).toHaveClass("project-card--feature", "project-card--desk");
    expect(cards[1]).toHaveClass("project-card--standard", "project-card--ragas");
    expect(cards[2]).toHaveClass("project-card--standard", "project-card--bound");
    expect(
      within(cards[0]).getByRole("button", { name: /open desk mate project/i }),
    ).toBeDisabled();
  });

  it("orders projects, about, and contact like the recording", () => {
    render(<LandingPage />);
    const projects = document.querySelector("#projects")!;
    const about = document.querySelector("#about")!;
    const contact = document.querySelector("#contact")!;

    expect(projects.compareDocumentPosition(about)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(about.compareDocumentPosition(contact)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("uses the visible email address as the mail target", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("link", { name: /ananya\.dezign@gmail\.com/i }),
    ).toHaveAttribute("href", "mailto:ananya.dezign@gmail.com");
  });

  it("keeps the resume and email CTAs without inner-page destinations", () => {
    render(<LandingPage />);

    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      expect.stringContaining("drive.google.com"),
    );
    expect(screen.getByRole("link", { name: /say hello/i })).toHaveAttribute(
      "href",
      "mailto:ananya.dezign@gmail.com",
    );
    expect(screen.getByRole("link", { name: /contact me/i })).toHaveAttribute(
      "href",
      "mailto:ananya.dezign@gmail.com",
    );
    expect(
      screen.queryByRole("link", { name: /learn more/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Side Quests")).not.toBeInTheDocument();
  });

  it("keeps animated content represented once in the accessibility tree", () => {
    render(<LandingPage />);

    expect(
      screen.getAllByRole("heading", { name: /projects/i }),
    ).toHaveLength(1);
    expect(screen.getAllByText("Motion Graphics")).toHaveLength(1);
    expect(screen.getByTestId("cursor-trail")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(
      screen.getByTestId("cursor-trail").querySelectorAll(".cursor-trail__segment"),
    ).toHaveLength(18);
  });
});
