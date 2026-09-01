import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.resolve(process.cwd(), "app/globals.css"), "utf8");

describe("project grid compatibility styles", () => {
  it("uses a clearly visible editorial duration for the adidas expansion", () => {
    expect(css).toMatch(/--project-hover-duration:\s*900ms;/);
    expect(css).toMatch(
      /transition:\s*grid-template-columns\s+var\(--project-hover-duration\)/,
    );
  });

  it("keeps a definite card ratio when container query units are unavailable", () => {
    expect(css).toMatch(
      /\.project-card\s*\{[\s\S]*?aspect-ratio:\s*1\.2;[^}]*height:\s*auto;/,
    );
  });

  it("gates container-unit sizing behind feature detection", () => {
    expect(css).toMatch(
      /@supports\s*\(container-type:\s*inline-size\)\s*and\s*\(height:\s*1cqw\)/,
    );
  });
});
