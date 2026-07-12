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

  it("contains four projects without inner-route links", () => {
    render(<LandingPage />);
    const projects = screen.getByRole("region", { name: /selected projects/i });

    for (const name of [
      "adidas x D.O.N.",
      "Desk Mate",
      "Ragas & Rhythms",
      "Bound & Beyond",
    ]) {
      expect(within(projects).getByText(name)).toBeInTheDocument();
    }

    expect(within(projects).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("Side Quests")).not.toBeInTheDocument();
  });

  it("uses the visible email address as the mail target", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("link", { name: /ananya\.dezign@gmail\.com/i }),
    ).toHaveAttribute("href", "mailto:ananya.dezign@gmail.com");
  });
});
