import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandMark } from "@/components/brand-mark";

describe("BrandMark", () => {
  it("renders the supplied geometric capital R", () => {
    const { container } = render(<BrandMark />);
    const mark = container.querySelector("svg");

    expect(mark).toHaveAttribute("data-brand-letter", "R");
    expect(mark).toHaveAttribute("data-brand-style", "geometric");
    expect(mark?.querySelector("rect")).toBeInTheDocument();
    expect(mark?.querySelector("circle")).toBeInTheDocument();
    expect(mark?.querySelector("path")).toBeInTheDocument();
  });
});
