// Промо скилла motion-studio — 1080×1920, 30 fps, 120 BPM (удар = 15 кадров), ~42 с, без голоса.
// Показывает, что умеет скилл, живыми версиями приёмов из 12 разобранных рилсов (reels-breakdown.md):
// типографика в бит и геометрия (Grafigator), частицы, 3D-туннель и перемотка (Dami), табло («Дубль»),
// интерфейсы, iPhone, звук в кадр, проверка безопасных зон, фрагменты наших настоящих роликов.
import React from "react";
import { loadFont as loadWide } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadItal } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadUi } from "@remotion/google-fonts/Inter";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  CardTunnel,
  CountUp,
  DropWord,
  FitProbe,
  Halftone,
  HomeBar,
  Hud,
  IPhone,
  Orbit,
  PW,
  ParticleText,
  Punch,
  Rewind,
  Sfx,
  SfxMute,
  ShapeGrid,
  SplitFlap,
  StatusBarIOS,
  Stripes,
  Touch,
  TypingInput,
  TypingSfx,
  clamp,
  ease,
  iosFont,
} from "./components";

const { fontFamily: wide } = loadWide("normal", {
  weights: ["800", "900"],
  subsets: ["latin", "cyrillic"],
});
const { fontFamily: ital } = loadItal("italic", {
  weights: ["600", "700"],
  subsets: ["latin", "cyrillic"],
});
const { fontFamily: mono } = loadMono("normal", {
  weights: ["500", "700"],
  subsets: ["latin", "cyrillic"],
});
const { fontFamily: ui } = loadUi("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "cyrillic"],
});

const INK = "#0F0F12";
const CREAM = "#F1ECE3";
const ORANGE = "#FF5A1F";
const LIME = "#C6F24E";
const COBALT = "#3B4BFF";
const B = 15;
const CX = 480; // центр безопасной зоны Instagram по x

export const SP = {
  hook: 0,
  title: 75,
  type: 150,
  particles: 240,
  tunnel: 330,
  board: 420,
  ui: 495,
  phone: 585,
  sound: 705,
  rhythm: 795,
  check: 885,
  examples: 975,
  rewind: 1065,
  final: 1095,
  end: 1260,
};
const prog = (f: number, a: number, b: number, easing = ease) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing });
const fit = (t: string, max: number) =>
  Math.min(max, Math.floor(590 / (t.length * 0.98)));

const Ital: React.FC<{
  text: string;
  at: number;
  top: number;
  size?: number;
  color?: string;
}> = ({ text, at, top, size = 64, color = CREAM }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 9);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        width: 720,
        top,
        textAlign: "center",
        fontFamily: ital,
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.05,
        color,
        opacity: p,
        translate: `0 ${interpolate(p, [0, 1], [26, 0])}px`,
        filter: `blur(${(1 - p) * 6}px)`,
      }}
    >
      {text}
    </div>
  );
};

// ── 0. ХУК: «ЭТОТ РОЛИК — КОД.», портал через «О» ──────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const portal = prog(f, 58, 75, (t) => t * t);
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {f < 12 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: Math.floor(f / 3) % 2 ? ORANGE : INK,
          }}
        />
      )}
      <Punch
        text="ЭТОТ РОЛИК"
        at={0}
        font={wide}
        size={fit("ЭТОТ РОЛИК", 200)}
        color={CREAM}
        top={760}
      />
      {f >= 18 && (
        <div
          style={{
            position: "absolute",
            left: 120,
            width: 720,
            top: 870,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            whiteSpace: "nowrap",
            fontFamily: wide,
            fontWeight: 900,
            fontSize: 130,
            letterSpacing: -4,
            color: ORANGE,
            scale: String(interpolate(prog(f, 18, 25), [0, 1], [1.12, 1])),
          }}
        >
          — К
          <span
            style={{
              display: "inline-block",
              width: 104,
              height: 104,
              borderRadius: 52,
              flexShrink: 0,
              border: `19px solid rgba(255,90,31,${1 - portal})`,
              margin: "0 6px",
              position: "relative",
              zIndex: 5,
              scale: String(interpolate(portal, [0, 1], [1, 30])),
              backgroundColor: portal > 0 ? LIME : "transparent",
            }}
          />
          Д.
        </div>
      )}
      <Ital
        text="ни одного кадра в After Effects"
        at={34}
        top={1080}
        size={58}
      />
      <Sfx s="hit" at={0} volume={0.8} />
      <Sfx s="hit" at={18} volume={0.7} rate={1.2} />
      <Sfx s="whoosh" at={66} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 1. НАЗВАНИЕ: буквы падают, орбита ───────────────────────────────────
