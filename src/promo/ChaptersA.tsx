// Главы 0–8 промо скилла: каждая — живая версия приёмов одного из разобранных рилсов (reels-breakdown.md).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CardTunnel, CountUp, IPhone, ParticleText, PW, Sfx, ShapeGrid, SplitFlap, StatusBarIOS, TypingInput, TypingSfx, clamp, ease, iosFont, rnd } from "../components";
import { Arrow, C, CX, Glass, Words, mono, prog, ui, usePath, useSpring, wide } from "./kit";

// ── 0. ХУК (Dami, мета-финал): частицы → «ЭТОТ РОЛИК», «— КОД.» ──────────
export const Hook: React.FC = () => {
  const kod = useSpring(26, 12, 150);
  return (
    <AbsoluteFill>
      <ParticleText lines={["ЭТОТ РОЛИК"]} font={wide} weight={900} cx={CX} top={680} maxWidth={660} color={C.cream} accent={C.lime} converge={[0, 20]} crispAt={18} step={4} />
      <div style={{ position: "absolute", left: 120, width: 720, top: 880, textAlign: "center", fontFamily: wide, fontWeight: 900, fontSize: 128, letterSpacing: -5, color: C.lime, opacity: kod, scale: String(interpolate(kod, [0, 1], [1.3, 1])) }}>— КОД.</div>
      <Words text="ни одного кадра в After Effects" at={44} size={31} top={1110} color="rgba(241,236,227,0.8)" weight={700} gap={2} />
      <Sfx s="whoosh-soft" at={2} volume={0.5} />
      <Sfx s="hit" at={18} volume={0.6} />
      <Sfx s="hit" at={26} volume={0.8} />
      <Sfx s="pop-high" at={46} volume={0.4} />
      <Sfx s="whoosh" at={100} volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 1. GRAFIGATOR: кинетическая типографика, «О» превращается в круг, сетка фигур ──
export const Grafigator: React.FC = () => {
  const f = useCurrentFrame();
  const o = prog(f, 30, 48);
  const grid = prog(f, 66, 80);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.lime, opacity: 1 - grid }}>
        <Words text="СЛОВА МЕНЯЮТ" at={0} size={92} top={600} color={C.ink} weight={900} />
        <div style={{ position: "absolute", left: 120, width: 720, top: 820, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: wide, fontWeight: 900, fontSize: 118, letterSpacing: -5, color: C.ink, opacity: prog(f, 14, 22) }}>
          Ф
          <span style={{ display: "inline-block", width: interpolate(o, [0, 1], [86, 160]), height: interpolate(o, [0, 1], [98, 160]), borderRadius: 80, border: `${interpolate(o, [0, 1], [21, 0])}px solid ${C.ink}`, backgroundColor: o > 0.3 ? C.ink : "transparent", margin: "0 6px", position: "relative", flexShrink: 0, boxSizing: "border-box" }}>
            {[...Array(9)].map((_, i) => (
              <span key={i} style={{ position: "absolute", left: 80 - 48 + (i % 3) * 36 - 12, top: 80 - 48 + Math.floor(i / 3) * 36 - 12, width: 24, height: 24, borderRadius: 12, backgroundColor: [C.lime, C.orange, C.cobalt, C.cream][i % 4], scale: String(o) }} />
            ))}
          </span>
          РМУ
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: grid }}>
        <ShapeGrid colors={[C.cream, C.lime, C.orange, C.cobalt]} bg={C.ink} />
        <Words text="ГЕОМЕТРИЯ" at={72} size={78} top={860} color={C.cream} weight={900} plate="rgba(13,13,22,0.85)" />
      </AbsoluteFill>
      <Sfx s="hit" at={0} volume={0.6} />
      <Sfx s="whoosh-slide" at={14} volume={0.5} />
      <Sfx s="pop" at={32} volume={0.6} />
      <Sfx s="whoosh" at={68} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 2. DAMI «Cast»: туннель из карточек-отзывов со счётчиком ─────────────
