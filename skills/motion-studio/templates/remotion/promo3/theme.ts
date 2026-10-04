// Шрифты и общие мелочи промо v4: у каждой главы — свой шрифт и палитра, как у оригинального рилса.
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadGeologica } from "@remotion/google-fonts/Geologica";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { loadFont as loadPTN } from "@remotion/google-fonts/PTSansNarrow";
import { loadFont as loadOnest } from "@remotion/google-fonts/Onest";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { interpolate } from "remotion";
import { clamp, ease } from "../components";

const cyr = { subsets: ["latin", "cyrillic"] as ("latin" | "cyrillic")[] };
export const F = {
  unbounded: loadUnbounded("normal", { weights: ["700", "800", "900"], ...cyr }).fontFamily, // хук, «Дубль», финал
  geologica: loadGeologica("normal", { weights: ["800", "900"], ...cyr }).fontFamily, // Grafigator
  rubik: loadRubik("normal", { weights: ["600", "700", "800", "900"], ...cyr }).fontFamily, // Dami
  narrow: loadPTN("normal", { weights: ["700"], ...cyr }).fontFamily, // табло «Дубль»
  onest: loadOnest("normal", { weights: ["500", "600", "700"], ...cyr }).fontFamily, // Ev Astapov
  playfair: loadPlayfair("normal", { weights: ["900"], ...cyr }).fontFamily, // Vox
  manrope: loadManrope("normal", { weights: ["600", "700", "800"], ...cyr }).fontFamily, // saint4ai
  mono: loadMono("normal", { weights: ["500", "700"], ...cyr }).fontFamily,
};
export const CX = 540;
export const prog = (f: number, a: number, b: number, easing = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });
// «Стоп-моушен»: время шагами (для коллажа — как вырезки, двигающиеся рывками 12 к/с)
export const step = (f: number, every = 2.5) => Math.floor(f / every) * every;
