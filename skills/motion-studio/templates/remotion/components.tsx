// Библиотека проверенных моушн-компонентов для Remotion.
// Каждый кадр вычисляется только из useCurrentFrame() — рендер детерминирован.
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Прогресс 0→1 на отрезке кадров [from, from+duration] с плавным выходом.
export const useProgress = (from: number, duration: number, easing = ease) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + duration], [0, 1], { ...clamp, easing });
};

// ── 1. Пословное проявление из размытия ────────────────────────────────
// Текущее слово чёткое, следующие серые и размытые. Отступ между словами —
// в пикселях от размера шрифта (em в flex-gap берётся от контейнера и ломается).
export const BlurWords: React.FC<{
  text: string;
  start: number; // кадр начала
  perWord: number; // кадров на слово
  size: number;
  color: string;
  muted: string;
  weight?: number;
  align?: "center" | "flex-start";
}> = ({ text, start, perWord, size, color, muted, weight = 800, align = "center" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.28, justifyContent: align }}>
      {text.split(" ").map((w, i) => {
        const t0 = start + i * perWord;
        const p = interpolate(frame, [t0, t0 + perWord], [0, 1], { ...clamp, easing: ease });
        return (
          <span
            key={i}
            style={{
              fontSize: size,
              fontWeight: weight,
              lineHeight: 1.1,
              color: p > 0.5 ? color : muted,
              opacity: interpolate(p, [0, 1], [0.35, 1]),
              filter: `blur(${interpolate(p, [0, 1], [10, 0])}px)`,
              translate: `0px ${interpolate(p, [0, 1], [18, 0])}px`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ── 2. Счётчик числа ───────────────────────────────────────────────────
// Значение никогда не выдумывается: from/to приходят из брифа.
export const CountUp: React.FC<{
  from: number;
  to: number;
  start: number;
  duration: number;
  locale?: string;
  style?: React.CSSProperties;
}> = ({ from, to, start, duration, locale = "ru-RU", style }) => {
  const p = useProgress(start, duration);
  const v = Math.round(interpolate(p, [0, 1], [from, to]));
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{v.toLocaleString(locale)}</span>;
};

// ── 3. Линия, которая рисуется ─────────────────────────────────────────
export const DrawPath: React.FC<{
  d: string;
  start: number;
  duration: number;
  color: string;
  width?: number;
  length?: number; // примерная длина пути, с запасом
}> = ({ d, start, duration, color, width = 8, length = 1200 }) => {
  const p = useProgress(start, duration);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={length}
      strokeDashoffset={interpolate(p, [0, 1], [length, 0])}
    />
  );
};

// ── 4. Split-flap табло (буквы перещёлкиваются в фразу) ────────────────
const FLAP = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const SplitFlap: React.FC<{
  text: string;
  start: number;
  perChar?: number; // задержка между буквами, кадры
  spin?: number; // сколько кадров буква «крутится»
  cell: number; // размер ячейки, px
  bg: string;
  color: string;
}> = ({ text, start, perChar = 2, spin = 12, cell, bg, color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: cell * 0.08 }}>
      {[...text].map((ch, i) => {
        const settle = start + i * perChar + spin;
        const spinning = frame < settle && frame >= start + i * perChar;
        // псевдослучайная, но детерминированная буква: зависит только от кадра и позиции
        const shown =
          ch === " " ? " " : frame >= settle ? ch : spinning ? FLAP[(frame * 7 + i * 13) % FLAP.length] : " ";
        return (
          <div
            key={i}
            style={{
              width: cell,
              height: cell * 1.3,
              backgroundColor: ch === " " ? "transparent" : bg,
              color,
              borderRadius: cell * 0.1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: cell * 0.85,
              fontWeight: 800,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {shown}
            {ch !== " " && (
              <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, backgroundColor: "rgba(0,0,0,0.35)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── 5. Круговой вайп (заливка экрана кругом из точки) ──────────────────
export const CircleWipe: React.FC<{
  start: number;
  duration: number;
  color: string;
  origin?: [number, number]; // в процентах
  children?: React.ReactNode;
}> = ({ start, duration, color, origin = [50, 50], children }) => {
  const p = useProgress(start, duration, Easing.bezier(0.65, 0, 0.35, 1));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        clipPath: `circle(${interpolate(p, [0, 1], [0, 150])}% at ${origin[0]}% ${origin[1]}%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

// ── 6. Печать ВНУТРИ поля ввода (единственное законное место typewriter) ──
export const TypingInput: React.FC<{
  text: string;
  start: number;
  cps?: number; // символов в секунду
  width: number;
  size: number;
  label?: string;
  bg?: string;
  color?: string;
  accent?: string;
}> = ({ text, start, cps = 22, width, size, label, bg = "#FFFFFF", color = "#141413", accent = "#D97757" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / fps) * cps)));
  const caretOn = Math.floor(frame / (fps / 2)) % 2 === 0 || n < text.length;
  return (
    <div
      style={{
        width,
        backgroundColor: bg,
        borderRadius: size * 0.7,
        padding: `${size * 0.7}px ${size * 0.9}px`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        fontSize: size,
        color,
      }}
    >
      {label && <div style={{ fontSize: size * 0.55, opacity: 0.55, marginBottom: size * 0.3 }}>{label}</div>}
      <span>{text.slice(0, n)}</span>
      <span style={{ display: "inline-block", width: size * 0.08, height: size * 1.05, marginLeft: 2, verticalAlign: "middle", backgroundColor: accent, opacity: caretOn ? 1 : 0 }} />
    </div>
  );
};

// ── 7. Караоке-субтитры из транскрипта ─────────────────────────────────
// Формат как у @remotion/captions: { text: " слово", startMs, endMs }.
export type Word = { text: string; startMs: number; endMs: number };
export const KaraokeCaptions: React.FC<{
  words: Word[];
  maxWords?: number; // слов на «страницу»
  size: number;
  color: string;
  highlight: string;
  stroke?: string;
}> = ({ words, maxWords = 4, size, color, highlight, stroke = "rgba(0,0,0,0.55)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const idx = words.findIndex((w) => ms >= w.startMs && ms < w.endMs);
  const cur = idx === -1 ? words.findIndex((w) => w.startMs > ms) - 1 : idx;
  if (cur < 0) return null;
  const pageStart = Math.floor(cur / maxWords) * maxWords;
  const page = words.slice(pageStart, pageStart + maxWords);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.25 }}>
      {page.map((w, i) => {
        const active = pageStart + i === cur;
        return (
          <span
            key={i}
            style={{
              fontSize: size,
              fontWeight: 900,
              textTransform: "uppercase",
              color: active ? highlight : color,
              WebkitTextStroke: `${size * 0.04}px ${stroke}`,
              paintOrder: "stroke fill",
              scale: active ? "1.08" : "1",
            }}
          >
            {w.text.trim()}
          </span>
        );
      })}
    </div>
  );
};

// ── 8. Стеклянная карточка (glassmorphism) ─────────────────────────────
export const GlassCard: React.FC<{ width: number; padding?: number; dark?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({
  width,
  padding = 40,
  dark = true,
  children,
  style,
}) => (
  <div
    style={{
      width,
      padding,
      borderRadius: 36,
      background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.65)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.06)"}`,
      backdropFilter: "blur(24px)",
      boxShadow: dark ? "0 30px 80px rgba(0,0,0,0.45)" : "0 30px 80px rgba(0,0,0,0.10)",
      ...style,
    }}
  >
    {children}
  </div>
);

// ── 9. Радиальное свечение фона (премиум-тёмная сцена) ─────────────────
export const GlowBackground: React.FC<{ base: string; glow: string; drift?: boolean }> = ({ base, glow, drift = true }) => {
  const frame = useCurrentFrame();
  const x = drift ? 50 + Math.sin(frame / 60) * 8 : 50;
  const y = drift ? 42 + Math.cos(frame / 75) * 6 : 42;
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${x}% ${y}%, ${glow} 0%, ${base} 55%)` }} />
  );
};
export * from "./sfx";
