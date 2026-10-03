// Большое промо скилла motion-studio: по главе на каждый разобранный рилс (1–14 + saint4ai) и витрина пакетов Remotion.
// Главы идут через <TransitionSeries> (@remotion/transitions, remotion.dev/docs/transitions): у каждого стыка свой переход
// (slide, iris, flip, clock-wipe, wipe, fade), плюс световая вспышка lightLeak (@remotion/effects) как overlay.
// Шейдерные переходы (cross-zoom, film-burn…) требуют HTML-in-canvas (Chrome 149+) — в текущем рендере дают простую склейку, не используем.
// У каждой главы свой непрозрачный фон = живой градиент, привязанный к общему времени (offset) — фон непрерывен через стыки.
// Вёрстка — сетка kit.tsx (центр кадра, колонка 600 px, fitText). Звук — PRO_PACK + Tech House vibes (Mixkit, 120 BPM).
// Перед рендером: bash scripts/fetch-sound-pack.sh (звуки и музыку в репо не кладём — лицензия Mixkit).
import React from "react";
import { Audio } from "@remotion/media";
import { lightLeak } from "@remotion/effects/light-leak";
import { TransitionSeries, springTiming, type TransitionPresentation } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, Sequence, Solid, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DropWord, FitProbe, Hud, LivingGradient, Orbit, PRO_PACK, Rewind, SceneFx, Sfx, SfxMute, SfxPack, clamp, ease } from "./components";
import { Chingiz, DamiCast, Dubl, Ev, Grafigator, Hook, Ledovskikh, Riccardo, Tally } from "./promo/ChaptersA";
import { Brag, Depth, Lyamin1, Lyamin2, Ours, Pynk, Saint } from "./promo/ChaptersB";
import { Pipeline, RemotionLab, Vox } from "./promo/ChaptersC";
import { C, CX, Title, mono, wide } from "./promo/kit";

const CHAPTERS: [string, React.FC, number][] = [
  ["Хук", Hook, 110],
  ["Grafigator", Grafigator, 120],
  ["Dami Cast", DamiCast, 110],
  ["Дубль", Dubl, 110],
  ["Ev Astapov", Ev, 120],
  ["Riccardo", Riccardo, 120],
  ["Dami Tally", Tally, 100],
  ["Ледовских", Ledovskikh, 120],
  ["Чингиз", Chingiz, 120],
  ["Лямин ч.2", Lyamin2, 120],
  ["Лямин ч.1", Lyamin1, 110],
  ["Mr. Pynk", Pynk, 120],
  ["brag", Brag, 110],
  ["saint4ai", Saint, 120],
  ["Глубина/ритм", Depth, 110],
  ["Vox-коллаж", Vox, 120],
  ["Конвейер Higgsfield", Pipeline, 130],
  ["Пакеты Remotion", RemotionLab, 110],
  ["Наше", Ours, 120],
];
const TR = 14; // длина перехода
const W1 = 1080, H1 = 1920;
// переходы по кругу: у соседних стыков — разные
type AnyPresentation = TransitionPresentation<Record<string, unknown>>;
const transitionAt = (i: number): AnyPresentation => {
  const list = [
    slide({ direction: "from-right" }),
    iris({ width: W1, height: H1 }),
    flip({ direction: "from-left" }),
    clockWipe({ width: W1, height: H1 }),
    wipe({ direction: "from-bottom" }),
    slide({ direction: "from-bottom" }),
    fade(),
  ] as unknown as AnyPresentation[];
  return list[i % list.length];
};
// начало каждой главы на общей шкале (переходы съедают TR кадров на стык)
const starts: number[] = [];
CHAPTERS.reduce((t, [, , d], i) => {
  starts[i] = t;
  return t + d - TR;
}, 0);
const seriesEnd = starts[CHAPTERS.length - 1] + CHAPTERS[CHAPTERS.length - 1][2];
export const SP2 = { rewind: seriesEnd, final: seriesEnd + 30, end: seriesEnd + 30 + 150 };

const BG = [
  { color: "rgba(123,59,255,0.75)", x: 18, y: 15, r: 950 },
  { color: "rgba(59,75,255,0.6)", x: 85, y: 50, r: 850, speed: 1.3 },
  { color: "rgba(255,46,136,0.35)", x: 35, y: 92, r: 900, speed: 0.8 },
];

const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  return <Solid width={width} height={height} effects={[lightLeak({ seed: 3, progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp) })]} />;
};

// Пока идёт переход, глава уезжает за кадр — это не ошибка вёрстки: для проверки зон помечаем эти кадры как декор
const TransitionGuard: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill data-fit={f < TR || f > d - TR ? "decor" : undefined}>{children}</AbsoluteFill>;
};

