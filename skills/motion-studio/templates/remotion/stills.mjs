// Кадры для проверки глазами: node scripts/stills.mjs <точка входа> <композиция> <папка> <кадр> [кадр…]
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
const [entry, id, out, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve(entry) });
const browser = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
for (const fr of frames.map(Number)) await renderStill({ serveUrl, composition, frame: fr, scale: 0.25, puppeteerInstance: browser, output: `${out}/f_${String(fr).padStart(4, "0")}.png` });
await browser.close({ silent: true });
