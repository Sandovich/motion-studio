import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import {
  AbsoluteFill,
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BlurWords,
  CircleWipe,
  GlassCard,
  GlowBackground,
  MusicBed,
  Sfx,
  TypingInput,
  TypingSfx,
  clamp,
  ease,
} from "./components";

// Видео-инструкция: как установить скилл motion-studio. 1080×1920, 30 fps.
const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800", "900"],
  subsets: ["latin", "cyrillic"],
});
const { fontFamily: mono } = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "cyrillic"],
});

const BG = "#06080F";
const GLOW = "#1E3A8A";
const LIME = "#C6F24E";
const MUTED = "#9AA3B2";

const Appear: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 10], [0, 1], {
    ...clamp,
    easing: ease,
  });
  return (
    <div
      style={{
        opacity: p,
        translate: `0px ${interpolate(p, [0, 1], [30, 0])}px`,
      }}
    >
      {children}
    </div>
  );
};

const Step: React.FC<{
  n: number;
  title: string;
  note?: string;
  commands?: string[];
  labels?: string[];
  card?: React.ReactNode;
}> = ({ n, title, note, commands = [], labels = [], card }) => {
  const frame = useCurrentFrame();
  const badge = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill
      style={{
        fontFamily,
        alignItems: "center",
        justifyContent: "center",
        padding: 90,
      }}
    >
      <GlowBackground base={BG} glow={GLOW} />
      {/* ♪ бейдж шага, появление карточек, печать + Enter */}
      <Sfx s="pop" at={1} volume={0.4} />
      {commands.map((c, i) => (
        <React.Fragment key={c}>
          <Sfx s="pop-high" at={14 + i * 34} volume={0.22} />
          <TypingSfx text={c} start={18 + i * 34} cps={26} volume={0.32} />
        </React.Fragment>
      ))}
      {card && <Sfx s="pop" at={15} volume={0.3} rate={0.85} />}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: LIME,
            color: BG,
            fontSize: 64,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: interpolate(badge, [0, 1], [0.5, 1], {
              output: "perceptual-scale",
            }),
            opacity: badge,
          }}
        >
          {n}
        </div>
        <BlurWords
          text={title}
          start={4}
          perWord={4}
          size={84}
          color="#FFFFFF"
          muted="#4B5563"
        />
        {commands.map((c, i) => (
          <Appear key={c} delay={14 + i * 34}>
            <GlassCard width={900} padding={34}>
              <div style={{ fontFamily: mono }}>
                <TypingInput
                  text={c}
                  start={18 + i * 34}
                  cps={26}
                  width={832}
                  size={44}
                  bg="#0B0F1A"
                  color="#E5E7EB"
                  accent={LIME}
                  label={labels[i] ?? "терминал"}
                />
              </div>
            </GlassCard>
          </Appear>
        ))}
        {card && <Appear delay={14}>{card}</Appear>}
        {note && (
          <Appear delay={40}>
            <div
              style={{
                fontSize: 46,
                color: MUTED,
                textAlign: "center",
                lineHeight: 1.3,
                maxWidth: 880,
              }}
            >
              {note}
            </div>
          </Appear>
        )}
      </div>
    </AbsoluteFill>
  );
};

const InfoCard: React.FC<{ lines: string[] }> = ({ lines }) => (
  <GlassCard width={900} padding={44}>
    {lines.map((l, i) => (
      <div
        key={i}
        style={{
          fontSize: 50,
          fontWeight: 600,
          color: "white",
          lineHeight: 1.45,
        }}
      >
        {l}
      </div>
    ))}
  </GlassCard>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        fontFamily,
        alignItems: "center",
        justifyContent: "center",
        padding: 90,
      }}
    >
      <GlowBackground base={BG} glow={GLOW} />
      <Sfx s="pop-high" at={1} volume={0.25} />
      <Sfx s="whoosh" at={12} volume={0.45} />
      <Sfx s="pop" at={41} volume={0.25} rate={0.9} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: LIME,
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          }}
        >
          инструкция за 6 шагов
        </div>
        <BlurWords
          text="Как установить скилл motion-studio"
          start={6}
          perWord={5}
          size={104}
          color="#FFFFFF"
          muted="#4B5563"
        />
        <Appear delay={40}>
          <div style={{ fontSize: 48, color: MUTED, textAlign: "center" }}>
            моушн-видео кодом через Claude Code
          </div>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: BG }}>
    <Sfx s="hit" at={13} volume={0.7} />
    <Sfx s="ding" at={17} volume={0.4} />
    <CircleWipe start={0} duration={16} color={LIME}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          padding: 90,
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 900, color: BG }}>
          Готово ✓
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: BG,
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          Скилл сам выберет движок, соберёт ролик и проверит кадры
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: "#1F2937",
            fontFamily: mono,
            marginTop: 20,
          }}
        >
          github.com/Sandovich/motion-studio
        </div>
      </div>
    </CircleWipe>
  </AbsoluteFill>
);

