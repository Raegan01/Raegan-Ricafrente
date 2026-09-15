import { expect, test } from "@playwright/test";

test("desktop menu follows the centered reference composition", async ({ page }) => {
  await page.setViewportSize({ width: 2538, height: 1261 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toHaveCSS("transform", "none");
  const header = (await dialog.locator(".menu-overlay__header").boundingBox())!;
  expect(header.x).toBeCloseTo(609, 0);
  expect(header.width).toBeCloseTo(1320, 0);
  const contact = (await dialog.locator(".menu-overlay__contact").boundingBox())!;
  expect(contact.x).toBeCloseTo(header.x, 0);
  const nav = (await dialog.getByRole("navigation").boundingBox())!;
  expect(nav.x + nav.width).toBeCloseTo(header.x + header.width, 0);
  const icons = dialog.getByRole("list", { name: "Menu social links" });
  await expect(icons.getByRole("link")).toHaveCount(3);
  for (const name of ["Upwork", "OnlineJobs", "LinkedIn"]) {
    await expect(icons.getByRole("link", { name })).toBeVisible();
    await expect(icons.getByRole("link", { name }).locator("img")).toBeVisible();
  }
  await expect(dialog.getByRole("link", { name: "rae.ricafrente01@gmail.com" })).toHaveAttribute("href", "mailto:rae.ricafrente01@gmail.com");
  const socialBox = (await icons.boundingBox())!;
  expect(socialBox.y).toBeGreaterThan(nav.y + nav.height + 100);
  expect(socialBox.y).toBeLessThan(800);
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toBeHidden();
});

test("mobile menu keeps contact, navigation, and social controls usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link", { name: "Upwork" })).toBeInViewport();
  await expect(dialog.getByRole("link", { name: "View Resume" })).toBeInViewport();
  await expect(dialog.getByRole("navigation").getByRole("link")).toHaveText(["Home", "Projects", "About", "Contact"]);
  await dialog.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
