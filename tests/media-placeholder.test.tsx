import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaPlaceholder } from "@/components/media-placeholder";

describe("MediaPlaceholder", () => {
  it("labels a future image without pretending to be an image", () => {
    render(
      <MediaPlaceholder
        label="PROJECT IMAGE 01"
        description="Future adidas project image"
        kind="image"
      />,
    );

    const frame = screen.getByTestId("media-placeholder");
    expect(frame).toHaveAttribute("data-media-kind", "image");
    expect(frame).toHaveAttribute(
      "data-description",
      "Future adidas project image",
    );
    expect(frame).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("PROJECT IMAGE 01")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