const Scenes: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {CHAPTERS.flatMap(([name, Comp, d], i) => {
        const items = [
          <TransitionSeries.Sequence key={name} durationInFrames={d} premountFor={fps} name={`${i} ${name}`}>
            <TransitionGuard d={d}>
              <LivingGradient base={C.ink} blobs={BG} offset={starts[i]} />
              <Comp />
            </TransitionGuard>
          </TransitionSeries.Sequence>,
        ];
        if (i < CHAPTERS.length - 1) {
          items.push(<TransitionSeries.Transition key={`t${i}`} presentation={transitionAt(i)} timing={springTiming({ config: { damping: 200 }, durationInFrames: TR })} />);
        }
        return items;
      })}
    </TransitionSeries>
  );
};

const CMD = "npx skills add Sandovich/motion-studio";
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const sub = interpolate(f, [34, 46], [0, 1], { ...clamp, easing: ease });
  const cmd = interpolate(f, [50, 62], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Orbit cx={CX} cy={660} rx={360} ry={190} color={C.lime} start={26} />
      <DropWord text="MOTION" at={0} top={520} size={106} font={wide} color={C.cream} left={CX - 300} width={600} />
      <DropWord text="STUDIO" at={8} top={665} size={106} font={wide} color={C.lime} left={CX - 300} width={600} />
      <div style={{ position: "absolute", left: CX - 300, width: 600, top: 880, textAlign: "center", fontFamily: wide, fontWeight: 800, fontSize: 34, lineHeight: 1.25, color: C.cream, opacity: sub, translate: `0 ${(1 - sub) * 24}px` }}>
        Скилл бесплатный.
        <br />
        Ставится одной командой.
      </div>
      <div style={{ position: "absolute", left: CX - 300, width: 600, top: 1020, display: "flex", justifyContent: "center", opacity: cmd, translate: `0 ${(1 - cmd) * 24}px` }}>
        <div style={{ padding: "18px 22px", borderRadius: 18, backgroundColor: "#15151F", border: `2px solid ${C.lime}`, fontFamily: mono, fontWeight: 500, fontSize: 23, color: C.cream, whiteSpace: "nowrap" }}>
          <span style={{ color: C.lime }}>$ </span>
          {CMD}
        </div>
      </div>
      <Title text="github.com/Sandovich/motion-studio" top={1140} max={26} color={C.cream} at={66} weight={700} width={560} />
      {[0, 2, 4, 6, 8, 10].map((d) => <Sfx key={`a${d}`} s="pop" at={4 + d} volume={0.35} rate={0.9 + d * 0.03} />)}
      {[0, 2, 4, 6, 8, 10].map((d) => <Sfx key={`b${d}`} s="pop" at={12 + d} volume={0.35} rate={1.05 + d * 0.03} />)}
      <Sfx s="hit" at={26} volume={0.8} />
      <Sfx s="click" at={52} volume={0.6} />
      <Sfx s="ding" at={68} volume={0.5} />
    </AbsoluteFill>
  );
};

export const SkillPromo2: React.FC = () => {
  const music = (fr: number) => interpolate(fr, [0, 4, SP2.rewind - 4, SP2.rewind, SP2.final - 2, SP2.final + 2, SP2.end - 20, SP2.end], [0, 0.5, 0.5, 0.1, 0.1, 0.55, 0.55, 0], clamp);
  return (
    <SfxPack.Provider value={PRO_PACK}>
      <AbsoluteFill style={{ backgroundColor: C.ink }}>
        <Audio src={staticFile("music/tech-house.mp3")} trimBefore={489} volume={music} />
        <Scenes />
        {/* световые вспышки поверх нескольких стыков (lightLeak из @remotion/effects) */}
        {[1, 5, 9, 15].map((i) => (
          <Sequence key={i} from={starts[i] - 4} durationInFrames={TR + 10} name={`light leak ${i}`}>
            <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.85 }}>
              <LightLeak />
            </AbsoluteFill>
          </Sequence>
        ))}
        <Sequence from={SP2.rewind} durationInFrames={SP2.final - SP2.rewind} name="Перемотка">
          <SfxMute.Provider value>
            <Rewind from={SP2.rewind} speed={Math.ceil(SP2.rewind / 30)} label="◀◀ REW" font={mono}>
              <Scenes />
            </Rewind>
          </SfxMute.Provider>
          <Sfx s="rewind" at={0} volume={0.8} />
        </Sequence>
        <Sequence from={SP2.final} durationInFrames={SP2.end - SP2.final} name="Финал">
          <SceneFx dur={SP2.end - SP2.final} exit="none">
            <LivingGradient base={C.ink} blobs={BG} offset={SP2.final} />
            <Final />
          </SceneFx>
        </Sequence>
        <Hud total={SP2.end} labels={false} />
        <FitProbe />
      </AbsoluteFill>
    </SfxPack.Provider>
  );
};
