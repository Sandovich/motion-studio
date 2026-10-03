// Библиотека «шоурильных» эффектов (по разборам рилсов 11–12: Dami и Grafigator) — всё от useCurrentFrame(), детерминировано.
// Hud · Punch · ParticleText · CardTunnel · Stripes · Halftone · ShapeGrid · Rewind · DropWord · Orbit
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, Freeze, continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, ease } from "./index";

export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const prog = (f: number, a: number, b: number, easing = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });

// ── HUD-рамка: уголки, подпись, таймкод, глава, шкала (декор, data-fit="decor") ──
export const Hud: React.FC<{ title: string; right?: string; chapters: [number, string][]; total: number; font: string; dark?: boolean; shownFrame?: number }> = ({
  title, right = "", chapters, total, font, dark = true, shownFrame,
}) => {
  const f = useCurrentFrame();
  const shown = shownFrame ?? f;
  const c = dark ? "rgba(241,236,227,0.72)" : "rgba(18,16,16,0.62)";
  const chapter = [...chapters].reverse().find(([a]) => f >= a)?.[1] ?? "";
  const tc = `${String(Math.floor(shown / 30)).padStart(2, "0")}:${String(shown % 30).padStart(2, "0")}`;
  const corner = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 34, height: 34, borderColor: c, borderStyle: "solid", borderWidth: 0, ...s }} />;
  return (
    <AbsoluteFill data-fit="decor" style={{ fontFamily: font, fontSize: 21, letterSpacing: 2, color: c, pointerEvents: "none" }}>
      {corner({ left: 40, top: 70, borderLeftWidth: 3, borderTopWidth: 3 })}
      {corner({ right: 40, top: 70, borderRightWidth: 3, borderTopWidth: 3 })}
      {corner({ left: 40, bottom: 70, borderLeftWidth: 3, borderBottomWidth: 3 })}
      {corner({ right: 40, bottom: 70, borderRightWidth: 3, borderBottomWidth: 3 })}
      <div style={{ position: "absolute", left: 90, top: 80 }}>{title}</div>
      <div style={{ position: "absolute", right: 90, top: 80 }}>TC 00:00:{tc}</div>
      <div style={{ position: "absolute", left: 90, bottom: 80 }}>{chapter}</div>
      <div style={{ position: "absolute", right: 90, bottom: 80 }}>{right}</div>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 124, height: 2, backgroundColor: c, opacity: 0.35 }}>
        <div style={{ width: `${Math.min(1, shown / total) * 100}%`, height: 2, backgroundColor: c }} />
      </div>
    </AbsoluteFill>
  );
};

// ── Слово-удар: влетает крупнее, размытым и с наклоном, садится за 7 кадров. fill: цвет или картинка в буквах ──
export const Punch: React.FC<{ text: string; at: number; font: string; size: number; color?: string; image?: string; pos?: string; rot?: number; top: number; left?: number; width?: number; weight?: number }> = ({
  text, at, font, size, color = "#fff", image, pos = "50% 40%", rot = 0, top, left = 120, width = 720, weight = 900,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 7);
  const fill: React.CSSProperties = image
    ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: pos, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
    : { color };
  return (
    <div style={{ position: "absolute", left, width, top, translate: "0 -50%", display: "flex", justifyContent: "center", opacity: f < at ? 0 : 1 }}>
      <div style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.03, whiteSpace: "nowrap", scale: String(interpolate(p, [0, 1], [1.12, 1])), rotate: `${interpolate(p, [0, 1], [rot * 2, rot])}deg`, filter: `blur(${interpolate(p, [0, 0.5, 1], [10, 2, 0])}px)`, ...fill }}>
        {text}
      </div>
    </div>
  );
};

