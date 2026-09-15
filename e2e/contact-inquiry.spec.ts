import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  for (const label of ["Say Hello!", "Contact Me", "Contact"]) {
    test(`${label} aligns the contact divider to the viewport top at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const trigger = label === "Contact"
        ? page.getByRole("navigation", { name: "Footer", exact: true }).getByRole("link", { name: label, exact: true })
        : page.getByRole("button", { name: label, exact: true });
      for (let click = 0; click < 2; click++) {
        await trigger.click();
        await expect.poll(() => page.locator("#contact-inquiry").evaluate(element =>
          Math.abs(element.getBoundingClientRect().top),
        )).toBeLessThan(2);
      }
    });
  }
}

for (const width of [2540, 1440, 390]) {
  test(`Say Hello reveals the design-only contact form at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const panel = page.getByRole("region", { name: /Have a project in mind/ });
    await expect(panel).not.toBeVisible();
    const hello = page.getByRole("button", { name: "Say Hello!" });
    await hello.click();
    await expect(hello).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((element) => {
      const about = document.querySelector("#about")!;
      return !about.contains(element) && about.nextElementSibling === element;
    })).toBe(true);
    const positions = await page.evaluate(() => {
      const rect = (selector: string) => {
        const box = document.querySelector(selector)!.getBoundingClientRect();
        return { top: box.top + scrollY, bottom: box.bottom + scrollY };
      };
      return { projects: rect("#projects"), about: rect("#about"), form: rect("#contact-inquiry"), footer: rect("#contact") };
    });
    expect(positions.about.top).toBeGreaterThanOrEqual(positions.projects.bottom - 1);
    expect(positions.form.top).toBeGreaterThanOrEqual(positions.about.bottom - 1);
    expect(positions.footer.top).toBeGreaterThanOrEqual(positions.form.bottom - 1);
    const alignment = await page.evaluate(() => {
      const left = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().left;
      return {
        heading: left("#contact-inquiry-title"),
        form: left(".contact-inquiry__form"),
        footer: left("#contact-title"),
        email: left(".site-footer__email"),
      };
    });
    if (width > 809) {
      expect(alignment.heading).toBeCloseTo(alignment.footer, 0);
      expect(alignment.form).toBeCloseTo(alignment.email, 0);
    }
    await expect(panel.getByRole("heading")).toBeInViewport();
    await panel.getByLabel("Name", { exact: true }).fill("Jane Smith");
    await panel.getByLabel("Email", { exact: true }).fill("jane@example.com");
    await panel.getByLabel("Phone Number").fill("+1 555 123 4567");
    await panel.getByLabel("Services").selectOption("Brand Identity");
    const message = panel.getByRole("textbox", { name: "Message", exact: true });
    await message.fill("I'd like a custom brand identity.\nCan we discuss my project?");
    await expect(panel.getByRole("button", { name: "Submit" })).toBeDisabled();
    await expect(panel.getByText(/email sending is not connected yet/i)).toBeVisible();
    await hello.click();
    await expect(panel.getByLabel("Name", { exact: true })).toHaveValue("Jane Smith");
    await expect(message).toHaveValue("I'd like a custom brand identity.\nCan we discuss my project?");
    await expect(panel).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const width of [1440, 390]) {
  test(`footer Contact link reveals the shared form at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const contact = page.getByRole("navigation", { name: "Footer", exact: true })
      .getByRole("link", { name: "Contact", exact: true });
    const panel = page.getByRole("region", { name: /Have a project in mind/ });
    await expect(panel).not.toBeVisible();
    await contact.click();
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("heading")).toBeInViewport();
    await panel.getByLabel("Message", { exact: true }).fill("Keep this message");
    await contact.click();
    await expect(panel.getByRole("heading")).toBeInViewport();
    await expect(panel.getByLabel("Message", { exact: true })).toHaveValue("Keep this message");
    await expect(panel).toHaveCount(1);
  });

  test(`footer Contact Me shares the About contact form at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const contact = page.getByRole("button", { name: "Contact Me", exact: true });
    const panel = page.getByRole("region", { name: /Have a project in mind/ });
    await expect(panel).not.toBeVisible();
    await contact.click();
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("heading")).toBeInViewport();
    await expect(contact).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Say Hello!" })).toHaveAttribute("aria-expanded", "true");
    await panel.getByLabel("Message", { exact: true }).fill("A custom project inquiry");
    await contact.click();
    await expect(panel.getByRole("heading")).toBeInViewport();
    await expect(panel.getByLabel("Message", { exact: true })).toHaveValue("A custom project inquiry");
    await expect(panel).toHaveCount(1);
  });
}
