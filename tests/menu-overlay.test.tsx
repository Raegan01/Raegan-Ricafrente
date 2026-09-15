import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Header } from "@/components/header";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("Header menu", () => {
  it("opens, locks scrolling, closes with Escape, and restores focus", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const trigger = screen.getByRole("button", { name: /open menu/i });

    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: /site menu/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /raegan ricafrente/i }),
    ).toHaveAttribute("href", "#home");
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(
      screen.queryByRole("dialog", { name: /site menu/i }),
    ).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("contains only same-page navigation and closes after selection", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));

    for (const [name, href] of [
      ["Home", "#home"],
      ["Projects", "#projects"],
      ["About", "#about"],
      ["Contact", "#contact"],
    ] as const) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "https://drive.google.com/file/d/11K_3589ND9PMwjK7l9KISZU0cQNubEe3/view?usp=sharing",
    );

    const projects = screen.getByRole("link", { name: "Projects" });
    expect(projects).toHaveAttribute("href", "#projects");
    expect(screen.queryByText("Side Quests")).not.toBeInTheDocument();

    await user.click(projects);
    await waitFor(() => expect(
      screen.queryByRole("dialog", { name: /site menu/i }),
    ).not.toBeInTheDocument());
  });
});
