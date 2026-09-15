import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";

describe("LandingPage", () => {
  it("presents Raegan Ricafrente as the portfolio identity", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("link", { name: "Raegan Ricafrente — Home" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hi, I'm Raegan Ricafrente")).toBeInTheDocument();
    expect(
      screen.getByText("© 2026 Raegan Ricafrente. All rights reserved."),
    ).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/Ananya\s+Mehrotra/);
  });

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

  it("renders the seamless ticker and preserves the lower-page contract", () => {
    render(<LandingPage />);

    const ticker = screen.getByRole("group", {
      name: /design disciplines/i,
    });
    expect(
      within(ticker)
        .getAllByRole("listitem")
        .map((item) => item.textContent)
        .slice(0, 5),
    ).toEqual([
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Figma",
      "Canva",
      "Brand Identity",
    ]);
    expect(ticker.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText("Hi, I'm Raegan Ricafrente")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /let's create something/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "https://drive.google.com/file/d/11K_3589ND9PMwjK7l9KISZU0cQNubEe3/view?usp=sharing",
    );
    expect(screen.getByRole("button", { name: /say hello/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("renders the recorded four-project composition without inner links", () => {
    render(<LandingPage />);
    const section = screen.getByRole("region", { name: /selected projects/i });
    const cards = within(section).getAllByRole("article");
    expect(cards).toHaveLength(4);
    expect(
      cards.map(
        (card) => within(card).getByRole("heading", { level: 3 }).textContent,
      ),
    ).toEqual([
      "Brand Identity",
      "Product Ads",
      "Poster Design",
      "Commissions",
    ]);
    expect(within(section).queryByRole("link")).not.toBeInTheDocument();
    expect(within(section).getByRole("button", { name: "Expand Brand Identity designs" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Hi, I'm Raegan Ricafrente")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /say hello/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands the three brand boards inline and collapses with Escape", () => {
    render(<LandingPage />);
    const toggle = screen.getByRole("button", { name: "Expand Brand Identity designs" });
    expect(screen.queryByRole("region", { name: "Brand Identity designs" })).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const gallery = screen.getByRole("region", { name: "Brand Identity designs" });
    expect(within(gallery).getAllByRole("img")).toHaveLength(3);
    expect(within(gallery).getByText("FUR Bites")).toBeInTheDocument();
    expect(within(gallery).getByText("Phoebe’s")).toBeInTheDocument();
    expect(within(gallery).getByText("FinFin Ramen")).toBeInTheDocument();
    fireEvent.keyDown(toggle, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region", { name: "Brand Identity designs" })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
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

  it("shows only Upwork, OnlineJobs, and LinkedIn in the footer", () => {
    render(<LandingPage />);
    const socialLinks = within(screen.getByRole("list", { name: "Social links" }));
    expect(socialLinks.getAllByRole("link").map(link => link.getAttribute("aria-label"))).toEqual([
      "Upwork", "OnlineJobs", "LinkedIn",
    ]);
  });

  it("uses the visible email address as the mail target", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("link", { name: /rae\.ricafrente01@gmail\.com/i }),
    ).toHaveAttribute("href", "mailto:rae.ricafrente01@gmail.com");
  });

  it("keeps the external resume link and offers an inline contact action", () => {
    render(<LandingPage />);

    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "https://drive.google.com/file/d/11K_3589ND9PMwjK7l9KISZU0cQNubEe3/view?usp=sharing",
    );
    expect(screen.getByRole("button", { name: /say hello/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: /contact me/i })).toHaveAttribute(
      "aria-expanded",
      "false",
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
    expect(
      within(screen.getByRole("group", { name: /design disciplines/i }))
        .getAllByRole("listitem")
        .filter((item) => item.textContent === "Layout"),
    ).toHaveLength(1);
    expect(screen.getByTestId("cursor-trail")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(
      screen.getByTestId("cursor-trail").querySelectorAll(".cursor-trail__segment"),
    ).toHaveLength(18);
  });
});
