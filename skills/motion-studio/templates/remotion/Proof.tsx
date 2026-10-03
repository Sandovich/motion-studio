import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Easing,
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Тестовый ролик: проверка приёмов из изученных рилсов (светлый фон + лайм,
// пословное проявление из размытия, счётчик с графиком, иконка с лучом и нод-карточки).

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin", "cyrillic"],
});

const BG = "#ECEDEB";
const INK = "#141413";
const MUTED = "#8A8C88";
const LIME = "#C6F24E";
const CLAUDE = "#D97757";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Слова проявляются по одному: текущее чёткое, следующие серые и размытые.
const BlurWords: React.FC<{ text: string; start: number; perWord: number; size: number }> = ({
  text,
  start,
  perWord,
  size,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.28, justifyContent: "center" }}>
      {words.map((w, i) => {
        const t0 = start + i * perWord;
        const p = interpolate(frame, [t0, t0 + perWord], [0, 1], { ...clamp, easing: ease });
        return (
          <span
            key={i}
            style={{
              fontSize: size,
              fontWeight: 800,
              color: p > 0.5 ? INK : MUTED,
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

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily, alignItems: "center", justifyContent: "center", padding: 90 }}>
      <div
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: MUTED,
          marginBottom: 24,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], clamp),
        }}
      >
        часть 1
      </div>
      <BlurWords text="Монтаж рилсов делает Claude" start={4} perWord={7} size={104} />
    </AbsoluteFill>
  );
};

const SceneCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0.2 * fps, 1.8 * fps], [0, 1], { ...clamp, easing: ease });
  const value = Math.round(interpolate(p, [0, 1], [139973, 140000]));
  const pathLen = 900;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 64, fontWeight: 800, color: INK, marginBottom: 60 }}>Прошлая часть</div>
      <svg width={760} height={220} style={{ overflow: "visible" }}>
        <path
          d="M 0 200 C 200 190, 300 170, 420 120 S 640 40, 760 20"
          fill="none"
          stroke={LIME}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={interpolate(p, [0, 1], [pathLen, 0])}
        />
        <circle cx={760} cy={20} r={12} fill={INK} opacity={p > 0.95 ? 1 : 0} />
      </svg>
      <div
        style={{
          marginTop: 40,
          backgroundColor: INK,
          color: "white",
          borderRadius: 999,
          padding: "26px 64px",
          fontSize: 120,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          display: "flex",
          alignItems: "center",
          gap: 28,
          scale: interpolate(frame, [0, 0.5 * fps], [0.9, 1], { ...clamp, easing: ease, output: "perceptual-scale" }),
        }}
      >
        <span style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: LIME }} />
        {value.toLocaleString("ru-RU")}
      </div>
      <div style={{ fontSize: 44, fontWeight: 600, color: MUTED, marginTop: 24 }}>просмотров</div>
    </AbsoluteFill>
  );
};

const NodeCard: React.FC<{ label: string; delay: number; x: number }> = ({ label, delay, x }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], { ...clamp, easing: ease });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 1120,
        width: 270,
        height: 200,
        borderRadius: 28,
        backgroundColor: "white",
        boxShadow: "0 20px 50px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 26,
        fontSize: 38,
        fontWeight: 800,
        color: INK,
        opacity: p,
        translate: `0px ${interpolate(p, [0, 1], [40, 0])}px`,
      }}
    >
      <div style={{ width: 70, height: 12, borderRadius: 6, backgroundColor: LIME, marginBottom: 18 }} />
      {label}
    </div>
  );
};

const SceneNodes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const icon = interpolate(frame, [0, 0.5 * fps], [0, 1], { ...clamp, easing: ease });
  const beam = interpolate(frame, [0.3 * fps, 0.9 * fps], [0, 1], { ...clamp, easing: ease });
  const cards = [
    { label: "субтитры", x: 105 },
    { label: "анимации", x: 405 },
    { label: "переходы", x: 705 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily }}>
      <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontSize: 72, fontWeight: 800, color: INK }}>
        Говорим Клоду
      </div>
      {/* луч от иконки вниз */}
      <div
        style={{
          position: "absolute",
          left: 540 - 220,
          top: 640,
          width: 440,
          height: 480,
          background: `linear-gradient(${LIME}AA, ${LIME}00)`,
          clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
          opacity: beam * 0.8,
        }}
      />
      {/* линии к карточкам */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {cards.map((c, i) => {
          const lp = interpolate(frame, [0.8 * fps + i * 6, 1.2 * fps + i * 6], [0, 1], clamp);
          const x2 = c.x + 135;
          return (
            <line
              key={c.label}
              x1={540}
              y1={640}
              x2={540 + (x2 - 540) * lp}
              y2={640 + (1120 - 640) * lp}
              stroke={LIME}
              strokeWidth={6}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 540 - 95,
          top: 470,
          width: 190,
          height: 190,
          borderRadius: 48,
          backgroundColor: CLAUDE,
          boxShadow: "0 24px 60px rgba(217,119,87,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 130,
          fontWeight: 800,
          scale: interpolate(icon, [0, 1], [0.6, 1], { output: "perceptual-scale" }),
          opacity: icon,
        }}
      >
        ✳
      </div>
      {cards.map((c, i) => (
        <NodeCard key={c.label} label={c.label} x={c.x} delay={Math.round(1.1 * fps) + i * 7} />
      ))}
    </AbsoluteFill>
  );
};

export const Proof: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="Хук" durationInFrames={Math.round(2.6 * fps)} premountFor={fps}>
        <SceneHook />
      </Series.Sequence>
      <Series.Sequence name="Счётчик" durationInFrames={Math.round(2.6 * fps)} premountFor={fps}>
        <SceneCounter />
      </Series.Sequence>
      <Series.Sequence name="Ноды" durationInFrames={Math.round(2.8 * fps)} premountFor={fps}>
        <SceneNodes />
      </Series.Sequence>
    </Series>
  );
};
