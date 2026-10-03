// Общие токены и мелкие блоки большого промо скилла (SkillPromo2): шрифты, цвета, слова на пружине, плашки, курсор.
import React from "react";
import { loadFont as loadWide } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadUi } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, ease } from "../components";

export const wide = loadWide("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin", "cyrillic"] }).fontFamily;
export const ui = loadUi("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin", "cyrillic"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin", "cyrillic"] }).fontFamily;

export const C = {
  ink: "#0D0D16",
  cream: "#F1ECE3",
  white: "#FFFFFF",
  orange: "#FF5A1F",
  lime: "#C6F24E",
  cobalt: "#3B4BFF",
  violet: "#7B3BFF",
  pink: "#FF2E88",
  mint: "#3DEDC3",
  red: "#E5322B",
  yellow: "#FFD23F",
  grey: "#ECEDEB",
};
export const CX = 480; // центр безопасной зоны Instagram по x (120–840)

export const prog = (f: number, a: number, b: number, easing = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });
export const useSpring = (at: number, damping = 15, stiffness = 120) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, stiffness } });
};

// Слова поднимаются по одному на пружине
export const Words: React.FC<{ text: string; at: number; size: number; top: number; color?: string; plate?: string; weight?: number; gap?: number; highlight?: [string, string] }> = ({
  text, at, size, top, color = C.cream, plate, weight = 800, gap = 4, highlight,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 120, width: 720, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.28, padding: plate ? "18px 30px" : 0, borderRadius: 28, backgroundColor: plate ?? "transparent" }}>
        {text.split(" ").map((w, i) => {
          const s = spring({ frame: f - at - i * gap, fps, config: { damping: 15, stiffness: 120 } });
          const hi = highlight && w.replace(/[.,!?]/g, "") === highlight[0];
          return (
            <span key={i} style={{ fontFamily: wide, fontWeight: weight, fontSize: size, lineHeight: 1.1, letterSpacing: -size * 0.03, color: hi ? C.ink : color, backgroundColor: hi ? highlight![1] : "transparent", borderRadius: size * 0.2, padding: hi ? `0 ${size * 0.15}px` : 0, opacity: s, translate: `0 ${(1 - s) * size * 0.6}px` }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Курсор-стрелка (не точка касания) — для десктопных сцен
export const Arrow: React.FC<{ x: number; y: number; press?: number; color?: string }> = ({ x, y, press = 0, color = C.white }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 4, scale: String(1 - press * 0.15), filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))", zIndex: 60 }}>
    <path d="M4 2l15 9.5-6.5 1.2 3.8 7.2-2.6 1.4-3.8-7.3L5 19z" fill={color} stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

// Путь курсора по ключевым кадрам + «нажатие»
export const usePath = (keys: [number, number, number][], taps: number[] = []) => {
  const f = useCurrentFrame();
  const x = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: ease });
  const y = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[2]), { ...clamp, easing: ease });
  const t = taps.find((a) => f >= a - 3 && f < a + 6);
  const press = t === undefined ? 0 : interpolate(f, [t - 3, t, t + 6], [0, 1, 0], clamp);
  return { x, y, press };
};

// Стеклянная карточка
export const Glass: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 32, background: "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))", border: "1.5px solid rgba(255,255,255,0.35)", boxShadow: "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)", backdropFilter: "blur(18px)", overflow: "hidden", ...style }}>
    {children}
  </div>
);
