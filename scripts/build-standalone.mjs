import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(root, "index.html");
const outputPath = resolve(root, "solar-system.html");

const result = await build({
  absWorkingDir: root,
  entryPoints: ["src/main.js"],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  outdir: "standalone-bundle",
  write: false,
  minify: true,
  legalComments: "none",
  logLevel: "silent",
});

const js = result.outputFiles.find((file) => file.path.endsWith(".js"))?.text;
const css = result.outputFiles.find((file) => file.path.endsWith(".css"))?.text ?? "";

if (!js) {
  throw new Error("Standalone JavaScript bundle was not generated.");
}

const sourceHtml = await readFile(htmlPath, "utf8");
const html = sourceHtml
  .replace(/\s*<script type="module" src="\/src\/main\.js"><\/script>\s*/, "\n")
  .replace(
    "</head>",
    `  <style>\n${css}\n  </style>\n  </head>`,
  )
  .replace(
    "</body>",
    `  <script>\n${js.replaceAll("</script", "<\\/script")}\n  </script>\n  </body>`,
  );

await writeFile(outputPath, html, "utf8");
console.log(`Created ${outputPath}`);