export const Tutorial: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  const scenes = [3.6, 4.6, 5.4, 4.8, 5.6, 5.0, 5.6, 3.6].map(s);
  const cuts = scenes
    .slice(0, -1)
    .map((_, i) => scenes.slice(0, i + 1).reduce((a, b) => a + b, 0));
  const total = scenes.reduce((a, b) => a + b, 0);
  return (
    <>
      {/* ♪ музыка под всем роликом + whoosh на каждую смену шага, riser перед финалом */}
      <MusicBed durationInFrames={total} volume={0.17} />
      {cuts.slice(0, -1).map((c) => (
        <Sfx key={c} s="whoosh" at={c} volume={0.4} />
      ))}
      <Sfx s="riser" at={cuts[cuts.length - 1]} volume={0.45} />
      <Series>
        <Series.Sequence
          name="Интро"
          durationInFrames={s(3.6)}
          premountFor={fps}
        >
          <Intro />
        </Series.Sequence>
        <Series.Sequence
          name="1 Node.js"
          durationInFrames={s(4.6)}
          premountFor={fps}
        >
          <Step
            n={1}
            title="Установи Node.js"
            card={
              <InfoCard
                lines={[
                  "nodejs.org",
                  "→ скачать LTS",
                  "→ установить как обычную программу",
                ]}
              />
            }
          />
        </Series.Sequence>
        <Series.Sequence
          name="2 Claude Code"
          durationInFrames={s(5.4)}
          premountFor={fps}
        >
          <Step
            n={2}
            title="Установи Claude Code"
            commands={["npm install -g @anthropic-ai/claude-code"]}
            note="Нужна подписка Claude Pro или Max — при первом запуске войди в аккаунт"
          />
        </Series.Sequence>
        <Series.Sequence
          name="3 Папка"
          durationInFrames={s(4.8)}
          premountFor={fps}
        >
          <Step
            n={3}
            title="Создай папку проекта"
            commands={["mkdir my-video", "cd my-video"]}
          />
        </Series.Sequence>
        <Series.Sequence
          name="4 Скилл"
          durationInFrames={s(5.6)}
          premountFor={fps}
        >
          <Step
            n={4}
            title="Установи скилл"
            commands={[
              "npx skills add Sandovich/motion-studio -a claude-code -y",
            ]}
            note="Скилл ляжет в папку проекта — Claude Code увидит его сам"
          />
        </Series.Sequence>
        <Series.Sequence
          name="5 Запуск"
          durationInFrames={s(5.0)}
          premountFor={fps}
        >
          <Step
            n={5}
            title="Запусти Claude Code"
            commands={["claude", "/model"]}
            labels={["терминал", "в Claude Code"]}
            note="Выбери модель Opus 5.5"
          />
        </Series.Sequence>
        <Series.Sequence
          name="6 Промпт"
          durationInFrames={s(5.6)}
          premountFor={fps}
        >
          <Step
            n={6}
            title="Попроси ролик"
            commands={[
              "Сделай 15-секундный моушн-ролик про мой продукт. Go all out.",
            ]}
            labels={["в Claude Code"]}
          />
        </Series.Sequence>
        <Series.Sequence
          name="Финал"
          durationInFrames={s(3.6)}
          premountFor={fps}
        >
          <Outro />
        </Series.Sequence>
      </Series>
    </>
  );
};
