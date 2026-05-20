import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

try {
  for (const fileName of ["index.html", "solar-system.html"]) {
    await page.goto(pathToFileURL(`${process.cwd()}/${fileName}`).href);
    await page.waitForFunction(() => window.__solarSystemReady === true);
    await page.click('[data-camera-step="left"]');
    await page.click("#reset-view");
    await page.selectOption("#body-select", "jupiter");
    await page.waitForFunction(() => document.querySelector("#selected-name")?.textContent === "木星");

    const signal = await page.evaluate(() => {
      const canvas = document.querySelector("#scene");
      const probe = document.createElement("canvas");
      probe.width = 160;
      probe.height = 100;
      const ctx = probe.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(canvas, 0, 0, 160, 100);
      const { data } = ctx.getImageData(0, 0, 160, 100);
      let lit = 0;
      let varied = 0;
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r + g + b > 36) lit += 1;
        if (Math.max(r, g, b) - Math.min(r, g, b) > 8) varied += 1;
      }
      return {
        lit,
        varied,
        heading: document.querySelector("h1")?.textContent ?? "",
        selected: document.querySelector("#selected-name")?.textContent ?? "",
        brief: document.querySelector("#body-brief")?.textContent ?? "",
        references: document.querySelectorAll("#body-references a").length,
      };
    });

    console.log(JSON.stringify({ fileName, ...signal }));
    if (
      signal.lit <= 90 ||
      signal.varied <= 35 ||
      signal.heading !== "太陽系" ||
      signal.selected !== "木星" ||
      !signal.brief.includes("ガス巨大惑星") ||
      signal.references < 1
    ) {
      process.exitCode = 1;
    }
  }
} finally {
  await browser.close();
}
