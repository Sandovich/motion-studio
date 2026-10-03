// Проверка текста до рендера: node scripts/qa-fit.mjs <композиция> [точка входа] [шаг, с]
// Каждые 0,5 с рендерит кадр с inputProps {qa:true}; <FitProbe /> в композиции пишет [fit]-сообщения:
// overflow-x (текст вылез из блока), off-frame (за кадр), ui-zone (под интерфейсом Instagram).
// Код выхода 1 при любой находке. Идея и зоны — saint4ai/reels-pipline-automotaj (MIT, onAI Academy, см. NOTICE).
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

const id = process.argv[2];
if (!id) {
  console.error("node scripts/qa-fit.mjs <композиция> [src/index.ts] [0.5]");
  process.exit(2);
}
const entry = path.resolve(process.argv[3] ?? "src/index.ts");
const stepSec = Number(process.argv[4] ?? 0.5);
const serveUrl = await bundle({ entryPoint: entry });
const inputProps = { qa: true };
const browser = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id, inputProps, puppeteerInstance: browser });
const step = Math.max(1, Math.round(composition.fps * stepSec));
const found = new Map();
let frames = 0;
for (let frame = 0; frame < composition.durationInFrames; frame += step) {
  frames++;
  await renderStill({
    serveUrl, composition, frame, inputProps, scale: 0.25, puppeteerInstance: browser,
    output: `out/qa/${id}-${String(frame).padStart(4, "0")}.png`,
    onBrowserLog: (log) => {
      if (!log.text.startsWith("[fit]")) return;
      const key = log.text.replace(/ кадр \d+.*$/, "");
      const prev = found.get(key);
      if (prev) prev.last = frame;
      else found.set(key, { first: frame, last: frame, text: log.text });
    },
  });
}
await browser.close({ silent: true });
const sec = (f) => (f / composition.fps).toFixed(1);
if (found.size) {
  console.log(`FIT FAIL ${id}: ${found.size} находок, проверено кадров ${frames} (шаг ${stepSec} с)`);
  for (const [, v] of found) console.log(`  ${sec(v.first)}–${sec(v.last)} с  ${v.text}`);
  process.exit(1);
}
console.log(`FIT PASS ${id}: проверено кадров ${frames}, переполнений и залезаний под интерфейс нет`);