const REVIEWS = ["Лучший скилл", "Собрал за вечер", "Как в After Effects", "Звук в кадр!", "Без монтажёра", "Вау", "Петля идеальная", "Табло 🔥", "Частицы!", "Сделал рилс", "Шрифты топ", "Повторил ролик"];
export const DamiCast: React.FC = () => {
  return (
    <AbsoluteFill>
      <div data-fit="decor" style={{ position: "absolute", inset: 0 }}>
      <CardTunnel
        count={REVIEWS.length}
        cw={300}
        ch={180}
        speed={60}
        render={(i) => (
          <div style={{ width: "100%", height: "100%", backgroundColor: [C.cream, C.lime, C.white, C.yellow][i % 4], padding: 18, boxSizing: "border-box", fontFamily: ui, color: C.ink }}>
            <div style={{ color: "#F5A623", fontSize: 22 }}>★★★★★</div>
            <div style={{ fontWeight: 800, fontSize: 30, lineHeight: 1.1, marginTop: 6 }}>{REVIEWS[i]}</div>
          </div>
        )}
      />
      </div>
      <div style={{ position: "absolute", left: 120, width: 720, top: 830, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "22px 36px", borderRadius: 36, backgroundColor: "rgba(13,13,22,0.86)", textAlign: "center" }}>
          <CountUp from={0} to={475} start={6} duration={60} style={{ fontFamily: wide, fontWeight: 900, fontSize: 130, color: C.yellow, letterSpacing: -4 }} />
          <div style={{ fontFamily: wide, fontWeight: 700, fontSize: 32, color: C.cream, marginTop: 4 }}>промптов в каталоге</div>
        </div>
      </div>
      <Sfx s="whoosh" at={2} volume={0.45} />
      {[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map((a) => (
        <Sfx key={a} s="key-1" at={8 + a} volume={0.25} rate={1.2 + a / 120} />
      ))}
      <Sfx s="ding" at={68} volume={0.45} />
      <Sfx s="whoosh" at={104} volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 3. «ДУБЛЬ» (Чиковинский): рамка REC, табло, глобус с текстом по орбите ──
export const Dubl: React.FC = () => {
  const f = useCurrentFrame();
  const globe = prog(f, 52, 66);
  const rec = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.red }}>
      {/* видоискатель */}
      {[[150, 300, 1, 1], [810, 300, -1, 1], [150, 1300, 1, -1], [810, 1300, -1, -1]].map(([x, y, sx, sy], i) => (
        <div key={i} style={{ position: "absolute", left: x - (sx < 0 ? 60 : 0), top: y - (sy < 0 ? 60 : 0), width: 60, height: 60, borderColor: C.cream, borderStyle: "solid", borderWidth: 0, borderLeftWidth: sx > 0 ? 6 : 0, borderRightWidth: sx < 0 ? 6 : 0, borderTopWidth: sy > 0 ? 6 : 0, borderBottomWidth: sy < 0 ? 6 : 0 }} />
      ))}
      <div style={{ position: "absolute", left: 190, top: 340, display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.cream }}>
        <span style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: rec ? C.cream : "transparent", border: `3px solid ${C.cream}` }} />
        REC
      </div>
      <div style={{ opacity: 1 - globe }}>
        <div style={{ position: "absolute", left: 120, width: 720, top: 680, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <SplitFlap text="ДУБЛЬ 01" start={4} perChar={2} spin={10} cell={76} bg="#2A0F0E" color={C.cream} />
          <SplitFlap text="МОТОР!" start={18} perChar={2} spin={10} cell={76} bg="#2A0F0E" color={C.yellow} />
        </div>
      </div>
      <div style={{ opacity: globe }}>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <path id="orbitPath" d={`M ${CX - 300} 860 a 300 300 0 1 1 600 0 a 300 300 0 1 1 -600 0`} />
          </defs>
          <circle cx={CX} cy={860} r={230} fill="none" stroke={C.cream} strokeWidth="5" />
          {[0.35, 0.7].map((k) => (
            <ellipse key={k} cx={CX} cy={860} rx={230 * k} ry={230} fill="none" stroke={C.cream} strokeWidth="3" opacity="0.7" transform={`rotate(${f * 0.8} ${CX} 860) `} />
          ))}
          <ellipse cx={CX} cy={860} rx={230} ry={80} fill="none" stroke={C.cream} strokeWidth="3" opacity="0.7" />
          <g transform={`rotate(${f * 1.5} ${CX} 860)`}>
            <text fontFamily={wide} fontWeight={900} fontSize="44" fill={C.cream} letterSpacing="4">
              <textPath href="#orbitPath">МОУШН КОДОМ • МОУШН КОДОМ • МОУШН КОДОМ •</textPath>
            </text>
          </g>
        </svg>
      </div>
      {[...Array(14)].map((_, i) => (
        <Sfx key={i} s={(["key-1", "key-2", "key-3", "key-4"] as const)[i % 4]} at={4 + i * 2} volume={0.22} rate={1.1} />
      ))}
      <Sfx s="shutter" at={38} volume={0.6} />
      <Sfx s="whoosh-slide" at={54} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 4. EV ASTAPOV: белый лист, «/* Hello World */», хаос → сетка, лаймовый вайп «● LIVE» ──
export const Ev: React.FC = () => {
  const f = useCurrentFrame();
  const order = prog(f, 44, 66);
  const wipe = prog(f, 86, 104);
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <div style={{ position: "absolute", left: 120, width: 720, top: 330, fontFamily: mono }}>
        <TypingInput text="/* Hello World */" start={2} cps={26} width={720} size={40} bg="transparent" color="#9A9A9A" accent={C.lime} />
      </div>
      <Words text="Я — СКИЛЛ МОУШНА." at={24} size={62} top={470} color={C.ink} weight={900} />
      {[...Array(16)].map((_, i) => {
        const cx = 160 + (i % 4) * 170, cy = 720 + Math.floor(i / 4) * 170;
        const rx = 140 + rnd(i) * 680, ry = 640 + rnd(i + 3) * 620;
        const x = rx + (cx - rx) * order, y = ry + (cy - ry) * order;
        const kind = i % 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 120, height: 120, borderRadius: kind === 0 ? 60 : kind === 1 ? 16 : 0, backgroundColor: [C.ink, C.lime, "#D9D9D9"][kind], rotate: `${(1 - order) * (rnd(i + 9) * 180 - 90)}deg`, opacity: prog(f, 30 + i, 40 + i) }} />;
      })}
      <AbsoluteFill style={{ backgroundColor: C.lime, clipPath: `circle(${wipe * 150}% at 50% 60%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: wide, fontWeight: 900, fontSize: 120, color: C.ink, marginLeft: -120 }}>
          <span style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: C.ink }} /> LIVE.
        </div>
      </AbsoluteFill>
      <TypingSfx text="/* Hello World */" start={2} cps={26} volume={0.3} enter={false} />
      <Sfx s="pop" at={26} volume={0.5} />
      <Sfx s="whoosh-slide" at={46} volume={0.5} />
      <Sfx s="ding" at={66} volume={0.4} />
      <Sfx s="whoosh" at={88} volume={0.5} />
      <Sfx s="hit" at={100} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 5. RICCARDO (спек-реклама): тёмная сцена, телефон, список с фокус-карточкой, заказ, слово-акцент ──
const PRODUCTS = [
  ["Худи", "4 900 ₽", C.orange],
  ["Кепка", "1 900 ₽", C.lime],
  ["Сумка", "3 500 ₽", C.cobalt],
  ["Кеды", "6 900 ₽", C.pink],
];
export const Riccardo: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 16, 80);
  const focus = Math.min(3, Math.floor(prog(f, 14, 60, (t) => t) * 4));
  const order = f >= 66;
  return (
    <AbsoluteFill>
      <div data-fit="decor" style={{ position: "absolute", inset: 0, perspective: 2000 }}>
        <div style={{ position: "absolute", left: 540 - (PW + 52) / 2, top: 470, translate: `0 ${interpolate(enter, [0, 1], [1200, 0])}px`, scale: "0.76", transformOrigin: "50% 0%" }}>
          <IPhone tiltY={interpolate(enter, [0, 1], [-24, -6]) + Math.sin(f / 24) * 3} tiltX={6}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "#F4F4F6", fontFamily: iosFont }}>
              <StatusBarIOS />
              <div style={{ position: "absolute", top: 100, left: 30, fontWeight: 800, fontSize: 40 }}>Мой магазин</div>
              {PRODUCTS.map(([name, price, col], i) => (
                <div key={name} style={{ position: "absolute", left: 30, right: 30, top: 180 + i * 240, height: 220, borderRadius: 28, backgroundColor: "#fff", display: "flex", alignItems: "center", gap: 24, padding: 22, boxShadow: i === focus ? "0 20px 50px rgba(0,0,0,0.18)" : "none", filter: `blur(${i === focus ? 0 : 5}px)`, scale: i === focus ? "1.04" : "0.97", transition: "none" }}>
                  <div style={{ width: 170, height: 170, borderRadius: 22, backgroundColor: col }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 38 }}>{name}</div>
                    <div style={{ fontWeight: 600, fontSize: 30, color: "#777", marginTop: 6 }}>{price}</div>
                  </div>
                </div>
              ))}
              <div style={{ position: "absolute", left: 30, right: 30, top: 90, height: 96, borderRadius: 24, backgroundColor: "#16A34A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontWeight: 800, fontSize: 32, opacity: order ? 1 : 0, translate: `0 ${order ? 0 : -40}px` }}>
                ✓ Новый заказ · 4 900 ₽
              </div>
            </div>
          </IPhone>
        </div>
      </div>
      <Words text="ПРОДАВАЙ ТО, ЧТО ДЕЛАЕШЬ." at={74} size={58} top={300} highlight={["ДЕЛАЕШЬ", C.lime]} />
      <Sfx s="whoosh" at={0} volume={0.5} />
      {[14, 26, 38, 50].map((a) => (
        <Sfx key={a} s="ui-click" at={a} volume={0.6} />
      ))}
      <Sfx s="ding" at={66} volume={0.6} />
      <Sfx s="pop" at={76} volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 6. DAMI «Tally»: шар-герой с глазами тает в лужу, число уменьшается ──
export const Tally: React.FC = () => {
  const f = useCurrentFrame();
  const melt = prog(f, 40, 70);
  const eyes = prog(f, 12, 20);
  const blink = f % 40 > 36 ? 0.1 : 1;
  const r = 200;
  const squash = interpolate(melt, [0, 1], [1, 0.32]);
  const stretch = interpolate(melt, [0, 1], [1, 1.9]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <Words text="ПЕРСОНАЖИ ОЖИВАЮТ" at={4} size={60} top={320} color={C.ink} weight={900} />
      <div style={{ position: "absolute", left: CX - r * stretch, top: 1000 - r * 2 * squash + r * (1 - squash) * 0.2, width: r * 2 * stretch, height: r * 2 * squash, borderRadius: `${50}% ${50}% ${interpolate(melt, [0, 1], [50, 18])}% ${interpolate(melt, [0, 1], [50, 18])}%`, background: `radial-gradient(circle at 35% 30%, #FF8A50, ${C.orange} 60%, #D9480F)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: "0 30px 60px rgba(255,90,31,0.3)" }}>
        <div style={{ display: "flex", gap: 46, marginBottom: 10, opacity: eyes }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ width: 42, height: 56 * blink * interpolate(melt, [0, 1], [1, 0.6]), borderRadius: 22, backgroundColor: C.white, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div style={{ width: 22, height: 22 * blink, borderRadius: 11, backgroundColor: C.ink, marginBottom: 6 }} />
            </div>
          ))}
        </div>
        <CountUp from={1284} to={412} start={40} duration={30} locale="ru-RU" style={{ fontFamily: wide, fontWeight: 900, fontSize: interpolate(melt, [0, 1], [64, 48]), color: C.white }} />
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: "absolute", left: CX - 160 + i * 64, top: 1000 + interpolate(melt, [0, 1], [-200, 30 + (i % 2) * 20]), width: 26, height: 26, borderRadius: 13, backgroundColor: C.orange, opacity: melt }} />
      ))}
      <Sfx s="pop" at={14} volume={0.6} />
      <Sfx s="whoosh-soft" at={42} volume={0.5} />
      <Sfx s="glitch" at={56} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 7. ЛЕДОВСКИХ: шаг-капсула как поле чата, мяч с приплющиванием, кнопка → плеер, резиновые буквы ──