const Title: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: LIME }}>
    <Orbit cx={CX} cy={800} rx={380} ry={190} color={INK} start={18} />
    <DropWord
      text="MOTION"
      at={0}
      top={640}
      size={126}
      font={wide}
      color={INK}
    />
    <DropWord
      text="STUDIO"
      at={10}
      top={790}
      size={126}
      font={wide}
      color={INK}
    />
    <Ital
      text="скилл моушн-графики для Claude Code"
      at={30}
      top={1010}
      size={56}
      color={INK}
    />
    {[0, 2, 4, 6, 8, 10].map((d) => (
      <Sfx
        key={`a${d}`}
        s="pop"
        at={4 + d}
        volume={0.22}
        rate={0.9 + d * 0.03}
      />
    ))}
    {[0, 2, 4, 6, 8, 10].map((d) => (
      <Sfx
        key={`b${d}`}
        s="pop"
        at={14 + d}
        volume={0.22}
        rate={1.05 + d * 0.03}
      />
    ))}
    <Sfx s="hit" at={26} volume={0.6} />
  </AbsoluteFill>
);

// ── 2. ТИПОГРАФИКА в бит ────────────────────────────────────────────────
const Type: React.FC = () => {
  const f = useCurrentFrame();
  const beats: [string, string, string, number][] = [
    ["СЛОВА", ORANGE, INK, -4],
    ["БЬЮТ", INK, CREAM, 3],
    ["В БИТ", LIME, INK, 0],
    ["МЕНЯЮТ", COBALT, CREAM, -3],
    ["ЦВЕТ", CREAM, ORANGE, 4],
    ["И ФОРМУ", INK, LIME, 0],
  ];
  const i = Math.min(beats.length - 1, Math.floor(f / B));
  const [w, bg, fg, rot] = beats[i];
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Punch
        key={i}
        text={w}
        at={i * B}
        font={wide}
        size={fit(w, 230)}
        color={fg}
        rot={rot}
        top={880}
      />
      {beats.map((_, j) => (
        <Sfx
          key={j}
          s={j % 2 ? "hit" : "whoosh-soft"}
          at={j * B}
          volume={j % 2 ? 0.45 : 0.4}
          rate={j % 2 ? 1.2 : 1}
        />
      ))}
    </AbsoluteFill>
  );
};

// ── 3. ЧАСТИЦЫ ──────────────────────────────────────────────────────────
const Particles: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0B0B20" }}>
    <ParticleText
      lines={["ЧАСТИЦЫ", "В ТЕКСТ"]}
      font={wide}
      weight={900}
      cx={CX}
      top={640}
      maxWidth={700}
      color={CREAM}
      accent={LIME}
      converge={[0, 40]}
      crispAt={44}
      step={6}
    />
    <Ital text="тысячи точек, каждая — по кадру" at={50} top={1080} size={56} />
    <Sfx s="riser" at={36} volume={0.35} />
    <Sfx s="hit" at={42} volume={0.7} />
  </AbsoluteFill>
);

