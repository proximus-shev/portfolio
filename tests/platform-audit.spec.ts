import { expect, test, type Page } from "@playwright/test";

const projects = [
  "ai-study-assistant",
  "finance-dashboard",
  "appointment-booking-app",
  "mini-ecommerce-store",
  "python-ai-document-analyzer",
  "proximus-shev-portfolio",
] as const;

const viewports = [
  { name: "desktop-xl", width: 1920, height: 1080 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "compact-laptop", width: 1280, height: 720 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "short-desktop", width: 960, height: 540 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "phone", width: 390, height: 844 },
] as const;

async function prepareSession(
  page: Page,
  options: { unlocked?: boolean; theme?: "light" | "dark" } = {},
) {
  await page.addInitScript(({ unlocked, theme }) => {
    window.sessionStorage.setItem("ps-os-boot", "seen");
    if (unlocked === true)
      window.sessionStorage.setItem("ps-workspace-unlocked", "true");
    else if (unlocked === false)
      window.sessionStorage.removeItem("ps-workspace-unlocked");
    if (theme) window.localStorage.setItem("ps-theme", theme);
  }, options);
}

function watchRuntime(page: Page) {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  return failures;
}

for (const viewport of viewports) {
  for (const theme of ["dark", "light"] as const) {
    test(`${viewport.name} ${theme} home has no page overflow`, async ({ page }) => {
      const failures = watchRuntime(page);
      await page.setViewportSize(viewport);
      await prepareSession(page, { unlocked: true, theme });
      await page.goto("/");

      await expect(page.locator(".proximus-os")).toHaveAttribute("data-ready", "true");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      if (viewport.width < 768) {
        await expect(page.getByRole("heading", { name: /I.m John/ })).toBeVisible();
      } else {
        await expect(page.locator("#os-desktop-home-heading")).toBeVisible();
      }

      const overflow = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        body: document.body.scrollWidth - document.body.clientWidth,
      }));
      expect(overflow.document).toBeLessThanOrEqual(1);
      expect(overflow.body).toBeLessThanOrEqual(1);
      expect(failures).toEqual([]);
    });
  }
}

test("desktop lock screen unlocks and remains unlocked after reload", async ({ page }) => {
  const failures = watchRuntime(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await prepareSession(page);
  await page.goto("/");

  await expect(page.getByLabel("Portfolio desktop lock screen")).toBeVisible();
  await page.getByRole("button", { name: "Unlock the desktop portfolio" }).click();
  await expect(page.getByLabel("Portfolio desktop lock screen")).toBeHidden();
  await expect(page.locator("#os-desktop-home-heading")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Portfolio desktop lock screen")).toBeHidden();
  await expect(page.locator("#os-desktop-home-heading")).toBeVisible();
  expect(failures).toEqual([]);
});

test("direct project state and browser history restore correctly", async ({ page }) => {
  const failures = watchRuntime(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await prepareSession(page, { unlocked: true, theme: "dark" });
  await page.goto("/?app=projects&project=ai-study-assistant");

  await expect(page.locator(".os-project-detail h2")).toHaveText("AI Study Assistant");
  await page.getByRole("button", { name: "All projects" }).click();
  await expect(page.locator(".os-project-directory")).toBeVisible();
  await expect(page).toHaveURL(/\?app=projects$/);

  await page.goBack();
  await expect(page.locator(".os-project-detail h2")).toHaveText("AI Study Assistant");
  await expect(page).toHaveURL(/project=ai-study-assistant/);
  expect(failures).toEqual([]);
});

test("a minimized app remains available from the desktop dock", async ({ page }) => {
  const failures = watchRuntime(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await prepareSession(page, { unlocked: true });
  await page.goto("/?app=resume");

  await expect(page.locator(".os-window--resume")).toBeVisible();
  await page.getByRole("button", { name: "Minimize Resume" }).click();
  const restore = page.getByRole("button", { name: "Restore Resume" });
  await expect(restore).toBeVisible();
  await restore.click();
  await expect(page.locator(".os-window--resume")).toBeVisible();
  expect(failures).toEqual([]);
});

test("command search launches a portfolio app", async ({ page }) => {
  const failures = watchRuntime(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await prepareSession(page, { unlocked: true });
  await page.goto("/");

  await expect(page.locator(".proximus-os")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".proximus-os")).toHaveAttribute("data-screen-locked", "false");
  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog", { name: "Search the portfolio" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("combobox").fill("contact");
  await dialog.getByRole("option", { name: /Contact/ }).click();
  await expect(page.locator(".os-window--contact")).toBeVisible();
  await expect(page).toHaveURL(/\?app=contact/);
  expect(failures).toEqual([]);
});

test("John's portrait appears in the profile controls and About app", async ({ page }) => {
  const failures = watchRuntime(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await prepareSession(page, { unlocked: true });
  await page.goto("/?app=about");

  await expect(page.locator(".os-profile-button__image")).toBeVisible();
  const portrait = page.getByAltText("Portrait illustration of John Amoako Appiah");
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveJSProperty("complete", true);
  expect(failures).toEqual([]);
});

test("phone unlock and project navigation work", async ({ page }) => {
  const failures = watchRuntime(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await prepareSession(page);
  await page.goto("/");

  await expect(page.getByLabel("Portfolio phone lock screen")).toBeVisible();
  await page.getByRole("button", { name: "Unlock the portfolio" }).click();
  await expect(page.getByLabel("Portfolio phone lock screen")).toBeHidden();
  await page.getByRole("tab", { name: "Projects" }).click();
  await page.getByRole("button", { name: /Proximus Shev Portfolio/ }).click();
  await expect(page.locator(".os-project-detail h2")).toHaveText("Proximus Shev Portfolio");
  await expect(page).toHaveURL(/app=projects.*project=proximus-shev-portfolio/);
  expect(failures).toEqual([]);
});

for (const slug of projects) {
  test(`project route ${slug} renders without runtime errors`, async ({ page }) => {
    const failures = watchRuntime(page);
    await page.goto(`/projects/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    expect(failures).toEqual([]);
  });
}

test("project index and crawler routes respond successfully", async ({ page, request }) => {
  const failures = watchRuntime(page);
  await page.goto("/projects");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ideas");
  await expect(page.locator("[aria-label='Project directory'] a")).toHaveCount(projects.length);

  for (const route of ["/robots.txt", "/sitemap.xml", "/opengraph-image"]) {
    const response = await request.get(route);
    expect(response.ok(), `${route} should respond successfully`).toBeTruthy();
  }
  expect(failures).toEqual([]);
});
