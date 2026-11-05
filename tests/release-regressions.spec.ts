import { expect, test, type Page } from "@playwright/test";

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

async function workspace(page: Page, app = "", theme = "dark") {
  await page.addInitScript((initialTheme) => {
    sessionStorage.setItem("ps-os-boot", "seen");
    if (!sessionStorage.getItem("ps-release-seeded")) {
      sessionStorage.setItem("ps-workspace-unlocked", "true");
      sessionStorage.setItem("ps-release-seeded", "true");
    }
    if (!localStorage.getItem("ps-theme")) localStorage.setItem("ps-theme", initialTheme);
  }, theme);
  await page.goto(app ? `/?app=${app}` : "/");
  await expect(page.locator(".proximus-os")).toHaveAttribute("data-ready", "true");
}

for (const phone of [false, true]) {
  for (const theme of ["dark", "light"]) {
    test(`${phone ? "phone" : "desktop"} ${theme} portrait and saved appearance`, async ({ page }, info) => {
      await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1366, height: 768 });
      await workspace(page, "", theme);
      const avatar = page.locator(phone ? ".phone-avatar" : ".os-profile-button");
      await expect(avatar).toBeVisible();
      await expect.poll(() => avatar.locator("img").evaluate((image: HTMLImageElement) =>
        image.complete && image.naturalWidth > 0,
      )).toBe(true);
      const box = await avatar.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.width - box!.height)).toBeLessThan(1);
      await expect(avatar).toHaveText("");
      await page.screenshot({ path: info.outputPath("home.png") });
      await avatar.click();
      await expect(page.getByAltText("Portrait illustration of John Amoako Appiah")).toBeVisible();
      await page.screenshot({ path: info.outputPath("about.png") });

      const nextTheme = theme === "dark" ? "light" : "dark";
      if (phone) {
        await page.getByRole("navigation", { name: "Phone navigation" }).getByRole("button", { name: "Home", exact: true }).click();
        await page.locator(".phone-home__theme-toggle").click();
      } else {
        await page.locator(".os-topbar").getByRole("button", { name: "Toggle light and dark mode" }).click();
      }
      await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
    });
  }

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`${phone ? "phone" : "desktop"} intro completes with ${reducedMotion} motion`, async ({ page }) => {
      await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1366, height: 768 });
      await page.emulateMedia({ reducedMotion });
      await page.goto("/?intro=replay");
      await expect(page.locator(".ps-os-boot")).toBeHidden();
      await expect(page.locator("html")).toHaveAttribute("data-ps-boot", "skip");
      await page.getByRole("button", { name: phone ? "Unlock the portfolio" : "Unlock the desktop portfolio", exact: true }).click();
      await expect(page.locator(".proximus-os")).toHaveAttribute("data-screen-locked", "false");
      await expect(page.locator(phone ? "#os-home-heading" : "#os-desktop-home-heading")).toBeVisible();
    });
  }
}

test("desktop windows maximize, restore and stay within the workspace after dragging", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await workspace(page, "about");
  const window = page.locator(".os-window--about");
  const before = await window.boundingBox();
  await window.getByRole("button", { name: "Maximize About", exact: true }).click();
  await expect(window).toHaveAttribute("data-maximized", "true");
  await window.getByRole("button", { name: "Restore About", exact: true }).click();
  await expect(window).toHaveAttribute("data-maximized", "false");
  const restored = await window.boundingBox();
  expect(restored!.width).toBeCloseTo(before!.width, 0);
  const bar = await window.locator(".os-window__bar").boundingBox();
  await page.mouse.move(bar!.x + bar!.width / 2, bar!.y + bar!.height / 2);
  await page.mouse.down();
  await page.mouse.move(1430, 890, { steps: 8 });
  await page.mouse.up();
  const bounds = await page.locator(".os-workspace").boundingBox();
  const dragged = await window.boundingBox();
  expect(dragged!.x).toBeGreaterThanOrEqual(bounds!.x - 1);
  expect(dragged!.y).toBeGreaterThanOrEqual(bounds!.y - 1);
  expect(dragged!.x + dragged!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
  expect(dragged!.y + dragged!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height + 1);
});

test("explicit desktop locking disables workspace controls until unlocked", async ({ page }) => {
  await workspace(page);
  await page.getByRole("button", { name: "Lock desktop", exact: true }).click();
  await expect(page.locator(".proximus-os")).toHaveAttribute("inert", "");
  await expect(page.getByLabel("Portfolio desktop lock screen")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Portfolio desktop lock screen")).toBeVisible();
  await page.getByRole("button", { name: "Unlock the desktop portfolio" }).click();
  await expect(page.locator(".proximus-os")).not.toHaveAttribute("inert", "");
});

test("phone lock swipe opens home and browser Back restores project navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => sessionStorage.setItem("ps-os-boot", "seen"));
  await page.goto("/");
  await expect(page.getByLabel("Portfolio phone lock screen")).toBeVisible();
  await page.mouse.move(190, 420);
  await page.mouse.down();
  await page.mouse.move(190, 260, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByLabel("Portfolio phone lock screen")).toBeHidden();
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  await page.getByRole("button", { name: /Proximus Shev Portfolio/ }).click();
  await expect(page.locator(".os-project-detail h2")).toHaveText("Proximus Shev Portfolio");
  await page.goBack();
  await expect(page.locator("#os-home-heading")).toBeVisible();
});

test("focus timer state survives switching between home and an app", async ({ page }) => {
  await workspace(page);
  const focus = page.locator(".desktop-home").getByRole("region", { name: "Focus timer", exact: true });
  await focus.getByRole("button", { name: "Start focus timer" }).click();
  await expect(focus.getByRole("button", { name: "Pause focus timer" })).toBeVisible();
  await page.getByRole("button", { name: "View my work", exact: true }).click();
  await page.getByRole("button", { name: "Portfolio home", exact: true }).click();
  await expect(focus.getByRole("button", { name: "Pause focus timer" })).toBeVisible();
  await focus.getByRole("button", { name: "Reset focus timer" }).click();
  await expect(focus.getByRole("button", { name: "Start focus timer" })).toBeVisible();
});

test("short laptop home remains scrollable to its last widget", async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 540 });
  await workspace(page);
  const home = page.locator(".desktop-home");
  const featured = home.getByRole("button", { name: "Explore the build", exact: true });
  await featured.scrollIntoViewIfNeeded();
  await featured.click();
  await expect(page.locator(".os-project-detail h2")).toHaveText("Proximus Shev Portfolio");
});

test("branded wallpapers and portrait optimization are served successfully", async ({ request }) => {
  for (const theme of ["dark", "light"]) {
    const response = await request.get(`/backgrounds/home-desktop-ps-${theme}.webp`);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
    expect((await response.body()).length).toBeGreaterThan(100_000);
  }
  const image = await request.get("/_next/image?url=%2Fjohn-amoako-appiah-portrait.png&w=256&q=90");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toMatch(/^image\//);
});

test("project metadata and missing-project handling are correct", async ({ page }) => {
  await page.goto("/projects/proximus-shev-portfolio");
  await expect(page).toHaveTitle("Proximus Shev Portfolio | John Amoako Appiah");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/projects\/proximus-shev-portfolio$/);
  const missing = await page.request.get("/projects/not-a-real-project");
  expect(missing.status()).toBe(404);
});
