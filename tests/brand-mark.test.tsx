import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandMark } from "@/components/brand-mark";

describe("BrandMark", () => {
  it("identifies the portfolio monogram as a capital R", () => {
    const { container } = render(<BrandMark />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "data-brand-letter",
      "R",
    );
  });
});