// ── 4. 3D-ТУННЕЛЬ из карточек-приёмов ───────────────────────────────────
const CARDS = [
  "Частицы",
  "3D",
  "Табло",
  "Субтитры",
  "Звук",
  "Перемотка",
  "Айфон",
  "Графики",
  "Петля",
  "Портал",
  "Растр",
  "Стекло",
  "Счётчик",
  "Вайп",
];
const CARD_BG = [ORANGE, LIME, COBALT, CREAM, "#FF2E88", "#00C2A8"];
const Tunnel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <div data-fit="decor" style={{ position: "absolute", inset: 0 }}>
      <CardTunnel
        count={CARDS.length}
        cw={280}
        ch={360}
        render={(i) => (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: CARD_BG[i % CARD_BG.length],
              display: "flex",
              alignItems: "flex-end",
              padding: 24,
              boxSizing: "border-box",
              fontFamily: wide,
              fontWeight: 900,
              fontSize: 33,
              color: CARD_BG[i % CARD_BG.length] === COBALT ? CREAM : INK,
              lineHeight: 1,
            }}
          >
            {CARDS[i]}
          </div>
        )}
      />
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 420px 360px at 480px 960px, rgba(15,15,18,0.92) 0%, rgba(15,15,18,0.7) 55%, rgba(15,15,18,0) 100%)",
      }}
    />
    <Ital text="3D — тоже кодом" at={6} top={880} size={120} />
    <Sfx s="whoosh" at={2} volume={0.45} />
    <Sfx s="whoosh" at={45} volume={0.35} />
  </AbsoluteFill>
);

// ── 5. ТАБЛО ────────────────────────────────────────────────────────────
const Board: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#16161B", alignItems: "center" }}>
    <div
      style={{
        position: "absolute",
        left: 120,
        width: 720,
        top: 640,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <SplitFlap
        text="ТАБЛО"
        start={0}
        perChar={2}
        spin={10}
        cell={92}
        bg="#26262E"
        color={LIME}
      />
      <SplitFlap
        text="КАК В"
        start={10}
        perChar={2}
        spin={10}
        cell={92}
        bg="#26262E"
        color={CREAM}
      />
      <SplitFlap
        text="АЭРОПОРТУ"
        start={20}
        perChar={2}
        spin={10}
        cell={70}
        bg="#26262E"
        color={ORANGE}
      />
    </div>
    {[...Array(18)].map((_, i) => (
      <Sfx
        key={i}
        s={(["key-1", "key-2", "key-3", "key-4"] as const)[i % 4]}
        at={i * 2}
        volume={0.16}
        rate={1.15}
      />
    ))}
    <Sfx s="ding" at={46} volume={0.3} />
  </AbsoluteFill>
);

// ── 6. ИНТЕРФЕЙСЫ: дашборд со счётчиками и тоглом ───────────────────────
const UiScene: React.FC = () => {
  const f = useCurrentFrame();
  const on = f >= 52;
  const card = (k: number): React.CSSProperties => {
    const p = prog(f, k * 5, k * 5 + 10);
    return {
      backgroundColor: "#fff",
      borderRadius: 28,
      padding: 28,
      boxShadow: "0 18px 50px rgba(15,15,18,0.12)",
      opacity: p,
      translate: `0 ${interpolate(p, [0, 1], [40, 0])}px`,
    };
  };
  const bars = [0.35, 0.55, 0.42, 0.7, 0.62, 0.9, 0.78];
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 330,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
          fontFamily: ui,
          color: INK,
        }}
      >
        <div style={{ ...card(0), gridColumn: "1 / 3" }}>
          <div style={{ fontSize: 24, opacity: 0.6, fontWeight: 700 }}>
            промптов в каталоге
          </div>
          <CountUp
            from={0}
            to={475}
            start={6}
            duration={40}
            style={{ fontFamily: wide, fontWeight: 900, fontSize: 120 }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              height: 110,
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  backgroundColor: i === bars.length - 1 ? ORANGE : INK,
                  height: `${h * 100 * prog(f, 10 + i * 3, 22 + i * 3)}%`,
                }}
              />
            ))}
          </div>
        </div>
        <div style={card(1)}>
          <div style={{ fontSize: 22, opacity: 0.6, fontWeight: 700 }}>
            разборов рилсов
          </div>
          <CountUp
            from={0}
            to={12}
            start={12}
            duration={30}
            style={{ fontFamily: wide, fontWeight: 900, fontSize: 96 }}
          />
        </div>
        <div style={card(2)}>
          <div style={{ fontSize: 22, opacity: 0.6, fontWeight: 700 }}>
            рецептов и эффектов
          </div>
          <CountUp
            from={0}
            to={29}
            start={16}
            duration={30}
            style={{ fontFamily: wide, fontWeight: 900, fontSize: 96 }}
          />
        </div>
        <div
          style={{
            ...card(3),
            gridColumn: "1 / 3",
            backgroundColor: on ? LIME : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontFamily: wide, fontWeight: 900, fontSize: 44 }}>
            Звук в кадр
          </div>
          <div
            style={{
              width: 130,
              height: 72,
              borderRadius: 36,
              backgroundColor: on ? INK : "#D9D6CF",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                left: interpolate(prog(f, 52, 58), [0, 1], [8, 66]),
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: on ? LIME : "#fff",
              }}
            />
          </div>
        </div>
      </div>
      <Touch
        from={36}
        to={66}
        keys={[
          [36, 600, 1200],
          [48, 760, 1046],
          [66, 760, 1046],
        ]}
        taps={[51]}
      />
      <Sfx s="pop" at={0} volume={0.3} />
      <Sfx s="pop" at={5} volume={0.3} rate={1.1} />
      <Sfx s="pop" at={10} volume={0.3} rate={1.2} />
      <Sfx s="key-enter" at={51} volume={0.6} />
      <Sfx s="ding" at={54} volume={0.35} />
    </AbsoluteFill>
  );
};

