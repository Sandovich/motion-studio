// Vox-коллаж (Sanjar, рилс 13) и saint4ai (DdgAAuFtega) — по опорным кадрам оригиналов.
// Ассеты: здания — фото из общественного достояния (Wikimedia Commons: Detroit Publishing Co. «Flatiron» 1903,
// L.-É. Durandelle «Эйфелева башня» 1888), вырезаны локально U²-Net (scripts/cutout.py); стеклянные 3D-предметы —
// saint4ai/reels-pipline-automotaj (MIT, onAI Academy); спикер — Mixkit (бесплатная лицензия для видео).
import React from "react";
import { Video } from "@remotion/media";
import { Circle as RoughCircle } from "@remotion/rough-notation";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PromptBar, Sfx, rnd } from "../components";
import { CX, F, prog, step } from "./theme";

const torn = (y: number, h: number, seed: number, w = 1080) => {
  const top: string[] = [], bot: string[] = [];
  for (let x = -30; x <= w + 30; x += 18) {
    top.push(`${x},${y + (rnd(seed + x) - 0.5) * 30}`);
    bot.push(`${x},${y + h + (rnd(seed + x * 7) - 0.5) * 30}`);
  }
  return [...top, ...bot.reverse()].join(" ");
};

// ── VOX: тёмная газетная бумага, огромное серифное слово, рваная полоса неба, вырезка-здание поднимается рывками;
//    строка промпта «Смени фон на синий» → небо синеет; «Замени здание» → Flatiron → Эйфелева башня; жёлтая обводка ──
export const Vox: React.FC = () => {
  const f = useCurrentFrame();
  const sf = step(f); // стоп-моушен
  const blue = prog(f, 56, 66);
  const swap = f >= 112;
  const rise = prog(sf, 2, 22, (t) => 1 - Math.pow(1 - t, 3));
  const sky = `rgb(${Math.round(interpolate(blue, [0, 1], [240, 52]))}, ${Math.round(interpolate(blue, [0, 1], [150, 132]))}, ${Math.round(interpolate(blue, [0, 1], [70, 240]))})`;
  const word = f < 30 ? "СМОТРИ" : f < 70 ? "ФОН" : f < 112 ? "ЗДАНИЕ" : "ОДНОЙ ФРАЗОЙ";
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1A18", backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "5px 5px" }}>
      {/* газетные строки на фоне */}
      <div data-fit="decor" style={{ position: "absolute", left: 0, right: 0, top: 120, fontFamily: F.playfair, fontWeight: 900, fontSize: 30, lineHeight: 1.3, color: "rgba(241,236,227,0.07)", padding: "0 40px", whiteSpace: "pre-wrap" }}>
        {"EXTRA · СЕНСАЦИЯ · МОУШН КОДОМ · ВЫПУСК 1903 · ПОСЛЕДНИЕ НОВОСТИ · ".repeat(8)}
      </div>
      {/* огромное слово */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: F.playfair, fontWeight: 900, fontSize: 150, letterSpacing: -4, color: "#F1ECE3", translate: `${(rnd(Math.floor(sf)) - 0.5) * 4}px 0` }}>Коллаж</div>
      {/* рваная полоса неба с облаками и птицами */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="skyclip">
            <polygon points={torn(470, 640, 11)} />
          </clipPath>
        </defs>
        <polygon points={torn(462, 656, 11)} fill="#F4EEE2" />
        <g clipPath="url(#skyclip)">
          <rect x="0" y="420" width="1080" height="760" fill={sky} />
          {[...Array(7)].map((_, i) => (
            <ellipse key={i} cx={(i * 190 + sf * 2) % 1300 - 100} cy={560 + (i % 3) * 70} rx={130} ry={44} fill="rgba(255,255,255,0.85)" />
          ))}
          <circle cx={820} cy={600} r={110} fill="#F2B705" />
          {[...Array(6)].map((_, i) => {
            const bx = 180 + i * 120 + Math.sin((sf + i * 9) / 8) * 20, by = 640 + rnd(i) * 120;
            return <path key={i} d={`M ${bx - 16} ${by} Q ${bx - 8} ${by - 10} ${bx} ${by} Q ${bx + 8} ${by - 10} ${bx + 16} ${by}`} stroke="#2A2A2A" strokeWidth="4" fill="none" />;
          })}
        </g>
      </svg>
      {/* вырезка-здание */}
      <div style={{ position: "absolute", left: CX - 320, top: 520, width: 640, height: 980, translate: `0 ${(1 - rise) * 600}px`, rotate: `${(rnd(Math.floor(sf / 2.5)) - 0.5) * 1.2}deg` }}>
        <Img src={staticFile(swap ? "promo3/eiffel_cut.png" : "promo3/flatiron_cut.png")} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 0 #fff) drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 18px 30px rgba(0,0,0,0.5)) contrast(1.15) saturate(0.6)" }} />
      </div>
      {/* жёлтая рукописная обводка (rough-notation) вокруг верхушки */}
      <div style={{ position: "absolute", left: CX - 150, top: 640 + (1 - rise) * 600 }}>
        <RoughCircle color="#FFD400" strokeWidth={9} progress={prog(f, swap ? 124 : 30, swap ? 140 : 46)} padding={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <div style={{ width: 300, height: 240 }} />
        </RoughCircle>
      </div>
      {/* нижняя рваная полоса бумаги поверх основания */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <polygon points={torn(1240, 700, 29)} fill="#1B1A18" />
        <polygon points={torn(1236, 14, 29)} fill="#F4EEE2" />
      </svg>
      {/* слово-субтитр капсом, как у Sanjar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: F.manrope, fontWeight: 800, fontSize: 40, color: "#FFFFFF", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>{word}</div>
      <PromptBar text="Смени фон на синий" at={34} cps={22} font={F.manrope} x={240} w={600} y={1290} />
      {f >= 82 && <PromptBar text="Замени здание" at={86} cps={22} font={F.manrope} x={240} w={600} y={1290} />}
      <Sfx s="shutter" at={2} volume={0.7} />
      {[6, 10, 14, 18].map((a) => (
        <Sfx key={a} s="pop-high" at={a} volume={0.4} rate={0.8} />
      ))}
      <Sfx s="whoosh-slide" at={30} volume={0.5} />
      <Sfx s="click" at={54} volume={0.8} />
      <Sfx s="whoosh" at={58} volume={0.6} />
      <Sfx s="click" at={104} volume={0.8} />
      <Sfx s="shutter" at={112} volume={0.8} />
      <Sfx s="whoosh-soft" at={124} volume={0.6} />
    </AbsoluteFill>
  );
};

// ── SAINT4AI: тёмная сцена с прожекторами, спикер в карточке снизу, субтитр-капсула; стеклянный подарок → карточки → таймлайн ──
const Obj: React.FC<{ name: string; size: number; style?: React.CSSProperties }> = ({ name, size, style }) => (
  <Img src={staticFile(`promo3/obj/${name}.webp`)} style={{ width: size, height: size, objectFit: "contain", ...style }} />
);
const SUBS: [number, string, string][] = [
  [0, "отдаю вам", "бесплатно"],
  [50, "набор правил и", "приёмов"],
  [100, "нарежет сильные", "куски"],
];
export const Saint: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sub = [...SUBS].reverse().find(([a]) => f >= a)!;
  const gift = spring({ frame: f - 6, fps, config: { damping: 12, stiffness: 120 } });
  const cardsP = prog(f, 48, 56);
  const tl = prog(f, 100, 108);
  const cards: [string, string, number][] = [
    ["62 приёма анимации", "scissors", -1],
    ["дизайн-система", "book", 1],
    ["проверка кадров", "hourglass", -1],
    ["правила монтажа", "comment", 1],
  ];
  return (
    <AbsoluteFill style={{ background: f < 50 ? "radial-gradient(ellipse at 50% 20%, #23262E 0%, #0B0C10 70%)" : f < 100 ? "linear-gradient(180deg, #1E120B 0%, #5A2A12 45%, #E9A16B 100%)" : "linear-gradient(180deg, #0D1513 0%, #142320 100%)" }}>
      {f < 50 &&
        [-1, 0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", left: CX - 160 + k * 300, top: -40, width: 320, height: 1100, background: "linear-gradient(to bottom, rgba(255,255,255,0.32), rgba(255,255,255,0))", clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)", rotate: `${k * 16}deg`, transformOrigin: "50% 0" }} />
        ))}
      {/* заголовок с выделенным словом */}
      <div style={{ position: "absolute", left: 240, width: 600, top: 290, textAlign: "center", fontFamily: F.manrope, fontWeight: 800, fontSize: 50, lineHeight: 1.35, color: "#FFFFFF" }}>
        {f < 50 ? (
          <>
            отдаю вам <span style={{ backgroundColor: "#3DDBB5", color: "#0B2A24", borderRadius: 40, padding: "0 18px" }}>бесплатно</span>
          </>
        ) : f < 100 ? (
          <>
            набор правил и <span style={{ backgroundColor: "#3DDBB5", color: "#0B2A24", borderRadius: 40, padding: "0 18px" }}>приёмов</span>
          </>
        ) : null}
      </div>
      {f < 50 && (
        <>
          <div style={{ position: "absolute", left: CX - 230, top: 400, width: 460, height: 56, borderRadius: 28, border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F.mono, fontSize: 24, color: "#E8E8E8" }}>
            <svg width="26" height="26" viewBox="0 0 16 16" fill="#E8E8E8"><path d="M8 0a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.4.7 0-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 0z" /></svg>
            Sandovich/motion-studio
          </div>
          <div style={{ position: "absolute", left: CX - 220, top: 900, width: 440, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(61,219,181,0.35), transparent 70%)" }} />
          <Obj name="gift-box" size={380} style={{ position: "absolute", left: CX - 190, top: 520 + Math.sin(f / 10) * 12, scale: String(gift), rotate: `${Math.sin(f / 14) * 4}deg` }} />
        </>
      )}
      {f >= 48 && f < 102 &&
        cards.map(([t, icon, dir], i) => {
          const s = spring({ frame: f - 50 - i * 5, fps, config: { damping: 14, stiffness: 130 } });
          return (
            <div key={t} style={{ position: "absolute", left: dir < 0 ? 250 : 290, top: 450 + i * 140, width: 540, height: 108, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.93)", boxShadow: "0 18px 40px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 18, padding: "0 22px", fontFamily: F.manrope, fontWeight: 800, fontSize: 32, color: "#141414", opacity: s * cardsP, translate: `${(1 - s) * dir * 400}px 0`, rotate: `${dir * 1.5}deg` }}>
              <Obj name={icon} size={78} />
              {t}
            </div>
          );
        })}
      {f >= 100 && (
        <div style={{ opacity: tl }}>
          <div style={{ position: "absolute", left: 250, right: 250, top: 330, display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 22, color: "rgba(255,255,255,0.5)" }}>
            <span>00:00</span>
            <span>00:05</span>
            <span>00:10</span>
            <span>00:15</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}>
            <span style={{ padding: "10px 24px", borderRadius: 30, backgroundColor: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.25)", fontFamily: F.manrope, fontWeight: 700, fontSize: 30, color: "#FFFFFF" }}>01 · запись и расшифровка</span>
          </div>
          <div style={{ position: "absolute", left: 200, width: 600, top: 500, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            {["кидаешь", "запись", "подкаст", "расшифрует", "речь"].map((w, i) => (
              <span key={w} style={{ padding: "8px 20px", borderRadius: 24, backgroundColor: "rgba(255,255,255,0.12)", fontFamily: F.manrope, fontWeight: 700, fontSize: 28, color: "#FFFFFF", opacity: prog(f, 104 + i * 4, 110 + i * 4) }}>
                {w}
              </span>
            ))}
          </div>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            {[...Array(64)].map((_, i) => {
              const h = 12 + 110 * Math.abs(Math.sin(i * 0.8 + 0.3) * Math.cos(i * 0.27));
              const x = 140 + i * 12.5;
              return <rect key={i} x={x} y={760 - h / 2} width={7} height={h} rx={3} fill={x < 140 + prog(f, 108, 160) * 800 ? "#3DDBB5" : "rgba(255,255,255,0.3)"} />;
            })}
            <line x1={140 + prog(f, 108, 160) * 800} y1={330} x2={140 + prog(f, 108, 160) * 800} y2={880} stroke="#3DDBB5" strokeWidth="4" />
          </svg>
          <Obj name="mic" size={180} style={{ position: "absolute", left: 800, top: 820, rotate: `${Math.sin(f / 9) * 6}deg` }} />
          <Obj name="scissors" size={150} style={{ position: "absolute", left: 120, top: 840, rotate: `${-20 + Math.sin(f / 7) * 10}deg` }} />
        </div>
      )}
      {/* спикер в карточке снизу + субтитр-капсула над ней */}
      <div data-fit="decor" style={{ position: "absolute", left: CX - 280, top: 1150, width: 560, height: 560, borderRadius: 56, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", border: "3px solid rgba(255,255,255,0.15)" }}>
        <Video src={staticFile("promo3/speaker.mp4")} muted objectFit="cover" style={{ width: 560, height: 560 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center" }}>
        <span style={{ padding: "10px 22px", borderRadius: 30, backgroundColor: "rgba(20,22,26,0.82)", border: "1px solid rgba(255,255,255,0.18)", fontFamily: F.manrope, fontWeight: 700, fontSize: 30, color: "#FFFFFF" }}>
          {sub[1]} <span style={{ textDecoration: "underline", textDecorationColor: "#3DDBB5", textDecorationThickness: 4, textUnderlineOffset: 6 }}>{sub[2]}</span>
        </span>
      </div>
      <Sfx s="whoosh-soft" at={2} volume={0.6} />
      <Sfx s="pop" at={8} volume={0.8} />
      <Sfx s="ding" at={20} volume={0.5} />
      {[50, 55, 60, 65].map((a) => (
        <Sfx key={a} s="whoosh-slide" at={a} volume={0.5} />
      ))}
      <Sfx s="whoosh" at={100} volume={0.6} />
      {[104, 108, 112, 116, 120].map((a) => (
        <Sfx key={a} s="pop-high" at={a} volume={0.45} rate={1.1} />
      ))}
      <Sfx s="shutter" at={130} volume={0.5} />
    </AbsoluteFill>
  );
};
