// Главы 16–18 промо скилла: Vox-коллаж с правкой одной фразой (рилс 13), конвейер «референсы → раскадровка → анимация»
// через Higgsfield MCP (рилс 14), витрина официальных пакетов Remotion (remotion.dev: paths, shapes, noise, rough-notation,
// media-utils). Коллаж здесь сделан кодом как демонстрация; настоящий генерируется Seedance 2.5 (ai-motion-higgsfield.md).
import React from "react";
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { Circle as RoughCircle, Highlight } from "@remotion/rough-notation";
import { Star, Triangle } from "@remotion/shapes";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PromptBar, Sfx, rnd } from "../components";
import { Arrow, C, CX, Center, L, Title, W, Words, mono, prog, ui, usePath, wide } from "./kit";

// ── 16. VOX-КОЛЛАЖ: бумага, рваная полоса неба, вырезка-здание, жёлтый круг; правка фразой меняет фон и добавляет монеты ──
const torn = (y: number, h: number, seed: number) => {
  const top: string[] = [], bot: string[] = [];
  for (let x = -20; x <= 1100; x += 22) {
    top.push(`${x},${y + (rnd(seed + x) - 0.5) * 26}`);
    bot.push(`${x},${y + h + (rnd(seed + x * 3) - 0.5) * 26}`);
  }
  return [...top, ...bot.reverse()].join(" ");
};
export const Vox: React.FC = () => {
  const f = useCurrentFrame();
  const blue = prog(f, 44, 56);
  const coins = f >= 86;
  const rise = prog(f, 4, 26, (t) => 1 - Math.pow(1 - t, 3));
  const sky = `rgb(${interpolate(blue, [0, 1], [242, 47])}, ${interpolate(blue, [0, 1], [160, 123])}, ${interpolate(blue, [0, 1], [70, 255])})`;
  return (
    <AbsoluteFill style={{ backgroundColor: "#ECE4D3", backgroundImage: "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "6px 6px" }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <polygon points={torn(380, 520, 3)} fill={sky} />
        <polygon points={torn(380, 520, 3)} fill="none" stroke="#fff" strokeWidth="10" opacity="0.9" />
        <circle cx={CX + 170} cy={560} r={120} fill="#F2B705" />
      </svg>
      <Title text="КОЛЛАЖ" top={280} max={140} color={C.ink} />
      {/* здание-вырезка с белой кромкой */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, translate: `0 ${(1 - rise) * 500}px` }}>
        <g stroke="#fff" strokeWidth="14" strokeLinejoin="round" fill="#CDBF9F">
          <rect x={CX - 170} y={760} width={340} height={420} />
          <rect x={CX - 110} y={690} width={220} height={80} />
          <path d={`M ${CX - 100} 690 Q ${CX} 520 ${CX + 100} 690 Z`} />
          <rect x={CX - 12} y={500} width={24} height={60} />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={CX - 140 + i * 80} y={840} width={40} height={120} rx={20} fill="#6E5F45" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`b${i}`} x={CX - 140 + i * 80} y={1010} width={40} height={120} rx={20} fill="#6E5F45" />
        ))}
      </svg>
      {coins &&
        [...Array(12)].map((_, i) => {
          const t = (f - 86 - i * 2) / 30;
          return t < 0 ? null : <div key={i} style={{ position: "absolute", left: L + 40 + rnd(i) * (W - 80), top: 300 + t * 900, width: 54, height: 54, borderRadius: 27, background: "radial-gradient(circle at 35% 35%, #FFE58A, #E8A800)", border: "4px solid #B47F00", rotate: `${t * 300}deg` }} />;
        })}
      <PromptBar text="Сделай фон синим" at={26} font={ui} x={L} w={W} y={1290} />
      {f >= 70 && <PromptBar text="Добавь падающие монеты" at={70} font={ui} x={L} w={W} y={1290} />}
      <Sfx s="whoosh-soft" at={4} volume={0.5} />
      <Sfx s="click" at={42} volume={0.7} />
      <Sfx s="whoosh-slide" at={46} volume={0.5} />
      <Sfx s="click" at={84} volume={0.7} />
      {[88, 92, 96, 100, 104].map((a) => (
        <Sfx key={a} s="pop-high" at={a} volume={0.35} rate={1.3} />
      ))}
    </AbsoluteFill>
  );
};