export const Ledovskikh: React.FC = () => {
  const f = useCurrentFrame();
  const fall = f % 30;
  const by = 700 + Math.min(1, Math.pow(fall / 14, 2)) * 300 - (fall > 14 ? Math.sin(((fall - 14) / 16) * Math.PI) * 220 : 0);
  const squashed = fall >= 13 && fall <= 16;
  const morph = prog(f, 56, 72);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, width: 720, top: 320, fontFamily: ui }}>
        <TypingInput text="① Opus 5.5 в Claude Code" start={2} cps={22} width={720} size={38} bg="rgba(255,255,255,0.12)" color={C.cream} accent={C.orange} label="шаг 1" />
      </div>
      <div style={{ position: "absolute", left: 240 - 70 * (squashed ? 1.25 : 1), top: by - 140 * (squashed ? 0.75 : 1), width: 140 * (squashed ? 1.25 : 1), height: 140 * (squashed ? 0.75 : 1), borderRadius: "50%", backgroundColor: C.orange }} />
      <div style={{ position: "absolute", left: 140, top: 1010, width: 200, height: 6, borderRadius: 3, backgroundColor: "rgba(241,236,227,0.4)" }} />
      <div style={{ position: "absolute", left: interpolate(morph, [0, 1], [460, 400]), top: interpolate(morph, [0, 1], [760, 660]), width: interpolate(morph, [0, 1], [320, 440]), height: interpolate(morph, [0, 1], [110, 300]), borderRadius: interpolate(morph, [0, 1], [55, 30]), backgroundColor: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: wide, fontWeight: 800, fontSize: 34, color: C.ink, overflow: "hidden" }}>
        {morph < 0.5 ? (
          <span style={{ opacity: 1 - morph * 2 }}>▶ Смотреть</span>
        ) : (
          <div style={{ width: "100%", height: "100%", position: "relative", opacity: morph * 2 - 1, background: `linear-gradient(135deg, ${C.violet}, ${C.pink})` }}>
            <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.35)" }}>
              <div style={{ width: `${prog(f, 72, 118, (t) => t) * 100}%`, height: 10, borderRadius: 5, backgroundColor: C.white }} />
            </div>
            <div style={{ position: "absolute", left: "50%", top: "42%", translate: "-50% -50%", fontSize: 70, color: C.white }}>❚❚</div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 120, width: 720, top: 1140, display: "flex", justifyContent: "center", fontFamily: wide, fontWeight: 900, fontSize: 104, color: C.lime, letterSpacing: -3 }}>
        {"РЕЗИНА".split("").map((ch, i) => (
          <span key={i} style={{ display: "inline-block", scale: `${1 + Math.max(0, Math.sin(f * 0.25 - i * 0.7)) * 0.35} ${1 - Math.max(0, Math.sin(f * 0.25 - i * 0.7)) * 0.25}`, transformOrigin: "50% 100%" }}>
            {ch}
          </span>
        ))}
      </div>
      <TypingSfx text="① Opus 5.5 в Claude Code" start={2} cps={22} volume={0.3} />
      {[13, 43, 73, 103].map((a) => (
        <Sfx key={a} s="pop" at={a} volume={0.5} rate={0.8} />
      ))}
      <Sfx s="ui-click" at={56} volume={0.7} />
      <Sfx s="whoosh-slide" at={58} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 8. ЧИНГИЗ: стеклянная карточка GitHub, док иконок, шторка «до/после», кривая Безье ──