// ── 7. iPHONE: рилс в ленте, лайк ───────────────────────────────────────
const ReelUi: React.FC<{ liked: boolean; burst: number }> = ({
  liked,
  burst,
}) => {
  const icon = (d: string, fill = "none") => (
    <svg
      width="58"
      height="58"
      viewBox="0 0 24 24"
      fill={fill}
      stroke="#fff"
      strokeWidth="1.9"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d={d} />
    </svg>
  );
  const heart =
    "M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: iosFont,
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 520,
          background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 30,
          fontWeight: 800,
          fontSize: 34,
        }}
      >
        Reels
      </div>
      <div
        style={{
          position: "absolute",
          right: 22,
          bottom: 230,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            scale: String(liked ? 1 + 0.3 * Math.max(0, 1 - burst * 2) : 1),
          }}
        >
          <svg
            width="58"
            height="58"
            viewBox="0 0 24 24"
            fill={liked ? "#FF3040" : "none"}
            stroke={liked ? "#FF3040" : "#fff"}
            strokeWidth="1.9"
            strokeLinejoin="round"
          >
            <path d={heart} />
          </svg>
        </div>
        {icon("M21 11.5a8.5 8.5 0 1 1-4-7.2L21 3l-1 4.5a8.4 8.4 0 0 1 1 4z")}
        {icon("M22 3L9.5 13.5M22 3l-7 18-5.5-7.5L2 9z")}
        {icon("M12 5h.01M12 12h.01M12 19h.01")}
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 120,
          bottom: 110,
          fontSize: 24,
          lineHeight: 1.35,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 26 }}>твой_рилс</div>
        <div>сделано кодом · motion-studio</div>
      </div>
      {liked && burst < 1 && (
        <svg
          width="300"
          height="300"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: (PW - 300) / 2,
            top: 450,
            opacity: 1 - burst,
            scale: String(0.6 + burst * 0.8),
          }}
        >
          <path d={heart} fill="#fff" />
        </svg>
      )}
      <StatusBarIOS dark />
      <HomeBar dark />
    </div>
  );
};
const PhoneScene: React.FC = () => {
  const f = useCurrentFrame();
  const enter = prog(f, 0, 16);
  const head = prog(f, 4, 12);
  const liked = f >= 62;
  return (
    <AbsoluteFill style={{ backgroundColor: ORANGE }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 290,
          textAlign: "center",
          fontFamily: wide,
          fontWeight: 900,
          fontSize: 66,
          lineHeight: 1.02,
          letterSpacing: -2,
          color: INK,
          opacity: head,
          scale: String(interpolate(head, [0, 1], [1.12, 1])),
        }}
      >
        СРАЗУ В ЛЕНТУ
      </div>
      <div
        data-fit="decor"
        style={{ position: "absolute", inset: 0, perspective: 2200 }}
      >
        <div
          style={{
            position: "absolute",
            left: 540 - (PW + 52) / 2,
            top: 440,
            translate: `0 ${interpolate(enter, [0, 1], [1300, 0])}px`,
            transformStyle: "preserve-3d",
          }}
        >
          <IPhone
            tiltY={interpolate(enter, [0, 1], [-26, 0]) + Math.sin(f / 20) * 5}
            tiltX={interpolate(enter, [0, 1], [30, 5])}
          >
            <Video
              src={staticFile("promo/phone_reel.mp4")}
              muted
              objectFit="cover"
              style={{
                position: "absolute",
                inset: 0,
                width: 600,
                height: 1300,
              }}
            />
            <ReelUi liked={liked} burst={prog(f, 62, 80, (t) => t)} />
            <Touch
              from={40}
              to={78}
              keys={[
                [40, 300, 900],
                [58, 543, 875],
                [78, 543, 875],
              ]}
              taps={[61]}
            />
          </IPhone>
        </div>
      </div>
      <Sfx s="whoosh" at={0} volume={0.5} />
      <Sfx s="key-enter" at={61} volume={0.6} />
      <Sfx s="pop" at={62} volume={0.5} />
      <Sfx s="ding" at={66} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 8. ЗВУК: терминал печатает с щелчками + волна в бит ─────────────────
const CMD = "npx skills add Sandovich/motion-studio";
const Sound: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <Punch
        text="ЗВУК"
        at={0}
        font={wide}
        size={fit("ЗВУК", 220)}
        color={LIME}
        top={470}
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 640,
          fontFamily: mono,
        }}
      >
        <TypingInput
          text={CMD}
          start={10}
          cps={24}
          width={720}
          size={34}
          label="терминал"
          bg="#1B1B22"
          color={CREAM}
          accent={LIME}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 900,
          height: 180,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {[...Array(36)].map((_, i) => {
          const beat = 1 - (f % B) / B;
          const h =
            20 +
            150 * Math.abs(Math.sin(i * 0.7 + f * 0.35)) * (0.35 + 0.65 * beat);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: h,
                borderRadius: 4,
                backgroundColor: i % 6 === 0 ? ORANGE : LIME,
              }}
            />
          );
        })}
      </div>
      <Ital text="каждый щелчок — в свой кадр" at={20} top={1130} size={58} />
      <Sfx s="hit" at={0} volume={0.6} />
      <TypingSfx text={CMD} start={10} cps={24} volume={0.34} />
    </AbsoluteFill>
  );
};