// ── 17. КОНВЕЙЕР (рилс 14): референсы → раскадровка → анимация ──────────
const STEPS = ["референсы", "раскадровка", "анимация"];
export const Pipeline: React.FC = () => {
  const f = useCurrentFrame();
  const phase = f < 36 ? 0 : f < 72 ? 1 : 2;
  const pick = usePath([[10, 820, 1200], [26, CX, 800], [40, CX, 800]], [27]);
  const zoom = prog(f, 72, 92);
  const cardW = 180, gap = 18, gridW = cardW * 3 + gap * 2, gx = CX - gridW / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: "#F6EEE6" }}>
      <Center top={300} style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ padding: "10px 14px", borderRadius: 30, fontFamily: wide, fontWeight: 800, fontSize: 18, backgroundColor: i === phase ? C.ink : "rgba(13,13,22,0.08)", color: i === phase ? C.cream : C.ink }}>
            {s}
          </div>
        ))}
      </Center>
      {/* 1. референсы */}
      <div style={{ opacity: phase === 0 ? 1 : 0 }}>
        {[...Array(9)].map((_, i) => {
          const s = prog(f, i * 2, i * 2 + 8);
          const col = ["#2E3A59", "#C9472B", "#E9C46A", "#264653", "#F4A261", "#1D1D1D", "#8AB17D", "#B56576", "#457B9D"][i];
          return (
            <div key={i} style={{ position: "absolute", left: gx + (i % 3) * (cardW + gap), top: 420 + Math.floor(i / 3) * (cardW + gap), width: cardW, height: cardW, borderRadius: 18, background: `linear-gradient(135deg, ${col}, #111)`, opacity: s, scale: String(0.8 + 0.2 * s), outline: i === 4 && f > 27 ? `6px solid ${C.orange}` : "none", outlineOffset: 4 }}>
              <div style={{ position: "absolute", left: 30 + rnd(i) * 60, top: 30 + rnd(i + 1) * 60, width: 60, height: 60, borderRadius: i % 2 ? 30 : 6, backgroundColor: "rgba(255,255,255,0.75)" }} />
            </div>
          );
        })}
        {f < 36 && <Arrow x={pick.x} y={pick.y} press={pick.press} color={C.ink} />}
      </div>
      {/* 2. раскадровка — монохромные скетчи 3×2 */}
      <div style={{ opacity: phase === 1 ? 1 : phase === 2 ? 1 - zoom : 0 }}>
        {[...Array(6)].map((_, i) => {
          const s = prog(f, 36 + i * 3, 44 + i * 3);
          const x = L + (i % 2) * (W / 2 + 10), y = 420 + Math.floor(i / 2) * 230;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: W / 2 - 10, height: 210, borderRadius: 14, backgroundColor: "#fff", border: i === 2 ? `5px solid ${C.orange}` : "2px solid #ddd", opacity: s, padding: 10, boxSizing: "border-box" }}>
              <svg width="100%" height="150" viewBox="0 0 280 150">
                <path d={`M 10 ${120 - rnd(i) * 40} Q 140 ${40 + rnd(i + 2) * 40} 270 ${100 - rnd(i + 4) * 50}`} stroke="#333" strokeWidth="3" fill="none" />
                <circle cx={60 + rnd(i + 5) * 160} cy={70} r={18 + rnd(i) * 14} stroke="#333" strokeWidth="3" fill="none" />
                <path d="M 120 140 L 140 90 L 160 140" stroke="#333" strokeWidth="3" fill="none" />
              </svg>
              <div style={{ fontFamily: mono, fontSize: 18, color: "#666" }}>K{i + 1} · {i * 2}–{i * 2 + 2} с</div>
            </div>
          );
        })}
      </div>
      {/* 3. выбранный кадр оживает: слои двигаются параллаксом */}
      {phase === 2 && (
        <div style={{ position: "absolute", left: interpolate(zoom, [0, 1], [L, L]), top: interpolate(zoom, [0, 1], [880, 420]), width: W, height: interpolate(zoom, [0, 1], [210, 760]), borderRadius: 24, overflow: "hidden", background: "linear-gradient(180deg, #1E2A44 0%, #3D4F7A 55%, #E9DCC3 56%, #D9C9A8 100%)" }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: "absolute", left: -100 + ((f * (k + 1) * 3) % 200), bottom: 120 + k * 60, width: 900, height: 120, borderRadius: "50%", backgroundColor: ["#2B3A5E", "#435A8C", "#5B74AA"][k], opacity: 0.6 }} />
          ))}
          <div style={{ position: "absolute", left: W / 2 - 60, bottom: 160, width: 120, height: 200, backgroundColor: "#111", clipPath: "polygon(50% 0, 100% 35%, 80% 100%, 20% 100%, 0 35%)", translate: `0 ${Math.sin(f / 8) * 6}px` }} />
          <div style={{ position: "absolute", right: 20, top: 20, padding: "8px 14px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.9)", fontFamily: mono, fontSize: 20, color: C.ink }}>Seedance 2.5 · Higgsfield MCP</div>
        </div>
      )}
      <Words text="СТИЛЬ ЗАДАЁШЬ ТЫ" at={96} size={52} top={1200} color={C.ink} weight={900} />
      <Sfx s="pop-high" at={2} volume={0.4} />
      <Sfx s="click" at={27} volume={0.7} />
      <Sfx s="whoosh-slide" at={36} volume={0.5} />
      <Sfx s="shutter" at={46} volume={0.5} />
      <Sfx s="whoosh" at={74} volume={0.5} />
      <Sfx s="hit" at={96} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 18. ВИТРИНА REMOTION: пакеты с remotion.dev — paths, shapes, noise, rough-notation, визуализация звука ──