export const Chingiz: React.FC = () => {
  const f = useCurrentFrame();
  const split = interpolate(f, [40, 70], [120, 840], { ...clamp, easing: ease });
  const active = Math.min(4, Math.floor(prog(f, 6, 40, (t) => t) * 5));
  const curve = prog(f, 76, 112);
  const t = curve;
  const bx = (u: number) => 3 * (1 - u) * (1 - u) * u * 0.16 + 3 * (1 - u) * u * u * 0.3 + u * u * u;
  const by = (u: number) => 3 * (1 - u) * (1 - u) * u * 1 + 3 * (1 - u) * u * u * 1 + u * u * u;
  const { x: ax, y: ay, press } = usePath([[0, 700, 700], [20, 560, 470], [40, 160, 860], [70, 820, 860]], [22]);
  return (
    <AbsoluteFill>
      <Glass x={120} y={300} w={720} h={170}>
        <div style={{ height: 44, backgroundColor: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", fontFamily: mono, fontSize: 20, color: C.cream }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} /><span style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} /><span style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
          <span style={{ marginLeft: 14 }}>github.com/Sandovich/motion-studio</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 26px", fontFamily: wide, fontWeight: 900, fontSize: 46, color: C.cream }}>
          motion-studio
          <span style={{ padding: "8px 18px", borderRadius: 30, backgroundColor: press > 0 || f > 22 ? C.yellow : "rgba(255,255,255,0.2)", color: C.ink, fontSize: 26, fontWeight: 800 }}>★ Star</span>
        </div>
      </Glass>
      {/* шторка до/после */}
      <div style={{ position: "absolute", left: 120, top: 520, width: 720, height: 420, borderRadius: 28, overflow: "hidden", backgroundColor: "#1B1B26" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 40 + i * 30 + (i === 1 ? 26 : 0), top: 50 + i * 120, width: 420 + (i === 2 ? -90 : 0), height: 80, borderRadius: 14, backgroundColor: "#3A3A4A", rotate: `${[-3, 2, -1][i]}deg` }} />
        ))}
        <div style={{ position: "absolute", left: 0, top: 0, width: split - 120, height: 420, overflow: "hidden", backgroundColor: "#22222F" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 40, top: 50 + i * 120, width: 460, height: 80, borderRadius: 14, backgroundColor: C.mint }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: split - 120 - 3, top: 0, width: 6, height: 420, backgroundColor: C.cream }} />
        <div style={{ position: "absolute", right: 24, top: 18, fontFamily: wide, fontWeight: 800, fontSize: 26, color: "rgba(241,236,227,0.6)" }}>криво</div>
        <div style={{ position: "absolute", left: 24, top: 18, fontFamily: wide, fontWeight: 800, fontSize: 26, color: C.ink, opacity: split > 300 ? 1 : 0 }}>ровно</div>
      </div>
      {/* док */}
      <div style={{ position: "absolute", left: 200, top: 990, width: 560, height: 110, borderRadius: 34, backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {[C.mint, C.cobalt, C.orange, C.violet, C.lime].map((col, i) => (
          <div key={i} style={{ width: 76, height: 76, borderRadius: 20, backgroundColor: col, outline: i === active ? `4px solid ${C.cream}` : "none", outlineOffset: 4, scale: i === active ? "1.12" : "1" }} />
        ))}
      </div>
      {/* кривая Безье ease-out */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M 160 1340 C ${160 + 0.16 * 640} ${1340 - 200}, ${160 + 0.3 * 640} ${1340 - 200}, ${800} ${1140}`} fill="none" stroke={C.cream} strokeWidth="5" strokeDasharray="900" strokeDashoffset={900 * (1 - curve)} opacity="0.85" />
        <circle cx={160 + bx(t) * 640} cy={1340 - by(t) * 200} r="14" fill={C.lime} opacity={curve > 0 ? 1 : 0} />
      </svg>
      <Arrow x={ax} y={ay} press={press} />
      <Sfx s="whoosh-slide" at={0} volume={0.4} />
      <Sfx s="click" at={22} volume={0.7} />
      {[6, 13, 20, 27, 34].map((a) => (
        <Sfx key={a} s="ui-click" at={a} volume={0.5} />
      ))}
      <Sfx s="whoosh-soft" at={42} volume={0.5} />
      <Sfx s="whoosh-slide" at={78} volume={0.45} />
    </AbsoluteFill>
  );
};