// ── 9. РИТМ: геометрия → полосы → растр ─────────────────────────────────
const Rhythm: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {f < 45 ? (
        <ShapeGrid colors={[CREAM, LIME, ORANGE, COBALT]} bg={INK} />
      ) : (
        <Halftone bg={COBALT} dot={CREAM} />
      )}
      {f < 45 ? (
        <Punch
          text="ГЕОМЕТРИЯ"
          at={4}
          font={wide}
          size={fit("ГЕОМЕТРИЯ", 200)}
          color={CREAM}
          top={900}
        />
      ) : (
        <Punch
          text="РИТМ"
          at={48}
          font={wide}
          size={fit("РИТМ", 230)}
          color={INK}
          top={900}
        />
      )}
      <Stripes at={38} a={ORANGE} b={INK} />
      <Sfx s="whoosh-soft" at={4} volume={0.4} />
      <Sfx s="whoosh" at={39} volume={0.5} />
      <Sfx s="hit" at={48} volume={0.6} />
    </AbsoluteFill>
  );
};

// ── 10. ПРОВЕРКА: текст уезжает из-под кнопок Instagram → FIT PASS ───────
const Check: React.FC = () => {
  const f = useCurrentFrame();
  const fix = prog(f, 34, 50);
  const ok = f >= 50;
  // мини-кадр рилса 1:2.4 масштаба, зоны в его координатах
  const k = 0.42,
    W = 1080 * k,
    H = 1920 * k,
    X = 120,
    Y = 450;
  const zone = (x: number, y: number, w: number, h: number) => (
    <div
      style={{
        position: "absolute",
        left: x * k,
        top: y * k,
        width: w * k,
        height: h * k,
        backgroundColor: "rgba(255,59,48,0.28)",
        borderLeft: "2px dashed rgba(255,59,48,0.8)",
      }}
    />
  );
  const tx = interpolate(fix, [0, 1], [520, 160]),
    ty = interpolate(fix, [0, 1], [1450, 700]);
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 290,
          textAlign: "center",
          fontFamily: wide,
          fontWeight: 900,
          fontSize: 52,
          lineHeight: 1.05,
          letterSpacing: -1.5,
          color: INK,
        }}
      >
        ТЕКСТ НЕ ЗАЛЕЗЕТ ПОД КНОПКИ
      </div>
      <div
        data-fit="decor"
        style={{
          position: "absolute",
          left: X,
          top: Y,
          width: W,
          height: H,
          borderRadius: 36,
          overflow: "hidden",
          backgroundColor: INK,
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        }}
      >
        {zone(840, 360, 240, 1100)}
        {zone(0, 1360, 1080, 560)}
        <div
          style={{
            position: "absolute",
            left: 120 * k,
            top: 260 * k,
            width: 720 * k,
            height: 1100 * k,
            border: `3px dashed ${ok ? LIME : "rgba(241,236,227,0.4)"}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: tx * k,
            top: ty * k,
            width: 560 * k,
            padding: 10,
            borderRadius: 10,
            backgroundColor: ORANGE,
            color: INK,
            fontFamily: wide,
            fontWeight: 900,
            fontSize: 30,
            outline: `4px solid ${ok ? LIME : "#FF3B30"}`,
          }}
        >
          Заголовок
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: X + W + 30,
          top: Y + 40,
          width: 230,
          fontFamily: mono,
          fontSize: 26,
          color: INK,
          lineHeight: 1.5,
        }}
      >
        <div style={{ color: "#D92D20", opacity: 1 - fix }}>✗ ui-zone</div>
        <div style={{ color: "#3A7D0A", opacity: fix, fontWeight: 700 }}>
          ✓ FIT PASS
        </div>
      </div>
      <Ital
        text="проверка до рендера"
        at={8}
        top={1290}
        size={60}
        color={INK}
      />
      <Sfx s="key-enter" at={10} volume={0.4} />
      <Sfx s="whoosh-soft" at={36} volume={0.45} />
      <Sfx s="ding" at={52} volume={0.45} />
    </AbsoluteFill>
  );
};

// ── 11. ПРИМЕРЫ: наши настоящие ролики, склейка на удар ─────────────────
const CLIPS = [
  "promo/tut_a.mp4",
  "promo/proof_a.mp4",
  "promo/show_a.mp4",
  "promo/tut_d.mp4",
  "promo/tut_b.mp4",
  "promo/tut_c.mp4",
];
const Examples: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {CLIPS.map((c, i) => (
        <Sequence key={c} from={i * B} durationInFrames={B} layout="none">
          <AbsoluteFill
            style={{
              scale: String(
                interpolate(f - i * B, [0, 6], [1.1, 1], {
                  ...clamp,
                  easing: ease,
                }),
              ),
            }}
          >
            <Video
              src={staticFile(c)}
              muted
              objectFit="cover"
              style={{ width: 1080, height: 1920 }}
            />
          </AbsoluteFill>
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 1180,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "14px 28px",
            borderRadius: 40,
            backgroundColor: INK,
            color: LIME,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 30,
          }}
        >
          наши ролики — тоже код
        </div>
      </div>
      {CLIPS.map((_, i) => (
        <Sfx
          key={i}
          s="pop-high"
          at={i * B}
          volume={0.22}
          rate={0.85 + i * 0.05}
        />
      ))}
    </AbsoluteFill>
  );
};

// ── все сцены до перемотки ──────────────────────────────────────────────
const Scenes: React.FC = () => {
  const S = (a: number, b: number, n: string, el: React.ReactNode) => (
    <Sequence from={a} durationInFrames={b - a} name={n}>
      {el}
    </Sequence>
  );
  return (
    <>
      {S(SP.hook, SP.title, "0 Хук", <Hook />)}
      {S(SP.title, SP.type, "1 Название", <Title />)}
      {S(SP.type, SP.particles, "2 Типографика", <Type />)}
      {S(SP.particles, SP.tunnel, "3 Частицы", <Particles />)}
      {S(SP.tunnel, SP.board, "4 Туннель", <Tunnel />)}
      {S(SP.board, SP.ui, "5 Табло", <Board />)}
      {S(SP.ui, SP.phone, "6 Интерфейсы", <UiScene />)}
      {S(SP.phone, SP.sound, "7 Айфон", <PhoneScene />)}
      {S(SP.sound, SP.rhythm, "8 Звук", <Sound />)}
      {S(SP.rhythm, SP.check, "9 Ритм", <Rhythm />)}
      {S(SP.check, SP.examples, "10 Проверка", <Check />)}
      {S(SP.examples, SP.rewind, "11 Примеры", <Examples />)}
    </>
  );
};

// ── 13. ФИНАЛ ───────────────────────────────────────────────────────────
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const cmd = prog(f, 44, 54);
  const link = prog(f, 60, 70);
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <Orbit cx={CX} cy={650} rx={390} ry={200} color={ORANGE} start={24} />
      <DropWord
        text="MOTION"
        at={2}
        top={510}
        size={126}
        font={wide}
        color={CREAM}
      />
      <DropWord
        text="STUDIO"
        at={12}
        top={660}
        size={126}
        font={wide}
        color={LIME}
      />
      <Ital
        text="Скилл бесплатный. Ставится одной командой."
        at={32}
        top={880}
        size={58}
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 1030,
          display: "flex",
          justifyContent: "center",
          opacity: cmd,
          translate: `0 ${interpolate(cmd, [0, 1], [24, 0])}px`,
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderRadius: 18,
            backgroundColor: "#1B1B22",
            border: `2px solid ${LIME}`,
            fontFamily: mono,
            fontWeight: 500,
            fontSize: 25,
            color: CREAM,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: LIME }}>$ </span>
          {CMD}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 720,
          top: 1150,
          textAlign: "center",
          opacity: link,
          fontFamily: ui,
          fontWeight: 700,
          fontSize: 34,
          color: CREAM,
        }}
      >
        github.com/Sandovich/motion-studio
        <div
          style={{ fontWeight: 500, fontSize: 26, opacity: 0.6, marginTop: 10 }}
        >
          Claude Code · Remotion · HyperFrames
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 1310,
          height: 6,
          backgroundColor: ORANGE,
          width: interpolate(f, [80, 110], [0, 720], {
            ...clamp,
            easing: ease,
          }),
        }}
      />
      {[0, 2, 4, 6, 8, 10].map((d) => (
        <Sfx
          key={`a${d}`}
          s="pop"
          at={6 + d}
          volume={0.22}
          rate={0.9 + d * 0.03}
        />
      ))}
      {[0, 2, 4, 6, 8, 10].map((d) => (
        <Sfx
          key={`b${d}`}
          s="pop"
          at={16 + d}
          volume={0.22}
          rate={1.05 + d * 0.03}
        />
      ))}
      <Sfx s="hit" at={28} volume={0.8} />
      <Sfx s="key-enter" at={46} volume={0.5} />
      <Sfx s="ding" at={62} volume={0.4} />
    </AbsoluteFill>
  );
};

const CHAPTERS: [number, string][] = [
  [SP.hook, "00 / КОД"],
  [SP.title, "00 / SKILL"],
  [SP.type, "01 / ТИПОГРАФИКА"],
  [SP.particles, "02 / ЧАСТИЦЫ"],
  [SP.tunnel, "03 / 3D"],
  [SP.board, "04 / ТАБЛО"],
  [SP.ui, "05 / ИНТЕРФЕЙСЫ"],
  [SP.phone, "06 / АЙФОН"],
  [SP.sound, "07 / ЗВУК"],
  [SP.rhythm, "08 / РИТМ"],
  [SP.check, "09 / ПРОВЕРКА"],
  [SP.examples, "10 / ПРИМЕРЫ"],
  [SP.rewind, "◀◀ REW"],
  [SP.final, "11 / УСТАНОВКА"],
];
const LIGHT: [number, number][] = [
  [SP.title, SP.type],
  [SP.ui, SP.phone],
  [SP.check, SP.examples],
];

export const SkillPromo: React.FC = () => {
  const f = useCurrentFrame();
  const music = (fr: number) =>
    interpolate(
      fr,
      [
        0,
        2,
        SP.rewind - 2,
        SP.rewind,
        SP.final + 26,
        SP.final + 28,
        SP.end - 14,
        SP.end,
      ],
      [0, 0.55, 0.55, 0.12, 0.12, 0.6, 0.6, 0],
      clamp,
    );
  const typeBeat = Math.floor((f - SP.type) / B);
  const light =
    LIGHT.some(([a, b]) => f >= a && f < b) ||
    (f >= SP.type &&
      f < SP.particles &&
      (typeBeat === 0 || typeBeat === 2 || typeBeat === 4)) ||
    (f >= SP.phone && f < SP.sound);
  const shown =
    f >= SP.rewind && f < SP.final
      ? Math.max(0, SP.rewind - (f - SP.rewind) * 36)
      : f;
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <Audio src={staticFile("sfx/beat.wav")} volume={music} loop />
      <Scenes />
      <Sequence
        from={SP.rewind}
        durationInFrames={SP.final - SP.rewind}
        name="12 Перемотка"
      >
        <SfxMute.Provider value>
          <Rewind from={SP.rewind} speed={36} label="◀◀ REW ×36" font={mono}>
            <Scenes />
          </Rewind>
        </SfxMute.Provider>
        <Sfx s="key-enter" at={0} volume={0.6} />
        {[0, 8, 16, 24].map((a) => (
          <Sfx
            key={a}
            s="whoosh-soft"
            at={a + 3}
            volume={0.35}
            rate={2.2}
            lead={false}
          />
        ))}
        <Sfx s="key-enter" at={29} volume={0.6} />
      </Sequence>
      <Sequence
        from={SP.final}
        durationInFrames={SP.end - SP.final}
        name="13 Финал"
      >
        <Final />
      </Sequence>
      <Hud
        title="MOTION-STUDIO / SKILL REEL"
        right="Claude Code"
        chapters={CHAPTERS}
        total={SP.end}
        font={mono}
        dark={!light}
        shownFrame={shown}
      />
      <FitProbe />
    </AbsoluteFill>
  );
};