// ── Частицы собираются в текст (canvas, точки из растра текста), затем проявляется чёткий текст ──
export const ParticleText: React.FC<{ lines: string[]; font: string; weight?: number; cx: number; top: number; maxWidth: number; color: string; accent?: string; converge?: [number, number]; crispAt?: number; step?: number }> = ({
  lines, font, weight = 400, cx, top, maxWidth, color, accent, converge = [0, 36], crispAt = 34, step = 5,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const [pts, setPts] = useState<{ tx: number[]; ty: number[]; size: number } | null>(null);
  const [handle] = useState(() => delayRender("ParticleText"));
  useEffect(() => {
    document.fonts.load(`${weight} 120px "${font}"`).then(() => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const x = c.getContext("2d")!;
      let size = 240;
      const set = () => (x.font = `${weight} ${size}px "${font}"`);
      set();
      while (Math.max(...lines.map((t) => x.measureText(t).width)) > maxWidth && size > 40) {
        size--;
        set();
      }
      x.fillStyle = "#fff";
      x.textAlign = "center";
      lines.forEach((t, i) => x.fillText(t, cx, top + size * (0.8 + i * 1.02)));
      const d = x.getImageData(0, 0, width, height).data;
      const tx: number[] = [], ty: number[] = [];
      for (let yy = 0; yy < height; yy += step) for (let xx = 0; xx < width; xx += step) if (d[(yy * width + xx) * 4 + 3] > 128) { tx.push(xx); ty.push(yy); }
      setPts({ tx, ty, size });
      continueRender(handle);
    });
  }, [handle, font, weight, lines, cx, top, maxWidth, width, height, step]);
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv || !pts) return;
    const x = cv.getContext("2d")!;
    x.clearRect(0, 0, width, height);
    const [a, b] = converge;
    const crisp = prog(f, crispAt, crispAt + 10);
    x.globalAlpha = 1 - crisp * 0.9;
    for (let i = 0; i < pts.tx.length; i++) {
      const ang = rnd(i) * Math.PI * 2 + f * 0.06, rad = 500 + rnd(i + 7) * 700;
      const sx = cx + Math.cos(ang) * rad, sy = height / 2 + Math.sin(ang) * rad * 1.3;
      const t = prog(f, a + rnd(i + 3) * (b - a) * 0.4, a + (b - a) * 0.6 + rnd(i + 3) * (b - a) * 0.4, (u) => 1 - Math.pow(1 - u, 3));
      x.fillStyle = accent && rnd(i + 11) > 0.86 ? accent : color;
      x.fillRect(sx + (pts.tx[i] - sx) * t - 1.6, sy + (pts.ty[i] - sy) * t - 1.6, 3.2, 3.2);
    }
    x.globalAlpha = crisp;
    x.fillStyle = color;
    x.textAlign = "center";
    x.font = `${weight} ${pts.size}px "${font}"`;
    lines.forEach((t, i) => x.fillText(t, cx, top + pts.size * (0.8 + i * 1.02)));
    x.globalAlpha = 1;
  }, [f, pts, width, height, converge, crispAt, color, accent, cx, top, lines, font, weight]);
  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", inset: 0 }} />;
};

