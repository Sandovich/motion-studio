// «Дубль» (Чиковинский, рилс 7) и Ev Astapov (рилс 6) — по опорным кадрам оригиналов.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp, RollText, Sfx, TypingSfx, rnd } from "../components";
import { CX, F, prog } from "./theme";

const CREAM = "#F4E9D8";
const RED = "#E8412C";

// Ячейка табло: перещёлкивает символы и встаёт на нужный
const Flap: React.FC<{ ch: string; at: number; w: number; h: number; color?: string }> = ({ ch, at, w, h, color = "#FFFFFF" }) => {
  const f = useCurrentFrame();
  const ABC = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789";
  const spinning = f >= at && f < at + 10;
  const shown = f < at ? "" : spinning ? ABC[(f * 7 + at * 3) % ABC.length] : ch;
  return (
    <div style={{ width: w, height: h, borderRadius: 6, backgroundColor: "#33363E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.narrow, fontWeight: 700, fontSize: h * 0.72, color, position: "relative", overflow: "hidden" }}>
      {shown}
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, backgroundColor: "rgba(0,0,0,0.5)" }} />
    </div>
  );
};

export const Dubl: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tebe = spring({ frame: f, fps, config: { damping: 11, stiffness: 180 } });
  const globe = prog(f, 36, 48);
  const board = f >= 78 && f < 126;
  const wave = f >= 126;
  const rec = Math.floor(f / 15) % 2 === 0;
  const bg = f < 78 ? RED : board ? "#26282E" : "#121216";
  const rows: [string, string, string][] = [
    ["ИДЕЯ", "РИЛС", "ВЗЛЁТ"],
    ["ПРОМПТ", "КАДР", "ЕСТЬ"],
    ["ЗВУК", "БИТ", "ДА"],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {/* видоискатель */}
      {[[150, 300, 1, 1], [930, 300, -1, 1], [150, 1450, 1, -1], [930, 1450, -1, -1]].map(([x, y, sx, sy], i) => (
        <div key={i} style={{ position: "absolute", left: x - (sx < 0 ? 56 : 0), top: y - (sy < 0 ? 56 : 0), width: 56, height: 56, borderColor: "rgba(244,233,216,0.85)", borderStyle: "solid", borderWidth: 0, borderLeftWidth: sx > 0 ? 5 : 0, borderRightWidth: sx < 0 ? 5 : 0, borderTopWidth: sy > 0 ? 5 : 0, borderBottomWidth: sy < 0 ? 5 : 0 }} />
      ))}
      <div style={{ position: "absolute", left: 250, top: 330, display: "flex", alignItems: "center", gap: 10, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: CREAM }}>
        <span style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: rec ? "#FF3B30" : "transparent", border: `3px solid ${CREAM}` }} />
        REC
      </div>
      <div style={{ position: "absolute", right: 250, top: 330, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: CREAM }}>ДУБЛЬ 0{f < 78 ? 1 : f < 126 ? 2 : 3}</div>

      {/* 1. «ТЕБЕ» */}
      {f < 40 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, translate: "0 -50%", textAlign: "center", fontFamily: F.unbounded, fontWeight: 900, fontSize: 180, letterSpacing: -7, color: CREAM, scale: String(interpolate(tebe, [0, 1], [1.4, 1])), opacity: 1 - globe }}>
          ТЕБЕ
        </div>
      )}
      {/* 2. глобус «МИРУ» + текст по кругу */}
      {f >= 36 && f < 80 && (
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: globe * (1 - prog(f, 74, 80)) }}>
          <defs>
            <path id="ring3" d={`M ${CX - 262} 960 a 262 262 0 1 1 524 0 a 262 262 0 1 1 -524 0`} />
          </defs>
          <circle cx={CX} cy={960} r={300} fill="none" stroke={CREAM} strokeWidth="4" />
          <circle cx={CX} cy={960} r={220} fill="#C9301F" stroke={CREAM} strokeWidth="5" />
          {[-150, -75, 0, 75, 150].map((y) => (
            <ellipse key={y} cx={CX} cy={960 + y} rx={Math.sqrt(220 * 220 - y * y)} ry={16} fill="none" stroke={CREAM} strokeWidth="3" opacity="0.8" />
          ))}
          {[0.3, 0.65].map((k) => (
            <ellipse key={k} cx={CX} cy={960} rx={220 * Math.abs(Math.cos(f * 0.04 + k * 3))} ry={220} fill="none" stroke={CREAM} strokeWidth="3" opacity="0.8" />
          ))}
          <g transform={`rotate(${f * 1.2} ${CX} 960)`}>
            <text fontFamily={F.unbounded} fontWeight={800} fontSize="28" fill={CREAM} letterSpacing="5">
              <textPath href="#ring3">СКАЗАТЬ МИРУ • СКАЗАТЬ МИРУ • СКАЗАТЬ МИРУ •</textPath>
            </text>
          </g>
          <text x={CX} y={1000} textAnchor="middle" fontFamily={F.unbounded} fontWeight={900} fontSize="118" fill={CREAM} stroke="#C9301F" strokeWidth="6" paintOrder="stroke" transform={`rotate(-32 ${CX} 960)`}>
            МИРУ
          </text>
        </svg>
      )}
      {/* 3. табло аэропорта */}
      {board && (
        <div style={{ position: "absolute", left: 240, width: 600, top: 520 }}>
          <div style={{ height: 84, borderRadius: 12, backgroundColor: "#FFC93C", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontFamily: F.narrow, fontWeight: 700, fontSize: 38, color: "#141414", translate: `0 ${(1 - prog(f, 78, 88)) * -60}px`, opacity: prog(f, 78, 86) }}>
            <span>✈ ОТПРАВЛЕНИЕ</span>
            <span>09:03</span>
          </div>
          <div style={{ marginTop: 22, textAlign: "center", fontFamily: F.onest, fontWeight: 600, fontSize: 36, color: "#FFFFFF", opacity: prog(f, 84, 90) }}>Но почему-то…</div>
          <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, fontFamily: F.narrow, fontWeight: 700, fontSize: 22, color: "#8A8D96" }}>
            <span>РЕЙС</span>
            <span>КУДА</span>
            <span>СТАТУС</span>
          </div>
          {rows.map((r, ri) => (
            <div key={ri} style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
              {r.map((word, ci) => (
                <div key={ci} style={{ display: "flex", gap: 3 }}>
                  {word
                    .padEnd(6, " ")
                    .slice(0, 6)
                    .split("")
                    .map((ch, k) => (
                      <Flap key={k} ch={ch.trim()} at={90 + ri * 6 + ci * 3 + k} w={28} h={46} color={ci === 2 ? "#FFC93C" : "#FFFFFF"} />
                    ))}
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6, opacity: 0.55 }}>
            {[...Array(30)].map((_, i) => (
              <div key={i} style={{ height: 52, borderRadius: 6, backgroundColor: "#33363E" }} />
            ))}
          </div>
        </div>
      )}
      {/* 4. «ТЕБЕ» + неоновая осциллограмма */}
      {wave && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: F.unbounded, fontWeight: 900, fontSize: 180, letterSpacing: -7, color: CREAM, opacity: prog(f, 126, 134) }}>ТЕБЕ</div>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <path
              d={[...Array(91)].map((_, i) => {
                const x = 240 + i * 6.67;
                const env = Math.sin((i / 90) * Math.PI);
                const y = 1180 + Math.sin(i * 0.55 + f * 0.6) * 90 * env * (0.6 + 0.4 * Math.sin(f * 0.2));
                return `${i ? "L" : "M"} ${x} ${y}`;
              }).join(" ")}
              fill="none"
              stroke="#D9FF3B"
              strokeWidth="7"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 10px rgba(217,255,59,0.75))" }}
            />
          </svg>
        </>
      )}
      <Sfx s="hit" at={0} volume={0.9} />
      <Sfx s="whoosh" at={38} volume={0.7} />
      <Sfx s="shutter" at={60} volume={0.5} />
      <Sfx s="whoosh-slide" at={78} volume={0.6} />
      <Sfx s="ding" at={82} volume={0.5} />
      {[...Array(18)].map((_, i) => (
        <Sfx key={i} s={(["key-1", "key-2", "key-3", "key-4"] as const)[i % 4]} at={90 + i * 2} volume={0.45} rate={1.25} />
      ))}
      <Sfx s="hit" at={126} volume={0.8} />
      <Sfx s="glitch" at={130} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── EV ASTAPOV: поле промпта → карточка «Я делаю вещи, которые помогают другим [искать/общаться/убираться]» → сетка и «Делаю понятно.» → лаймовый «● Live.» ──
