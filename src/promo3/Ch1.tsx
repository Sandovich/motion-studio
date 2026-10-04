// Хук, Grafigator (рилс 12) и Dami «Cast» (рилс 11) — по опорным кадрам оригиналов.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CardTunnel, CountUp, ParticleText, Sfx, ShapeGrid, rnd } from "../components";
import { CX, F, prog } from "./theme";

const pop = (f: number, at: number, fps: number, d = 12, s = 160) => spring({ frame: f - at, fps, config: { damping: d, stiffness: s } });

// ── ХУК: частицы → «ЭТОТ РОЛИК», «СДЕЛАН КОДОМ» ───────────────────────────
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, 24, fps, 11, 170);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0D16" }}>
      <ParticleText lines={["ЭТОТ РОЛИК"]} font={F.unbounded} weight={900} cx={CX} top={700} maxWidth={600} color="#F1ECE3" accent="#C6F24E" converge={[0, 20]} crispAt={18} step={4} />
      <div style={{ position: "absolute", left: 240, width: 600, top: 870, textAlign: "center", fontFamily: F.unbounded, fontWeight: 900, fontSize: 92, lineHeight: 1, color: "#C6F24E", opacity: s, scale: String(interpolate(s, [0, 1], [1.25, 1])) }}>
        СДЕЛАН
        <br />
        КОДОМ.
      </div>
      <Sfx s="whoosh-soft" at={2} volume={0.6} />
      <Sfx s="hit" at={18} volume={0.6} />
      <Sfx s="hit" at={24} volume={0.9} />
    </AbsoluteFill>
  );
};

// ── GRAFIGATOR: круг с точкой → оранжевая капсула → «ВЕЩИ» на лайме → «М●УШН.» (буква О — круг с точками) → сетка фигур ──
export const Grafigator: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pill = prog(f, 16, 34, (t) => t * t * (3 - 2 * t));
  const veshi = pop(f, 34, fps, 10, 200);
  const o = prog(f, 72, 90);
  const geo = prog(f, 100, 112);
  const bg = f < 34 ? (pill > 0.6 ? "#FF5B1F" : "#0F0F12") : f < 60 ? "#D8FF3C" : f < 100 ? "#FF5B1F" : "#0F0F12";
  const D = interpolate(o, [0, 1], [70, 150]);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {f < 34 && (
        <>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <circle cx={CX} cy={960} r={150} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeDasharray={942} strokeDashoffset={942 * (1 - prog(f, 0, 14))} />
            <circle cx={CX} cy={960} r={10 + Math.sin(f * 0.5) * 2} fill="#fff" />
          </svg>
          <div style={{ position: "absolute", left: CX - interpolate(pill, [0, 0.6, 1], [0, 330, 700]), top: 960 - interpolate(pill, [0, 0.6, 1], [0, 110, 1100]), width: interpolate(pill, [0, 0.6, 1], [0, 660, 1400]), height: interpolate(pill, [0, 0.6, 1], [0, 220, 2200]), borderRadius: interpolate(pill, [0, 0.7, 1], [110, 110, 0]), backgroundColor: "#FF5B1F" }} />
        </>
      )}
      {f >= 34 && f < 60 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: F.geologica, fontWeight: 900, fontSize: 172, letterSpacing: -8, color: "#0F0F12", scale: String(interpolate(veshi, [0, 1], [1.35, 1])), opacity: veshi }}>
          ВЕЩИ
        </div>
      )}
      {f >= 60 && f < 100 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, translate: "0 -50%", display: "flex", justifyContent: "center", alignItems: "center", gap: interpolate(o, [0, 1], [0, 18]), fontFamily: F.geologica, fontWeight: 900, fontSize: 100, letterSpacing: -5, color: "#0F0F12", opacity: prog(f, 60, 66) }}>
          <span style={{ translate: `${interpolate(o, [0, 1], [0, -10])}px 0` }}>М</span>
          <span style={{ width: D, height: D * (o > 0 ? 1 : 1.12), borderRadius: "50%", border: `${interpolate(o, [0, 1], [18, 0])}px solid #0F0F12`, backgroundColor: o > 0.25 ? "#0F0F12" : "transparent", position: "relative", flexShrink: 0, boxSizing: "border-box" }}>
            {[...Array(9)].map((_, i) => (
              <span key={i} style={{ position: "absolute", left: D / 2 - 48 + (i % 3) * 36 - 13, top: D / 2 - 48 + Math.floor(i / 3) * 36 - 13, width: 26, height: 26, borderRadius: 13, backgroundColor: ["#D8FF3C", "#FFFFFF", "#4646FF", "#FF5B1F"][(i * 3) % 4], scale: String(prog(f, 76 + i, 84 + i)) }} />
            ))}
          </span>
          <span style={{ translate: `${interpolate(o, [0, 1], [0, 10])}px 0` }}>УШН.</span>
        </div>
      )}
      {f >= 100 && (
        <AbsoluteFill style={{ opacity: geo }}>
          <ShapeGrid colors={["#F1ECE3", "#D8FF3C", "#FF5B1F", "#4646FF"]} bg="#0F0F12" step={120} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}><div style={{ padding: "16px 34px", borderRadius: 24, backgroundColor: "#0F0F12", fontFamily: F.geologica, fontWeight: 900, fontSize: 96, letterSpacing: -4, color: "#F1ECE3" }}>
            ФОРМА.
          </div></div>
        </AbsoluteFill>
      )}
      <Sfx s="ui-click" at={2} volume={0.6} />
      <Sfx s="whoosh" at={22} volume={0.7} />
      <Sfx s="hit" at={34} volume={0.9} />
      <Sfx s="whoosh-slide" at={60} volume={0.6} />
      <Sfx s="pop" at={74} volume={0.8} />
      {[0, 2, 4, 6, 8].map((d) => (
        <Sfx key={d} s="pop-high" at={78 + d} volume={0.4} rate={1 + d * 0.06} />
      ))}
      <Sfx s="whoosh" at={100} volume={0.6} />
      <Sfx s="hit" at={108} volume={0.7} />
    </AbsoluteFill>
  );
};

