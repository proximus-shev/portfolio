import { expect, test, type Locator, type Page } from "@playwright/test";

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => sessionStorage.setItem("ps-os-boot", "seen"));
});

test.afterEach(async ({ page }) => { expect(runtimeErrors.get(page)).toEqual([]); });

async function home(page: Page, phone: boolean, theme = "dark") {
  await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1366, height: 768 });
  await page.addInitScript((appearance) => {
    if (!sessionStorage.getItem("ps-refinements-seeded")) {
      sessionStorage.setItem("ps-workspace-unlocked", "true");
      sessionStorage.setItem("ps-refinements-seeded", "true");
    }
    localStorage.setItem("ps-theme", appearance);
  }, theme);
  await page.goto("/");
  await expect(page.locator(".proximus-os")).toHaveAttribute("data-ready", "true");
  await page.evaluate(() => document.fonts.ready);
  return page.locator(phone ? ".phone-home .home-tagline" : ".desktop-home .home-tagline");
}

async function pauseClock(page: Page) {
  const now = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(now + 1000);
}

async function advanceToText(page: Page, locator: Locator, text: string) {
  for (let elapsed = 0; elapsed < 16; elapsed++) {
    if (await locator.textContent() === text) return;
    await page.clock.runFor(1000);
  }
  await expect(locator).toHaveText(text);
}

const catchphrases = [
  "I turn ambitious ideas into products people remember.",
  "I build products that feel as good as they work.",
  "I make every detail earn its place.",
  "I pair thoughtful design with dependable code.",
  "I build for speed, clarity, and everyday use.",
  "I deliver work I am proud to put my name on.",
];

for (const phone of [false, true]) {
  test(`${phone ? "phone" : "desktop"} types all six catchphrases without moving nearby content`, async ({ page }, info) => {
    await page.clock.install();
    const tagline = await home(page, phone);
    await pauseClock(page);
    const text = tagline.locator(".home-tagline__text");
    const anchor = page.locator(phone ? ".phone-home__search" : ".desktop-home__actions");
    const anchorBefore = await anchor.boundingBox();
    const bounds = await tagline.boundingBox();
    for (const phrase of catchphrases) {
      await advanceToText(page, text, phrase);
      expect(await tagline.boundingBox()).toEqual(bounds);
      expect(await anchor.boundingBox()).toEqual(anchorBefore);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
    await advanceToText(page, text, catchphrases[0]);
    await page.screenshot({ path: info.outputPath("catchphrase.png") });
  });

  test(`${phone ? "phone" : "desktop"} shows a complete static catchphrase with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const tagline = await home(page, phone);
    const staticText = tagline.locator('.home-tagline__reserve[data-primary="true"]');
    await expect(staticText).toBeVisible();
    await expect(staticText).toHaveText(catchphrases[0]);
    await expect(tagline.locator(".home-tagline__text")).toBeHidden();
  });
}

for (const theme of ["dark", "light"]) {
  test(`phone ${theme} search keeps its scale and the home lock button relocks the screen`, async ({ page }, info) => {
    await home(page, true, theme);
    const shell = page.locator(".proximus-os");
    const shellBefore = await shell.boundingBox();
    const scaleBefore = await page.evaluate(() => visualViewport?.scale ?? 1);
    await page.locator(".phone-home__search").click();
    const dialog = page.getByRole("dialog", { name: "Search the portfolio" });
    const input = dialog.getByRole("combobox");
    await expect(input).toBeFocused();
    expect(await input.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
    expect(await page.evaluate(() => visualViewport?.scale ?? 1)).toBe(scaleBefore);
    expect(await shell.boundingBox()).toEqual(shellBefore);
    await page.screenshot({ path: info.outputPath("search.png") });
    await input.fill("contact");
    await dialog.getByRole("option", { name: /Contact/ }).click();
    await expect(page.locator(".os-window--contact")).toBeVisible();
    await page.getByRole("navigation", { name: "Phone navigation" }).getByRole("button", { name: "Home", exact: true }).click();
    const lock = page.getByRole("button", { name: "Lock the portfolio", exact: true });
    await expect(lock).toBeInViewport({ ratio: 1 });
    const lockBox = await lock.boundingBox();
    const themeBox = await page.locator(".phone-home__theme-toggle").boundingBox();
    expect(lockBox!.x + lockBox!.width).toBeLessThan(themeBox!.x);
    await lock.click();
    await expect(page.getByLabel("Portfolio phone lock screen")).toBeVisible();
    await expect(shell).toHaveAttribute("inert", "");
    await page.reload();
    await expect(page.getByLabel("Portfolio phone lock screen")).toBeVisible();
    await page.getByRole("button", { name: "Unlock the portfolio", exact: true }).click();
    await expect(page.getByLabel("Portfolio phone lock screen")).toBeHidden();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.evaluate(() => visualViewport?.scale ?? 1)).toBe(scaleBefore);
  });
}

test("phone lock screen types six final words while keeping its prefix fixed", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.install();
  await page.goto("/");
  await expect(page.getByLabel("Portfolio phone lock screen")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await pauseClock(page);
  const prefix = page.locator('.phone-lock__tagline > span[aria-hidden="true"]');
  const word = page.locator(".phone-lock__word-text");
  const before = await prefix.boundingBox();
  for (const text of ["MATTER.", "INSPIRE.", "PERFORM.", "CONNECT.", "EMPOWER.", "LAST.", "MATTER."]) {
    await advanceToText(page, word, text);
    await expect(prefix).toHaveText("IDEAS BUILT TO ");
    expect(await prefix.boundingBox()).toEqual(before);
  }
  await page.screenshot({ path: info.outputPath("lock-word.png") });
});

test("phone lock screen shows MATTER without typing for reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator('.phone-lock__word-reserve[data-primary="true"]')).toBeVisible();
  await expect(page.locator('.phone-lock__word-reserve[data-primary="true"]')).toHaveText("MATTER.");
  await expect(page.locator(".phone-lock__word-text")).toBeHidden();
});