const LOGO = "M 60 300 C 60 120, 220 60, 300 160 C 380 260, 520 260, 540 120 M 300 160 L 300 330";
export const RemotionLab: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = prog(f, 4, 34);
  const ev = evolvePath(draw, LOGO);
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({ src: staticFile("music/tech-house.mp3"), frame: f + 489, fps, windowInSeconds: 30 });
  const bars = audioData ? visualizeAudio({ fps, frame: f + 489, audioData, numberOfSamples: 32, optimizeFor: "speed", dataOffsetInSeconds }) : new Array(32).fill(0.1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B14" }}>
      <Center top={300} style={{ textAlign: "center", fontFamily: wide, fontWeight: 900, fontSize: 64, color: C.cream }}>
        <Highlight color="rgba(198,242,78,0.45)" progress={prog(f, 6, 24)}>
          <span>REMOTION</span>
        </Highlight>
      </Center>
      {/* @remotion/paths: линия рисуется */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${CX - 300}, 380)`}>
          <path d={LOGO} fill="none" stroke={C.lime} strokeWidth="14" strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
        </g>
        {/* @remotion/noise: поле точек, текущее как жидкость */}
        {[...Array(15 * 7)].map((_, i) => {
          const c = i % 15, r = Math.floor(i / 15);
          const n = noise2D("field", c / 6 + f / 60, r / 6);
          return <circle key={i} cx={L + 20 + c * 40} cy={800 + r * 40 + n * 14} r={4 + n * 5} fill={n > 0 ? C.mint : C.violet} opacity={0.4 + Math.abs(n) * 0.6} />;
        })}
      </svg>
      {/* @remotion/shapes: звезда и треугольник */}
      <div style={{ position: "absolute", left: CX - 230, top: 1040, rotate: `${f * 3}deg` }}>
        <Star points={5} innerRadius={40} outerRadius={90} fill={C.orange} />
      </div>
      <div style={{ position: "absolute", left: CX + 60, top: 1050, rotate: `${-f * 2}deg` }}>
        <Triangle length={170} direction="up" fill={C.cobalt} />
      </div>
      {/* @remotion/media-utils: эквалайзер по настоящей музыке ролика */}
      <Center top={1240} h={110} style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        {bars.map((v, i) => (
          <div key={i} style={{ flex: 1, height: Math.max(8, Math.min(110, v * 900)), borderRadius: 4, backgroundColor: i % 5 === 0 ? C.orange : C.lime }} />
        ))}
      </Center>
      {/* @remotion/rough-notation: рукописный круг */}
      <div style={{ position: "absolute", left: CX - 260, top: 1010 }}>
        <RoughCircle color={C.yellow} progress={prog(f, 50, 70)} strokeWidth={4}>
          <div style={{ width: 240, height: 240 }} />
        </RoughCircle>
      </div>
      <Sfx s="whoosh-slide" at={4} volume={0.5} />
      <Sfx s="pop" at={24} volume={0.5} />
      <Sfx s="whoosh-soft" at={50} volume={0.4} />
    </AbsoluteFill>
  );
};
