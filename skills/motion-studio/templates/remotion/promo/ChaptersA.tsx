// Главы 0–8 промо скилла — живые версии приёмов из разобранных рилсов. Вёрстка: всё по центру кадра (CX = 540),
// текст в колонке 600 px (L = 240), заголовки подгоняет fitText (kit.tsx).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CardTunnel, CountUp, IPhone, ParticleText, PW, Sfx, ShapeGrid, SplitFlap, StatusBarIOS, TypingInput, TypingSfx, clamp, iosFont, rnd } from "../components";
import { Arrow, C, CX, Center, Glass, L, Title, W, Words, mono, prog, ui, usePath, useSpring, wide } from "./kit";

// ── 0. ХУК (Dami, мета-финал): частицы → «ЭТОТ РОЛИК», «— КОД.» ──────────
export const Hook: React.FC = () => (
  <AbsoluteFill>
    <ParticleText lines={["ЭТОТ РОЛИК"]} font={wide} weight={900} cx={CX} top={690} maxWidth={W} color={C.cream} accent={C.lime} converge={[0, 20]} crispAt={18} step={4} />
    <Title text="— КОД." top={850} max={150} color={C.lime} at={26} />
    <Words text="ни одного кадра в After Effects" at={44} size={32} top={1060} color="rgba(241,236,227,0.8)" weight={700} gap={2} />
    <Sfx s="whoosh-soft" at={2} volume={0.5} />
    <Sfx s="hit" at={18} volume={0.6} />
    <Sfx s="hit" at={26} volume={0.8} />
    <Sfx s="pop-high" at={46} volume={0.4} />
  </AbsoluteFill>
);

// ── 1. GRAFIGATOR: «СЛОВА МЕНЯЮТ / Ф●РМУ» — буква «О» становится кругом; сетка фигур ──
export const Grafigator: React.FC = () => {
  const f = useCurrentFrame();
  const o = prog(f, 30, 48);
  const grid = prog(f, 66, 80);
  const D = interpolate(o, [0, 1], [84, 130]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.lime, opacity: 1 - grid }}>
        <Title text="СЛОВА МЕНЯЮТ" top={640} max={96} color={C.ink} />
        <Center top={790} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontFamily: wide, fontWeight: 900, fontSize: 104, lineHeight: 1, color: C.ink, opacity: prog(f, 14, 22) }}>
          <span>Ф</span>
          <span style={{ width: D, height: D, borderRadius: "50%", border: `${interpolate(o, [0, 1], [20, 0])}px solid ${C.ink}`, backgroundColor: o > 0.3 ? C.ink : "transparent", position: "relative", flexShrink: 0, boxSizing: "border-box" }}>
            {[...Array(9)].map((_, i) => (
              <span key={i} style={{ position: "absolute", left: D / 2 - 48 + (i % 3) * 36 - 12, top: D / 2 - 48 + Math.floor(i / 3) * 36 - 12, width: 24, height: 24, borderRadius: 12, backgroundColor: [C.lime, C.orange, C.cobalt, C.cream][i % 4], scale: String(o) }} />
            ))}
          </span>
          <span>РМУ</span>
        </Center>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: grid }}>
        <ShapeGrid colors={[C.cream, C.lime, C.orange, C.cobalt]} bg={C.ink} />
        <Words text="ГЕОМЕТРИЯ" at={72} size={80} top={880} color={C.cream} weight={900} plate="rgba(13,13,22,0.88)" />
      </AbsoluteFill>
      <Sfx s="hit" at={0} volume={0.6} />
      <Sfx s="whoosh-slide" at={14} volume={0.5} />
      <Sfx s="pop" at={32} volume={0.6} />
      <Sfx s="whoosh" at={68} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 2. DAMI «Cast»: туннель карточек-отзывов со счётчиком по центру ───────