const PROMPT = "Сделай динамичный 15-секундный моушн-ролик, который покажет, какой ты сильный моушн-дизайнер…";
const LIME = "#9BF65F";
export const Ev: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.min(PROMPT.length, Math.max(0, Math.floor((f - 4) * 2.4)));
  const card = spring({ frame: f - 40, fps, config: { damping: 16, stiffness: 120 } });
  const gridP = prog(f, 80, 96);
  const live = prog(f, 114, 128, (t) => t * t);
  const words = ["искать", "общаться", "убираться"];
  const wi = Math.min(2, Math.floor(Math.max(0, f - 48) / 10));
  return (
    <AbsoluteFill style={{ backgroundColor: "#EAE4DC" }}>
      {f < 46 && (
        <div style={{ position: "absolute", left: 240, width: 600, top: 640, padding: "28px 28px 20px", borderRadius: 26, backgroundColor: "#FFFFFF", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", fontFamily: F.onest, opacity: 1 - prog(f, 38, 46) }}>
          <div style={{ fontWeight: 500, fontSize: 27, lineHeight: 1.4, color: "#1A1A1A", minHeight: 170 }}>
            {PROMPT.slice(0, n)}
            <span style={{ display: "inline-block", width: 3, height: 32, marginLeft: 2, verticalAlign: "middle", backgroundColor: "#1A1A1A", opacity: Math.floor(f / 8) % 2 ? 1 : 0 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, fontSize: 24, color: "#777" }}>
            <span>+ &nbsp; Opus 5.5</span>
            <span style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, scale: f >= 36 && f < 40 ? "0.85" : "1" }}>↑</span>
          </div>
        </div>
      )}
      {f >= 40 && f < 100 && (
        <div style={{ position: "absolute", left: 200, width: 680, top: 700, height: 400, borderRadius: 8, backgroundColor: "#FAFAFA", boxShadow: "0 30px 80px rgba(0,0,0,0.15)", opacity: card * (1 - gridP), scale: String(interpolate(card, [0, 1], [0.92, 1])), fontFamily: F.onest, fontWeight: 600, fontSize: 46, lineHeight: 1.2, color: "#111", padding: "64px 50px", boxSizing: "border-box" }}>
          <div>Я делаю вещи,</div>
          <div>которые помогают</div>
          <div style={{ display: "flex", gap: 14 }}>
            другим
            <RollText from={wi === 0 ? "" : words[wi - 1]} to={words[wi]} at={48 + wi * 10} style={{ height: 64, lineHeight: "64px", minWidth: 280, textAlign: "left" }} />
          </div>
          <div style={{ position: "absolute", right: 50, top: 160, width: 64, height: 64, borderRadius: 32, backgroundColor: LIME, scale: String(1 + Math.sin(f * 0.3) * 0.08) }} />
        </div>
      )}
      {f >= 80 && f < 130 && (
        <AbsoluteFill style={{ opacity: gridP * (1 - live) }}>
          {[...Array(7 * 12)].map((_, i) => {
            const c = i % 7, r = Math.floor(i / 7);
            const hot = rnd(i) > 0.86;
            const lime = rnd(i + 3) > 0.94;
            return <div key={i} style={{ position: "absolute", left: 105 + c * 126, top: 200 + r * 126, width: 110, height: 110, borderRadius: 10, backgroundColor: lime ? LIME : hot ? "#D6D6D6" : "#F0F0F0", scale: String(prog(f, 80 + ((c + r) % 10), 90 + ((c + r) % 10))) }} />;
          })}
          <div style={{ position: "absolute", left: 240, width: 600, top: 860, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: F.onest, fontWeight: 700, color: "#111" }}>
            <span style={{ fontSize: 84, backgroundColor: "#F0F0F0", padding: "0 10px" }}>
              <CountUp from={0} to={90} start={88} duration={20} />%
            </span>
            <span style={{ fontSize: 72, backgroundColor: "#F0F0F0", padding: "0 10px", opacity: prog(f, 100, 108) }}>понятно.</span>
          </div>
        </AbsoluteFill>
      )}
      {f >= 114 && (
        <AbsoluteFill style={{ backgroundColor: LIME, clipPath: `circle(${live * 140}% at 50% 50%)`, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: F.onest, fontWeight: 700, fontSize: 128, color: "#111" }}>
            <span style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#FFFFFF", border: "18px solid #FFFFFF", boxShadow: "inset 0 0 0 14px #111", boxSizing: "border-box" }} />
            Live.
          </div>
        </AbsoluteFill>
      )}
      <TypingSfx text={PROMPT.slice(0, 30)} start={4} cps={26} volume={0.5} enter={false} />
      <Sfx s="click" at={37} volume={0.8} />
      <Sfx s="whoosh-soft" at={40} volume={0.6} />
      {[48, 58, 68].map((a) => (
        <Sfx key={a} s="whoosh-slide" at={a} volume={0.5} />
      ))}
      <Sfx s="pop" at={82} volume={0.6} />
      <Sfx s="ding" at={104} volume={0.5} />
      <Sfx s="whoosh" at={116} volume={0.7} />
      <Sfx s="hit" at={124} volume={0.8} />
    </AbsoluteFill>
  );
};
