import { expect, test, type Page } from "@playwright/test";

async function openPhone(page: Page, theme: "dark" | "light") {
  await page.addInitScript((appearance) => {
    sessionStorage.setItem("ps-os-boot", "seen");
    sessionStorage.setItem("ps-workspace-unlocked", "true");
    localStorage.setItem("ps-theme", appearance);
  }, theme);
  await page.goto("/");
  await expect(page.locator(".proximus-os")).toHaveAttribute("data-ready", "true");
}

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  for (const theme of ["dark", "light"] as const) {
    test(`${viewport.width}px ${theme} phone scrolls above its dock with a stationary wallpaper`, async ({ page, browserName }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.setViewportSize(viewport);
      await openPhone(page, theme);
      const home = page.locator(".phone-home");
      const dock = page.getByRole("navigation", { name: "Phone navigation" });
      const wallpaper = page.locator(".os-home-wallpaper");
      const wallpaperBefore = await wallpaper.boundingBox();
      const dockBefore = await dock.boundingBox();

      await home.evaluate((element) => { element.scrollTop = element.scrollHeight; });
      const appearance = page.getByRole("button", { name: "Change phone appearance" });
      await expect(appearance).toBeInViewport({ ratio: 1 });
      const widget = await appearance.boundingBox();
      const scrollArea = await home.boundingBox();
      expect(widget!.y + widget!.height).toBeLessThanOrEqual(scrollArea!.y + scrollArea!.height + 1);
      expect(scrollArea!.y + scrollArea!.height).toBeLessThan(dockBefore!.y);
      expect(await wallpaper.boundingBox()).toEqual(wallpaperBefore);
      expect(await dock.boundingBox()).toEqual(dockBefore);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      const scroll = await home.evaluate((element) => ({
        top: element.scrollTop,
        maximum: element.scrollHeight - element.clientHeight,
      }));
      expect(scroll.top).toBeCloseTo(scroll.maximum, 0);

      // Wheel input is unavailable in Playwright's mobile WebKit implementation.
      if (browserName === "chromium") {
        await page.mouse.move(viewport.width / 2, scrollArea!.y + scrollArea!.height / 2);
        await page.mouse.wheel(0, 400);
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      }
      await home.evaluate((element) => { element.scrollTop = 0; });
      if (browserName === "chromium") await page.mouse.wheel(0, -400);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      expect(await wallpaper.boundingBox()).toEqual(wallpaperBefore);

      const gap = await page.evaluate(() => {
        const search = document.querySelector(".phone-home__search")!.getBoundingClientRect();
        const agenda = document.querySelector(".phone-agenda")!.getBoundingClientRect();
        return agenda.top - search.bottom;
      });
      expect(gap).toBeLessThanOrEqual(45);
      await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /viewport-fit=cover/);
      await page.screenshot({ path: info.outputPath("phone-home.png") });

      await dock.getByRole("button", { name: "Settings", exact: true }).click();
      const settings = page.locator(".os-window--settings");
      await expect(settings).toBeVisible();
      const appBox = await settings.boundingBox();
      expect(appBox!.y).toBeGreaterThanOrEqual(0);
      expect(appBox!.y + appBox!.height).toBeLessThan(dockBefore!.y);
      await dock.getByRole("button", { name: "Home", exact: true }).click();

      // The final project remains reachable in the internal scroller.
      await page.getByRole("tab", { name: "Projects", exact: true }).click();
      const lastProject = page.locator(".phone-projects > button").last();
      await lastProject.scrollIntoViewIfNeeded();
      await expect(lastProject).toBeInViewport({ ratio: 1 });
      expect(await home.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      await lastProject.click();
      await expect(page.locator(".os-project-detail h2")).toBeVisible();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(errors).toEqual([]);
    });
  }
}

test("phone case studies keep normal document scrolling after leaving home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPhone(page, "dark");
  await page.goto("/projects/proximus-shev-portfolio");
  await expect(page.locator("h1")).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(await page.locator("body").evaluate((body) => getComputedStyle(body).overflowY)).not.toBe("hidden");
  await page.goBack();
  await expect(page.locator(".proximus-os")).toHaveAttribute("data-ready", "true");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("phone unlock and reload preserve the fixed screen and usable dock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => sessionStorage.setItem("ps-os-boot", "seen"));
  await page.goto("/");
  await page.getByRole("button", { name: "Unlock the portfolio", exact: true }).click();
  await expect(page.getByLabel("Portfolio phone lock screen")).toBeHidden();
  await page.reload();
  await expect(page.locator(".proximus-os")).toHaveAttribute("data-screen-locked", "false");
  await page.getByRole("navigation", { name: "Phone navigation" })
    .getByRole("button", { name: "Contact", exact: true }).click();
  await expect(page.locator(".os-window--contact")).toBeVisible();
  const window = await page.locator(".os-window--contact").boundingBox();
  const dock = await page.locator(".phone-dock").boundingBox();
  expect(window!.y + window!.height).toBeLessThan(dock!.y);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
