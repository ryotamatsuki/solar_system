import { expect, test } from "@playwright/test";

async function canvasHasSignal(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector("#scene");
    const probe = document.createElement("canvas");
    const width = 160;
    const height = 100;
    probe.width = width;
    probe.height = height;
    const ctx = probe.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(canvas, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    let lit = 0;
    let varied = 0;
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r + g + b > 36) lit += 1;
      if (Math.max(r, g, b) - Math.min(r, g, b) > 8) varied += 1;
    }
    return { lit, varied };
  });
}

test("renders a nonblank solar system and usable side panels", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForFunction(() => window.__solarSystemReady === true);
  await expect(page.locator("#scene")).toBeVisible();
  await expect(page.locator(".left-panel")).toBeVisible();
  await expect(page.locator(".right-panel")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("solar-system.png"), fullPage: true });

  const signal = await canvasHasSignal(page);
  expect(signal.lit).toBeGreaterThan(90);
  expect(signal.varied).toBeGreaterThan(35);

  await page.locator("#body-select").selectOption("jupiter");
  await expect(page.locator("#selected-name")).toHaveText("木星");

  await page.locator('[data-control="orbitScale"]').fill("1.45");
  const after = await canvasHasSignal(page);
  expect(after.lit).toBeGreaterThan(90);
});