// ── Персонажи Dami: круглые головы, глаза-точки, румянец, у каждого свои волосы и одежда ──
const Person: React.FC<{ kind: 0 | 1 | 2; size: number; blink?: boolean }> = ({ kind, size, blink }) => {
  const skin = ["#F7D3B5", "#9A6243", "#F2C4A0"][kind];
  const shirt = ["#FF4FA3", "#C6F24E", "#FF8A1F"][kind];
  const eyeH = blink ? 2 : 10;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 200 230">
      <path d="M20 230 Q20 150 100 150 Q180 150 180 230 Z" fill={shirt} />
      {kind === 0 && <circle cx="100" cy="28" r="26" fill="#6B3FA0" />}
      {kind === 2 && [...Array(10)].map((_, i) => <circle key={i} cx={100 + Math.cos((i / 10) * Math.PI * 2) * 62} cy={88 + Math.sin((i / 10) * Math.PI * 2) * 56 - 6} r="26" fill="#B5502A" />)}
      <circle cx="100" cy="92" r="62" fill={skin} />
      {kind === 0 && <path d="M38 88 Q40 30 100 30 Q160 30 162 88 Q150 52 100 52 Q50 52 38 88 Z" fill="#6B3FA0" />}
      {kind === 1 && (
        <>
          <path d="M40 80 Q44 32 100 32 Q156 32 160 80 Z" fill="#1E1A1A" />
          <rect x="38" y="62" width="124" height="16" rx="8" fill="#2ECC71" />
        </>
      )}
      <ellipse cx="78" cy="96" rx="7" ry={eyeH} fill="#1E1A1A" />
      <ellipse cx="122" cy="96" rx="7" ry={eyeH} fill="#1E1A1A" />
      <circle cx="66" cy="116" r="9" fill="#FF8FA3" opacity="0.6" />
      <circle cx="134" cy="116" r="9" fill="#FF8FA3" opacity="0.6" />
      <path d="M86 122 Q100 134 114 122" stroke="#1E1A1A" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

const REVIEWS = ["Собрал за вечер", "Как в After Effects", "Звук в кадр", "Без монтажёра", "Вау!", "Петля идеальная", "Шрифты топ", "Повторил рилс", "Табло огонь", "Частицы!", "Наконец-то", "Сам бы не сделал"];
// ── DAMI «Cast»: частицы → «ТВОИ КЛИЕНТЫ — 3» + персонажи → туннель отзывов со счётчиком → комната в перспективе ──
export const Dami: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const three = pop(f, 30, fps, 10, 180);
  const tunnel = prog(f, 54, 62);
  const room = prog(f, 108, 120);
  const blink = f % 36 > 33;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 20% 15%, #FF4FD8 0%, transparent 45%), radial-gradient(circle at 85% 70%, #2B5BFF 0%, transparent 50%), linear-gradient(160deg, #5B2BFF, #9B2BFF 50%, #FF3E9A)" }}>
      {f < 60 && (
        <>
          <ParticleText lines={["ТВОИ КЛИЕНТЫ"]} font={F.rubik} weight={900} cx={CX} top={600} maxWidth={600} color="#FFFFFF" accent="#FFE14D" converge={[0, 22]} crispAt={20} step={4} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: F.rubik, fontWeight: 900, fontSize: 210, color: "#FFE14D", opacity: three, scale: String(interpolate(three, [0, 1], [1.6, 1])), textShadow: "0 10px 40px rgba(0,0,0,0.25)" }}>3</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 10 }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ translate: `0 ${(1 - pop(f, 38 + k * 4, fps)) * 300}px` }}>
                <Person kind={k as 0 | 1 | 2} size={180} blink={blink} />
              </div>
            ))}
          </div>
        </>
      )}
      {f >= 54 && f < 120 && (
        <AbsoluteFill style={{ opacity: tunnel * (1 - room) }}>
          <div data-fit="decor" style={{ position: "absolute", inset: 0 }}>
            <CardTunnel
              count={REVIEWS.length}
              cw={300}
              ch={170}
              speed={80}
              render={(i) => (
                <div style={{ width: "100%", height: "100%", backgroundColor: ["#FFFFFF", "#FFE14D", "#C6F24E", "#FFFFFF"][i % 4], padding: 16, boxSizing: "border-box", fontFamily: F.rubik, color: "#1E1A1A" }}>
                  <div style={{ color: "#FF9A00", fontSize: 20 }}>★★★★★</div>
                  <div style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>{REVIEWS[i]}</div>
                  <div style={{ marginTop: 10, height: 8, width: `${50 + rnd(i) * 40}%`, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.12)" }} />
                </div>
              )}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontFamily: F.rubik, fontWeight: 900, fontSize: 80, lineHeight: 1.05, color: "#FFFFFF", textShadow: "0 6px 30px rgba(0,0,0,0.45)" }}>
            НЕ <CountUp from={0} to={10000} start={58} duration={40} style={{ color: "#FFE14D" }} />
            <br />
            ПРАВОК
          </div>
        </AbsoluteFill>
      )}
      {f >= 108 && (
        <AbsoluteFill style={{ opacity: room }}>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <polygon points="0,0 380,700 380,1150 0,1920" fill="#FF3E9A" />
            <polygon points="1080,0 700,700 700,1150 1080,1920" fill="#FF8A1F" />
            <polygon points="0,0 1080,0 700,700 380,700" fill="#3B2BB0" />
            <rect x="380" y="700" width="320" height="450" fill="#C6F24E" />
            <polygon points="0,1920 380,1150 700,1150 1080,1920" fill="#241A5C" />
            {[...Array(9)].map((_, i) => (
              <line key={i} x1={380 + (i * 320) / 8} y1={1150} x2={(i * 1080) / 8} y2={1920} stroke="#5A4FD0" strokeWidth="3" />
            ))}
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: F.rubik, fontWeight: 900, fontSize: 68, color: "#FFFFFF", textShadow: "0 6px 30px rgba(0,0,0,0.35)", scale: String(pop(f, 112, fps)) }}>ОДИН ПРОМПТ.</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", gap: 10 }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ translate: `0 ${(1 - pop(f, 114 + k * 3, fps)) * 300}px` }}>
                <Person kind={k as 0 | 1 | 2} size={190} blink={blink} />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
      <Sfx s="whoosh-soft" at={2} volume={0.6} />
      <Sfx s="hit" at={30} volume={0.8} />
      {[38, 42, 46].map((a) => (
        <Sfx key={a} s="pop" at={a} volume={0.7} rate={0.9 + (a - 38) / 30} />
      ))}
      <Sfx s="whoosh" at={56} volume={0.7} />
      {[60, 66, 72, 78, 84, 90, 96].map((a) => (
        <Sfx key={a} s="key-2" at={a} volume={0.4} rate={1.3} />
      ))}
      <Sfx s="glitch" at={106} volume={0.5} />
      <Sfx s="hit" at={112} volume={0.8} />
      {[114, 117, 120].map((a) => (
        <Sfx key={a} s="pop-high" at={a} volume={0.6} />
      ))}
    </AbsoluteFill>
  );
};
