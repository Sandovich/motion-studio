import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Series, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BlurWords,
  CircleWipe,
  CountUp,
  DrawPath,
  GlassCard,
  GlowBackground,
  KaraokeCaptions,
  SplitFlap,
  TypingInput,
  clamp,
  ease,
  type Word,
} from "./components";

// Демо всех компонентов библиотеки. 1080×1920, 30 fps, 11 с.
const { fontFamily } = loadFont("normal", { weights: ["400", "800", "900"], subsets: ["latin", "cyrillic"] });

const SceneTyping: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center" }}>
    <GlowBackground base="#06080F" glow="#1E3A8A" />
    <GlassCard width={900}>
      <div style={{ color: "white", fontSize: 48, fontWeight: 800, marginBottom: 28 }}>✳ Claude Code</div>
      <TypingInput text="Собери моушн-ролик про наш продукт" start={8} width={820} size={48} label="промпт" />
    </GlassCard>
  </AbsoluteFill>
);

const SceneFlap: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: "#16181D", alignItems: "center", justifyContent: "center", gap: 24 }}>
    <div style={{ backgroundColor: "#F6C343", color: "#16181D", fontSize: 40, fontWeight: 800, padding: "14px 28px", borderRadius: 12, marginBottom: 30 }}>
      ✈ ОТПРАВЛЕНИЕ 09:00
    </div>
    <SplitFlap text="ТЕБЕ ЕСТЬ" start={4} cell={96} bg="#2A2D35" color="#F2EFE6" />
    <SplitFlap text="ЧТО СКАЗАТЬ" start={14} cell={84} bg="#2A2D35" color="#F6C343" />
  </AbsoluteFill>
);

const SceneCounter: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#ECEDEB", alignItems: "center", justifyContent: "center" }}>
      <BlurWords text="Прошлый рилс набрал" start={0} perWord={5} size={72} color="#141413" muted="#8A8C88" />
      <svg width={760} height={200} style={{ overflow: "visible", margin: "50px 0" }}>
        <DrawPath d="M 0 180 C 200 170, 320 150, 430 100 S 640 30, 760 15" start={6} duration={1.4 * fps} color="#C6F24E" width={10} />
      </svg>
      <div style={{ backgroundColor: "#141413", color: "white", borderRadius: 999, padding: "24px 60px", fontSize: 116, fontWeight: 900 }}>
        <CountUp from={139973} to={140000} start={6} duration={1.4 * fps} />
      </div>
      <CircleWipe start={Math.round(2.6 * fps)} duration={18} color="#C6F24E" origin={[50, 62]}>
        <div style={{ fontSize: 150, fontWeight: 900, color: "#141413" }}>● Live.</div>
      </CircleWipe>
    </AbsoluteFill>
  );
};

// Слова с таймингом — как из faster-whisper (word_timestamps=True), время относительно начала сцены.
const WORDS: Word[] = [
  { text: " Это", startMs: 0, endMs: 300 },
  { text: " всё", startMs: 300, endMs: 600 },
  { text: " собрано", startMs: 600, endMs: 1100 },
  { text: " кодом", startMs: 1100, endMs: 1600 },
  { text: " без", startMs: 1700, endMs: 2000 },
  { text: " After", startMs: 2000, endMs: 2350 },
  { text: " Effects", startMs: 2350, endMs: 2900 },
];

const SceneCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily, background: "linear-gradient(160deg, #3B2A6B, #0E1020)", alignItems: "center", justifyContent: "flex-end", paddingBottom: 620 }}>
      <div style={{ opacity: interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: ease }), padding: "0 90px" }}>
        <KaraokeCaptions words={WORDS} size={92} color="#FFFFFF" highlight="#F6E05E" />
      </div>
    </AbsoluteFill>
  );
};

export const Showcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="Печать в поле" durationInFrames={Math.round(2.8 * fps)} premountFor={fps}>
        <SceneTyping />
      </Series.Sequence>
      <Series.Sequence name="Табло" durationInFrames={Math.round(2.4 * fps)} premountFor={fps}>
        <SceneFlap />
      </Series.Sequence>
      <Series.Sequence name="Счётчик + вайп" durationInFrames={Math.round(3.6 * fps)} premountFor={fps}>
        <SceneCounter />
      </Series.Sequence>
      <Series.Sequence name="Караоке" durationInFrames={Math.round(3.2 * fps)} premountFor={fps}>
        <SceneCaptions />
      </Series.Sequence>
    </Series>
  );
};