const REVIEWS = ["Лучший скилл", "Собрал за вечер", "Как в After Effects", "Звук в кадр!", "Без монтажёра", "Вау", "Петля идеальная", "Табло огонь", "Частицы!", "Сделал рилс", "Шрифты топ", "Повторил ролик"];
export const DamiCast: React.FC = () => (
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
            <div style={{ fontWeight: 800, fontSize: 28, lineHeight: 1.1, marginTop: 6 }}>{REVIEWS[i]}</div>
          </div>
        )}
      />
    </div>
    <Center top={820} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "22px 40px", borderRadius: 36, backgroundColor: "rgba(13,13,22,0.88)", textAlign: "center" }}>
        <CountUp from={0} to={475} start={6} duration={60} style={{ fontFamily: wide, fontWeight: 900, fontSize: 124, color: C.yellow, letterSpacing: -4 }} />
        <div style={{ fontFamily: wide, fontWeight: 700, fontSize: 30, color: C.cream, marginTop: 4 }}>промптов в каталоге</div>
      </div>
    </Center>
    <Sfx s="whoosh" at={2} volume={0.45} />
    {[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map((a) => (
      <Sfx key={a} s="key-1" at={8 + a} volume={0.25} rate={1.2 + a / 120} />
    ))}
    <Sfx s="ding" at={68} volume={0.45} />
  </AbsoluteFill>
);

// ── 3. «ДУБЛЬ»: видоискатель REC, табло, глобус с текстом по орбите ────────
export const Dubl: React.FC = () => {
  const f = useCurrentFrame();
  const globe = prog(f, 52, 66);
  const rec = Math.floor(f / 15) % 2 === 0;
  const GY = 900;
  return (
    <AbsoluteFill style={{ backgroundColor: C.red }}>
      {[[200, 300, 1, 1], [880, 300, -1, 1], [200, 1380, 1, -1], [880, 1380, -1, -1]].map(([x, y, sx, sy], i) => (
        <div key={i} style={{ position: "absolute", left: x - (sx < 0 ? 64 : 0), top: y - (sy < 0 ? 64 : 0), width: 64, height: 64, borderColor: C.cream, borderStyle: "solid", borderWidth: 0, borderLeftWidth: sx > 0 ? 6 : 0, borderRightWidth: sx < 0 ? 6 : 0, borderTopWidth: sy > 0 ? 6 : 0, borderBottomWidth: sy < 0 ? 6 : 0 }} />
      ))}
      <div style={{ position: "absolute", left: 240, top: 340, display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.cream }}>
        <span style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: rec ? C.cream : "transparent", border: `3px solid ${C.cream}` }} />
        REC
      </div>
      <AbsoluteFill style={{ opacity: 1 - globe, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
        <SplitFlap text="ДУБЛЬ 01" start={4} perChar={2} spin={10} cell={62} bg="#2A0F0E" color={C.cream} />
        <SplitFlap text="МОТОР!" start={18} perChar={2} spin={10} cell={62} bg="#2A0F0E" color={C.yellow} />
      </AbsoluteFill>
      <div style={{ opacity: globe }}>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <path id="orbitPath" d={`M ${CX - 250} ${GY} a 250 250 0 1 1 500 0 a 250 250 0 1 1 -500 0`} />
          </defs>
          <circle cx={CX} cy={GY} r={190} fill="none" stroke={C.cream} strokeWidth="5" />
          {[0.35, 0.7].map((k) => (
            <ellipse key={k} cx={CX} cy={GY} rx={190 * k} ry={190} fill="none" stroke={C.cream} strokeWidth="3" opacity="0.7" transform={`rotate(${f * 0.8} ${CX} ${GY})`} />
          ))}
          <ellipse cx={CX} cy={GY} rx={190} ry={66} fill="none" stroke={C.cream} strokeWidth="3" opacity="0.7" />
          <g transform={`rotate(${f * 1.5} ${CX} ${GY})`}>
            <text fontFamily={wide} fontWeight={900} fontSize="34" fill={C.cream} letterSpacing="3">
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

// ── 4. EV ASTAPOV: белый лист, «/* Hello World */», хаос → ровная сетка, лаймовый вайп «● LIVE» ──
export const Ev: React.FC = () => {
  const f = useCurrentFrame();
  const order = prog(f, 44, 66);
  const wipe = prog(f, 86, 104);
  const cell = 150, gx = CX - (cell * 4) / 2 + (cell - 116) / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <Center top={340} style={{ fontFamily: mono, display: "flex", justifyContent: "center" }}>
        <TypingInput text="/* Hello World */" start={2} cps={26} width={460} size={36} bg="transparent" color="#9A9A9A" accent={C.lime} />
      </Center>
      <Words text="Я — СКИЛЛ МОУШНА." at={24} size={60} top={470} color={C.ink} weight={900} />
      {[...Array(16)].map((_, i) => {
        const tx = gx + (i % 4) * cell, ty = 720 + Math.floor(i / 4) * cell;
        const rx = 240 + rnd(i) * 520, ry = 680 + rnd(i + 3) * 520;
        const x = rx + (tx - rx) * order, y = ry + (ty - ry) * order;
        const kind = i % 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 116, height: 116, borderRadius: kind === 0 ? 58 : kind === 1 ? 16 : 0, backgroundColor: [C.ink, C.lime, "#D9D9D9"][kind], rotate: `${(1 - order) * (rnd(i + 9) * 180 - 90)}deg`, opacity: prog(f, 30 + i, 40 + i) }} />;
      })}
      <AbsoluteFill style={{ backgroundColor: C.lime, clipPath: `circle(${wipe * 150}% at 50% 60%)`, alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontFamily: wide, fontWeight: 900, fontSize: 116, color: C.ink }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.ink }} /> LIVE.
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

