import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProjectsSection } from "@/components/projects-section";
import { projects } from "@/data/site-content";
import { projectGalleries } from "@/data/project-galleries";

it("shows every project image once and returns to the four category cards", () => {
  render(<ProjectsSection />);
  const toggle = screen.getByRole("button", { name: "See them all" });
  fireEvent.click(toggle);
  const gallery = screen.getByRole("region", { name: "All project images" });
  const designs = projects.flatMap(project => projectGalleries[project.tone]?.designs ?? []);
  expect(within(gallery).getAllByRole("img")).toHaveLength(41);
  for (const design of designs) {
    expect(within(gallery).getByRole("img", { name: design.alt })).toBeInTheDocument();
  }
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Back to projects" }));
  expect(screen.queryByRole("region", { name: "All project images" })).not.toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(4);
  expect(screen.getByRole("button", { name: "See them all" })).toHaveFocus();
});

it("resets the expanded category when opening the combined gallery", () => {
  render(<ProjectsSection />);
  fireEvent.click(screen.getByRole("button", { name: "Expand Product Ads designs" }));
  fireEvent.click(screen.getByRole("button", { name: "See them all" }));
  fireEvent.click(screen.getByRole("button", { name: "Back to projects" }));
  expect(screen.getByRole("button", { name: "Expand Product Ads designs" })).toHaveAttribute("aria-expanded", "false");
});
