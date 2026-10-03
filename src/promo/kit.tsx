// Общие токены и вёрстка большого промо скилла (SkillPromo2).
// СЕТКА: всё по центру кадра (x = 540); текст — колонка 600 px (x 240–840): симметрично и не под кнопками Instagram.
// Размер заголовков подбирает fitText из @remotion/layout-utils (remotion.dev/docs/layout-utils) после загрузки шрифта.
import React, { useEffect, useState } from "react";
import { loadFont as loadWide } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadUi } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { fitText } from "@remotion/layout-utils";
import { continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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
export const CX = 540; // центр кадра — всё симметрично
export const L = 240; // колонка текста
export const W = 600;

export const prog = (f: number, a: number, b: number, easing = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });
export const useSpring = (at: number, damping = 15, stiffness = 120) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, stiffness } });
};

// Размер шрифта, при котором строка ровно влезает в ширину (fitText), не больше max
export const useFit = (text: string, width: number, max: number, weight = 900, family = wide) => {
  const [size, setSize] = useState<number | null>(null);
  const [handle] = useState(() => delayRender(`fitText: ${text}`));
  useEffect(() => {
    document.fonts.load(`${weight} 100px "${family}"`).then(() => {
      const { fontSize } = fitText({ text, withinWidth: width, fontFamily: family, fontWeight: String(weight) });
      setSize(Math.min(max, Math.floor(fontSize)));
      continueRender(handle);
    });
  }, [text, width, max, weight, family, handle]);
  return size ?? max;
};

// Заголовок в одну строку по центру кадра, размер — fitText по колонке
export const Title: React.FC<{ text: string; top: number; max: number; color?: string; at?: number; width?: number; weight?: number; style?: React.CSSProperties }> = ({
  text, top, max, color = C.cream, at = 0, width = W, weight = 900, style,
}) => {
  const size = useFit(text, width, max, weight);
  const s = useSpring(at);
  return (
    <div style={{ position: "absolute", left: CX - width / 2, width, top, textAlign: "center", fontFamily: wide, fontWeight: weight, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap", opacity: s, translate: `0 ${(1 - s) * size * 0.5}px`, ...style }}>
      {text}
    </div>
  );
};

// Слова поднимаются по одному на пружине; самое длинное слово гарантированно влезает в колонку
export const Words: React.FC<{ text: string; at: number; size: number; top: number; color?: string; plate?: string; weight?: number; gap?: number; highlight?: [string, string]; width?: number }> = ({
  text, at, size, top, color = C.cream, plate, weight = 800, gap = 4, highlight, width = W,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const longest = text.split(" ").reduce((a, b) => (b.length > a.length ? b : a), "");
  const fs = useFit(longest, width - (plate ? 60 : 0), size, weight);
  return (
    <div style={{ position: "absolute", left: CX - width / 2, width, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: fs * 0.28, padding: plate ? "16px 30px" : 0, borderRadius: 28, backgroundColor: plate ?? "transparent" }}>
        {text.split(" ").map((w, i) => {
          const s = spring({ frame: f - at - i * gap, fps, config: { damping: 15, stiffness: 120 } });
          const hi = highlight && w.replace(/[.,!?]/g, "") === highlight[0];
          return (
            <span key={i} style={{ fontFamily: wide, fontWeight: weight, fontSize: fs, lineHeight: 1.12, color: hi ? C.ink : color, backgroundColor: hi ? highlight![1] : "transparent", borderRadius: fs * 0.2, padding: hi ? `0 ${fs * 0.14}px` : 0, opacity: s, translate: `0 ${(1 - s) * fs * 0.6}px` }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Курсор-стрелка — для «десктопных» сцен
export const Arrow: React.FC<{ x: number; y: number; press?: number; color?: string }> = ({ x, y, press = 0, color = C.white }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 4, scale: String(1 - press * 0.15), filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))", zIndex: 60 }}>
    <path d="M4 2l15 9.5-6.5 1.2 3.8 7.2-2.6 1.4-3.8-7.3L5 19z" fill={color} stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
export const usePath = (keys: [number, number, number][], taps: number[] = []) => {
  const f = useCurrentFrame();
  const x = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: ease });
  const y = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[2]), { ...clamp, easing: ease });
  const t = taps.find((a) => f >= a - 3 && f < a + 6);
  const press = t === undefined ? 0 : interpolate(f, [t - 3, t, t + 6], [0, 1, 0], clamp);
  return { x, y, press };
};

// Стеклянная карточка, по умолчанию — по центру кадра шириной колонки
export const Glass: React.FC<{ y: number; h: number; w?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ y, h, w = W, children, style }) => (
  <div style={{ position: "absolute", left: CX - w / 2, top: y, width: w, height: h, borderRadius: 32, background: "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))", border: "1.5px solid rgba(255,255,255,0.35)", boxShadow: "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)", overflow: "hidden", ...style }}>
    {children}
  </div>
);

// Блок по центру кадра заданной ширины (для любых составных сцен)
export const Center: React.FC<{ top: number; w?: number; h?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, w = W, h, children, style }) => (
  <div style={{ position: "absolute", left: CX - w / 2, top, width: w, height: h, ...style }}>{children}</div>
);