// ── 5. RICCARDO (спек-реклама): заголовок сверху, телефон по центру, фокус-карточка, заказ ──
const PRODUCTS: [string, string, string][] = [
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
      <Words text="ПРОДАВАЙ ТО, ЧТО ДЕЛАЕШЬ." at={70} size={56} top={290} highlight={["ДЕЛАЕШЬ", C.lime]} />
      <div data-fit="decor" style={{ position: "absolute", inset: 0, perspective: 2000 }}>
        <div style={{ position: "absolute", left: CX - (PW + 52) / 2, top: 470, translate: `0 ${interpolate(enter, [0, 1], [1200, 0])}px`, scale: "0.76", transformOrigin: "50% 0%" }}>
          <IPhone tiltY={interpolate(enter, [0, 1], [-24, 0]) + Math.sin(f / 24) * 3} tiltX={6}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "#F4F4F6", fontFamily: iosFont }}>
              <StatusBarIOS />
              <div style={{ position: "absolute", top: 100, left: 30, fontWeight: 800, fontSize: 40 }}>Мой магазин</div>
              {PRODUCTS.map(([name, price, col], i) => (
                <div key={name} style={{ position: "absolute", left: 30, right: 30, top: 180 + i * 240, height: 220, borderRadius: 28, backgroundColor: "#fff", display: "flex", alignItems: "center", gap: 24, padding: 22, boxShadow: i === focus ? "0 20px 50px rgba(0,0,0,0.18)" : "none", filter: `blur(${i === focus ? 0 : 5}px)`, scale: i === focus ? "1.04" : "0.97" }}>
                  <div style={{ width: 170, height: 170, borderRadius: 22, backgroundColor: col }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 38 }}>{name}</div>
                    <div style={{ fontWeight: 600, fontSize: 30, color: "#777", marginTop: 6 }}>{price}</div>
                  </div>
                </div>
              ))}
              <div style={{ position: "absolute", left: 30, right: 30, top: 90, height: 96, borderRadius: 24, backgroundColor: "#16A34A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 32, opacity: order ? 1 : 0, translate: `0 ${order ? 0 : -40}px` }}>
                ✓ Новый заказ · 4 900 ₽
              </div>
            </div>
          </IPhone>
        </div>
      </div>
      <Sfx s="whoosh" at={0} volume={0.5} />
      {[14, 26, 38, 50].map((a) => (
        <Sfx key={a} s="ui-click" at={a} volume={0.6} />
      ))}
      <Sfx s="ding" at={66} volume={0.6} />
      <Sfx s="pop" at={72} volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 6. DAMI «Tally»: шар-герой с глазами тает в лужу, число уменьшается ──
export const Tally: React.FC = () => {
  const f = useCurrentFrame();
  const melt = prog(f, 40, 70);
  const eyes = prog(f, 12, 20);
  const blink = f % 40 > 36 ? 0.1 : 1;
  const r = 190;
  const squash = interpolate(melt, [0, 1], [1, 0.32]);
  const stretch = interpolate(melt, [0, 1], [1, 1.9]);
  const floor = 1080;
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <Title text="ПЕРСОНАЖИ" top={330} max={88} color={C.ink} at={2} />
      <Title text="ОЖИВАЮТ" top={430} max={88} color={C.orange} at={8} />
      <div style={{ position: "absolute", left: CX - r * stretch, top: floor - r * 2 * squash, width: r * 2 * stretch, height: r * 2 * squash, borderRadius: `50% 50% ${interpolate(melt, [0, 1], [50, 18])}% ${interpolate(melt, [0, 1], [50, 18])}%`, background: `radial-gradient(circle at 35% 30%, #FF8A50, ${C.orange} 60%, #D9480F)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: "0 30px 60px rgba(255,90,31,0.3)" }}>
        <div style={{ display: "flex", gap: 46, marginBottom: 10, opacity: eyes }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ width: 42, height: 56 * blink * interpolate(melt, [0, 1], [1, 0.6]), borderRadius: 22, backgroundColor: C.white, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div style={{ width: 22, height: 22 * blink, borderRadius: 11, backgroundColor: C.ink, marginBottom: 6 }} />
            </div>
          ))}
        </div>
        <CountUp from={1284} to={412} start={40} duration={30} locale="ru-RU" style={{ fontFamily: wide, fontWeight: 900, fontSize: interpolate(melt, [0, 1], [60, 46]), color: C.white }} />
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: "absolute", left: CX - 170 + i * 64, top: floor + interpolate(melt, [0, 1], [-200, 20 + (i % 2) * 20]), width: 26, height: 26, borderRadius: 13, backgroundColor: C.orange, opacity: melt }} />
      ))}
      <Sfx s="pop" at={14} volume={0.6} />
      <Sfx s="whoosh-soft" at={42} volume={0.5} />
      <Sfx s="glitch" at={56} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 7. ЛЕДОВСКИХ: поле чата с печатью, мяч со сплющиванием, кнопка → плеер, резиновые буквы ──
export const Ledovskikh: React.FC = () => {
  const f = useCurrentFrame();
  const fall = f % 30;
  const ground = 980;
  const by = ground - 260 + Math.min(1, Math.pow(fall / 14, 2)) * 260 - (fall > 14 ? Math.sin(((fall - 14) / 16) * Math.PI) * 220 : 0);
  const sq = fall >= 13 && fall <= 16;
  const morph = prog(f, 56, 72);
  const bw = interpolate(morph, [0, 1], [250, 280]), bh = interpolate(morph, [0, 1], [96, 240]);
  return (
    <AbsoluteFill>
      <Center top={320} style={{ fontFamily: ui, display: "flex", justifyContent: "center" }}>
        <TypingInput text="① Opus 5.5 в Claude Code" start={2} cps={22} width={W} size={34} bg="rgba(255,255,255,0.12)" color={C.cream} accent={C.orange} label="шаг 1" />
      </Center>
      {/* мяч слева, кнопка/плеер справа — симметрично относительно центра */}
      <div style={{ position: "absolute", left: 380 - 60 * (sq ? 1.25 : 1), top: by - 120 * (sq ? 0.75 : 1), width: 120 * (sq ? 1.25 : 1), height: 120 * (sq ? 0.75 : 1), borderRadius: "50%", backgroundColor: C.orange }} />
      <div style={{ position: "absolute", left: 300, top: ground, width: 160, height: 6, borderRadius: 3, backgroundColor: "rgba(241,236,227,0.4)" }} />
      <div style={{ position: "absolute", left: 690 - bw / 2, top: ground - bh, width: bw, height: bh, borderRadius: interpolate(morph, [0, 1], [52, 28]), backgroundColor: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: wide, fontWeight: 800, fontSize: 28, color: C.ink, overflow: "hidden" }}>
        {morph < 0.5 ? (
          <span style={{ opacity: 1 - morph * 2 }}>▶ Смотреть</span>
        ) : (
          <div style={{ width: "100%", height: "100%", position: "relative", opacity: morph * 2 - 1, background: `linear-gradient(135deg, ${C.violet}, ${C.pink})` }}>
            <div style={{ position: "absolute", left: 28, right: 28, bottom: 26, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.35)" }}>
              <div style={{ width: `${prog(f, 72, 118, (t) => t) * 100}%`, height: 10, borderRadius: 5, backgroundColor: C.white }} />
            </div>
            <div style={{ position: "absolute", left: "50%", top: "44%", translate: "-50% -50%", fontSize: 60, color: C.white }}>❚❚</div>
          </div>
        )}
      </div>
      <Center top={1130} style={{ display: "flex", justifyContent: "center", fontFamily: wide, fontWeight: 900, fontSize: 104, color: C.lime }}>
        {"РЕЗИНА".split("").map((ch, i) => (
          <span key={i} style={{ display: "inline-block", scale: `${1 + Math.max(0, Math.sin(f * 0.25 - i * 0.7)) * 0.3} ${1 - Math.max(0, Math.sin(f * 0.25 - i * 0.7)) * 0.22}`, transformOrigin: "50% 100%" }}>
            {ch}
          </span>
        ))}
      </Center>
      <TypingSfx text="① Opus 5.5 в Claude Code" start={2} cps={22} volume={0.3} />
      {[13, 43, 73, 103].map((a) => (
        <Sfx key={a} s="pop" at={a} volume={0.5} rate={0.8} />
      ))}
      <Sfx s="ui-click" at={56} volume={0.7} />
      <Sfx s="whoosh-slide" at={58} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 8. ЧИНГИЗ: карточка GitHub, шторка «до/после», док, кривая Безье ─────
export const Chingiz: React.FC = () => {
  const f = useCurrentFrame();
  const BX = L, BW = W;
  const split = interpolate(f, [40, 70], [0, BW], { ...clamp });
  const active = Math.min(4, Math.floor(prog(f, 6, 40, (t) => t) * 5));
  const curve = prog(f, 76, 112);
  const bx = (u: number) => 3 * (1 - u) * (1 - u) * u * 0.16 + 3 * (1 - u) * u * u * 0.3 + u * u * u;
  const by = (u: number) => 3 * (1 - u) * (1 - u) * u + 3 * (1 - u) * u * u + u * u * u;
  const { x: ax, y: ay, press } = usePath([[0, 700, 760], [18, 760, 400], [36, 760, 400]], [22]);
  return (
    <AbsoluteFill>
      <Glass y={300} h={170}>
        <div style={{ height: 44, backgroundColor: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", fontFamily: mono, fontSize: 18, color: C.cream }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} /><span style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} /><span style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
          <span style={{ marginLeft: 12 }}>github.com/Sandovich/motion-studio</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 26px", fontFamily: wide, fontWeight: 900, fontSize: 42, color: C.cream }}>
          motion-studio
          <span style={{ padding: "8px 18px", borderRadius: 30, backgroundColor: f > 22 ? C.yellow : "rgba(255,255,255,0.2)", color: C.ink, fontSize: 24, fontWeight: 800 }}>★ Star</span>
        </div>
      </Glass>
      <div style={{ position: "absolute", left: BX, top: 520, width: BW, height: 380, borderRadius: 28, overflow: "hidden", backgroundColor: "#1B1B26" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 40 + [0, 34, 12][i], top: 60 + i * 105, width: 400 - [0, 60, 110][i], height: 70, borderRadius: 14, backgroundColor: "#3A3A4A", rotate: `${[-3, 2, -1][i]}deg` }} />
        ))}
        <div style={{ position: "absolute", left: 0, top: 0, width: split, height: 380, overflow: "hidden", backgroundColor: "#22222F" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 40, top: 60 + i * 105, width: 420, height: 70, borderRadius: 14, backgroundColor: C.mint }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: split - 3, top: 0, width: 6, height: 380, backgroundColor: C.cream }} />
        <div style={{ position: "absolute", right: 22, top: 14, fontFamily: wide, fontWeight: 800, fontSize: 24, color: "rgba(241,236,227,0.6)", opacity: split < BW - 140 ? 1 : 0 }}>криво</div>
        <div style={{ position: "absolute", left: 22, top: 14, fontFamily: wide, fontWeight: 800, fontSize: 24, color: C.ink, opacity: split > 160 ? 1 : 0 }}>ровно</div>
      </div>
      <Center top={950} h={110} style={{ borderRadius: 34, backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {[C.mint, C.cobalt, C.orange, C.violet, C.lime].map((col, i) => (
          <div key={i} style={{ width: 76, height: 76, borderRadius: 20, backgroundColor: col, outline: i === active ? `4px solid ${C.cream}` : "none", outlineOffset: 4, scale: i === active ? "1.12" : "1" }} />
        ))}
      </Center>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${L} 1330 C ${L + 0.16 * W} 1130, ${L + 0.3 * W} 1130, ${L + W} 1130`} fill="none" stroke={C.cream} strokeWidth="5" strokeDasharray="900" strokeDashoffset={900 * (1 - curve)} opacity="0.85" />
        <circle cx={L + bx(curve) * W} cy={1330 - by(curve) * 200} r="14" fill={C.lime} opacity={curve > 0 ? 1 : 0} />
      </svg>
      {f < 40 && <Arrow x={ax} y={ay} press={press} />}
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