// ── 3D-туннель из карточек, летящих на камеру (CSS 3D) ──────────────────
export const CardTunnel: React.FC<{ count: number; render: (i: number) => React.ReactNode; rings?: number; per?: number; speed?: number; cw?: number; ch?: number; rx?: number; ry?: number }> = ({
  count, render, rings = 9, per = 7, speed = 70, cw = 300, ch = 400, rx = 560, ry = 760,
}) => {
  const f = useCurrentFrame();
  const depth = 4200;
  const cards = [];
  for (let r = 0; r < rings; r++)
    for (let k = 0; k < per; k++) {
      const z = (((r * depth) / rings + f * speed) % depth) - depth + 500;
      const a = ((k / per) * 360 + r * 23 + f * 1.6) * (Math.PI / 180);
      cards.push(
        <div key={`${r}-${k}`} style={{ position: "absolute", width: cw, height: ch, left: -cw / 2, top: -ch / 2, borderRadius: 14, overflow: "hidden", transform: `translate3d(${Math.cos(a) * rx}px, ${Math.sin(a) * ry}px, ${z}px) rotateZ(${(a * 180) / Math.PI + 90}deg)`, opacity: interpolate(z, [-depth + 500, -2800, 200, 500], [0, 1, 1, 0], clamp), boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
          {render((r * per + k) % count)}
        </div>,
      );
    }
  return (
    <AbsoluteFill style={{ perspective: 1000, perspectiveOrigin: "50% 50%", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d" }}>{cards}</div>
    </AbsoluteFill>
  );
};

// ── Полосы-шторка по диагонали (переход в бит) ──────────────────────────
export const Stripes: React.FC<{ at: number; dur?: number; a: string; b: string }> = ({ at, dur = 12, a, b }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const x = interpolate((f - at) / dur, [0, 0.5, 1], [-1400, 0, 1400]);
  return <div style={{ position: "absolute", inset: -400, translate: `${x}px 0`, rotate: "-20deg", background: `repeating-linear-gradient(90deg, ${a} 0 70px, ${b} 70px 140px)` }} />;
};

// ── Полутон-растр, пульсирующий кругами от центра ───────────────────────
export const Halftone: React.FC<{ bg: string; dot: string; step?: number; speed?: number }> = ({ bg, dot, step = 90, speed = 0.9 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cols = Math.ceil(width / step), rows = Math.ceil(height / step);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {[...Array(cols * rows)].map((_, n) => {
        const c = n % cols, r = Math.floor(n / cols);
        const d = Math.hypot(c * step + step / 2 - width / 2, r * step + step / 2 - height / 2) / step;
        const s = 0.25 + 0.75 * Math.max(0, Math.sin(f * speed - d * 0.8));
        return <div key={n} style={{ position: "absolute", left: c * step + step * 0.15, top: r * step + step * 0.15, width: step * 0.7, height: step * 0.7, borderRadius: "50%", backgroundColor: dot, scale: String(s) }} />;
      })}
    </AbsoluteFill>
  );
};

// ── Сетка фигур (круги/квадраты/капсулы) крутится волной ────────────────
export const ShapeGrid: React.FC<{ colors: string[]; bg: string; step?: number }> = ({ colors, bg, step = 108 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cols = Math.ceil(width / step), rows = Math.ceil(height / step);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {[...Array(cols * rows)].map((_, n) => {
        const c = n % cols, r = Math.floor(n / cols);
        const ph = f * 0.18 - (c + r) * 0.45;
        const kind = Math.floor(rnd(n) * 3);
        const s = step * 0.62;
        return (
          <div key={n} style={{ position: "absolute", left: c * step + (step - s) / 2, top: r * step + (step - s) / 2, width: s, height: kind === 2 ? s * 0.5 : s, marginTop: kind === 2 ? s * 0.25 : 0, borderRadius: kind === 1 ? 10 : s, backgroundColor: colors[Math.floor(rnd(n + 5) * colors.length)], rotate: `${Math.sin(ph) * 60 + (kind === 2 ? 45 : 0)}deg`, scale: String(0.8 + 0.2 * Math.sin(ph)) }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Перемотка: кусок ролика крутится назад ×speed с VHS-полосами ─────────
// children — дерево сцен; from — с какого кадра мотаем назад. Звуки внутри заглушить <SfxMute.Provider value>.
export const Rewind: React.FC<{ from: number; speed?: number; label: string; font: string; children: React.ReactNode }> = ({ from, speed = 16, label, font, children }) => {
  const f = useCurrentFrame();
  const shown = Math.max(0, from - 1 - f * speed);
  const bands = [0, 1, 2].map((i) => ({ y: rnd(f * 3 + i) * 1920, h: 30 + rnd(f * 7 + i) * 90 }));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ translate: `${(rnd(f) - 0.5) * 24}px 0`, filter: "contrast(1.15) saturate(1.3)" }}>
        <Freeze frame={shown}>{children}</Freeze>
      </AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 3px, transparent 3px 6px)" }} />
      {bands.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: b.y, height: b.h, background: "rgba(255,255,255,0.18)", mixBlendMode: "screen", translate: `${(rnd(f + i * 9) - 0.5) * 80}px 0` }} />
      ))}
      <div style={{ position: "absolute", left: 140, top: 300, fontFamily: font, fontWeight: 500, fontSize: 52, color: "#fff", textShadow: "3px 0 #E0301E, -3px 0 #2B46FF" }}>{label}</div>
    </AbsoluteFill>
  );
};

// ── Буквы падают сверху и пружинят на место ─────────────────────────────
export const DropWord: React.FC<{ text: string; at: number; top: number; size: number; font: string; color: string; weight?: number; left?: number; width?: number }> = ({
  text, at, top, size, font, color, weight = 900, left = 120, width = 720,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left, width, top, display: "flex", justifyContent: "center" }}>
      {[...text].map((ch, i) => {
        const s = spring({ frame: f - at - i * 2, fps, config: { damping: 9, stiffness: 160, mass: 0.7 } });
        return (
          <span key={i} data-fit={s < 0.97 ? "decor" : undefined} style={{ fontFamily: font, fontWeight: weight, fontSize: size, letterSpacing: -size * 0.03, color, display: "inline-block", whiteSpace: "pre", translate: `0 ${interpolate(s, [0, 1], [-1300, 0])}px`, rotate: `${interpolate(s, [0, 1], [i % 2 ? 24 : -18, 0])}deg` }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// ── Орбита: эллипс прорисовывается, по нему бежит точка ─────────────────
export const Orbit: React.FC<{ cx: number; cy: number; rx: number; ry: number; color: string; start: number; dur?: number; tilt?: number }> = ({ cx, cy, rx, ry, color, start, dur = 22, tilt = -8 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = prog(f, start, start + dur);
  const len = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={color} strokeWidth={4} strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform={`rotate(${tilt} ${cx} ${cy})`} />
      <circle cx={cx + rx * Math.cos(f * 0.1)} cy={cy + ry * Math.sin(f * 0.1)} r={11} fill={color} opacity={p} transform={`rotate(${tilt} ${cx} ${cy})`} />
    </svg>
  );
};
