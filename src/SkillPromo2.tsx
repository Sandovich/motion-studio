// Большое промо скилла motion-studio: по главе на каждый разобранный рилс (12 рилсов + saint4ai, Dami ×2, Grafigator ×2).
// Плавность Dami: один живой градиент на весь ролик, сцены внахлёст с наездом-размытием (SceneFx).
// Только Unbounded (+ Inter/JetBrains Mono в интерфейсах), записанные звуки (PRO_PACK) и музыка Tech House vibes (Mixkit, 120 BPM).
// Перед рендером: bash scripts/fetch-sound-pack.sh (звуки и музыку в репо не кладём — лицензия Mixkit).
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DropWord, FitProbe, Hud, LivingGradient, Orbit, PRO_PACK, Rewind, SceneFx, Sfx, SfxMute, SfxPack, clamp, ease } from "./components";
import { Chingiz, DamiCast, Dubl, Ev, Grafigator, Hook, Ledovskikh, Riccardo, Tally } from "./promo/ChaptersA";
import { Brag, Depth, Lyamin1, Lyamin2, Ours, Pynk, Saint } from "./promo/ChaptersB";
import { C, CX, mono, wide } from "./promo/kit";

const T = 12; // нахлёст сцен
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
  ["Наше", Ours, 120],
];
const starts: number[] = [];
CHAPTERS.reduce((t, [, , d], i) => {
  starts[i] = t;
  return t + d - T;
}, 0);
const last = CHAPTERS.length - 1;
export const SP2 = { rewind: starts[last] + CHAPTERS[last][2] - T, final: 0, end: 0 };
SP2.final = SP2.rewind + 30;
SP2.end = SP2.final + 150;

const Scenes: React.FC = () => (
  <>
    {CHAPTERS.map(([name, Comp, d], i) => (
      <Sequence key={name} from={starts[i]} durationInFrames={d} name={`${i} ${name}`}>
        <SceneFx dur={d} enter={i === 0 ? "none" : "zoom"} exit="zoom">
          <Comp />
        </SceneFx>
      </Sequence>
    ))}
  </>
);

const CMD = "npx skills add Sandovich/motion-studio";
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const sub = interpolate(f, [34, 46], [0, 1], { ...clamp, easing: ease });
  const cmd = interpolate(f, [50, 62], [0, 1], { ...clamp, easing: ease });
  const link = interpolate(f, [66, 78], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Orbit cx={CX} cy={660} rx={390} ry={200} color={C.lime} start={26} />
      <DropWord text="MOTION" at={2} top={520} size={124} font={wide} color={C.cream} />
      <DropWord text="STUDIO" at={12} top={670} size={124} font={wide} color={C.lime} />
      <div style={{ position: "absolute", left: 120, width: 720, top: 880, textAlign: "center", fontFamily: wide, fontWeight: 800, fontSize: 36, lineHeight: 1.25, color: C.cream, opacity: sub, translate: `0 ${(1 - sub) * 24}px` }}>
        Скилл бесплатный.
        <br />
        Ставится одной командой.
      </div>
      <div style={{ position: "absolute", left: 120, width: 720, top: 1020, display: "flex", justifyContent: "center", opacity: cmd, translate: `0 ${(1 - cmd) * 24}px` }}>
        <div style={{ padding: "18px 24px", borderRadius: 18, backgroundColor: "#15151F", border: `2px solid ${C.lime}`, fontFamily: mono, fontWeight: 500, fontSize: 25, color: C.cream, whiteSpace: "nowrap" }}>
          <span style={{ color: C.lime }}>$ </span>
          {CMD}
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, width: 720, top: 1140, textAlign: "center", fontFamily: wide, fontWeight: 700, fontSize: 26, color: C.cream, opacity: link }}>github.com/Sandovich/motion-studio</div>
      {[0, 2, 4, 6, 8, 10].map((d) => <Sfx key={`a${d}`} s="pop" at={6 + d} volume={0.35} rate={0.9 + d * 0.03} />)}
      {[0, 2, 4, 6, 8, 10].map((d) => <Sfx key={`b${d}`} s="pop" at={16 + d} volume={0.35} rate={1.05 + d * 0.03} />)}
      <Sfx s="hit" at={28} volume={0.8} />
      <Sfx s="click" at={52} volume={0.6} />
      <Sfx s="ding" at={68} volume={0.5} />
    </AbsoluteFill>
  );
};

const BG = [
  { color: "rgba(123,59,255,0.75)", x: 18, y: 15, r: 950 },
  { color: "rgba(59,75,255,0.6)", x: 85, y: 50, r: 850, speed: 1.3 },
  { color: "rgba(255,46,136,0.35)", x: 35, y: 92, r: 900, speed: 0.8 },
];

export const SkillPromo2: React.FC = () => {
  const music = (fr: number) => interpolate(fr, [0, 4, SP2.rewind - 4, SP2.rewind, SP2.final - 2, SP2.final + 2, SP2.end - 20, SP2.end], [0, 0.5, 0.5, 0.1, 0.1, 0.55, 0.55, 0], clamp);
  return (
    <SfxPack.Provider value={PRO_PACK}>
      <AbsoluteFill style={{ backgroundColor: C.ink }}>
        <LivingGradient base={C.ink} blobs={BG} />
        <Audio src={staticFile("music/tech-house.mp3")} trimBefore={489} volume={music} />
        <Scenes />
        <Sequence from={SP2.rewind} durationInFrames={SP2.final - SP2.rewind} name="Перемотка">
          <SfxMute.Provider value>
            <Rewind from={SP2.rewind} speed={Math.ceil(SP2.rewind / 30)} label="◀◀ REW" font={mono}>
              <LivingGradient base={C.ink} blobs={BG} />
              <Scenes />
            </Rewind>
          </SfxMute.Provider>
          <Sfx s="rewind" at={0} volume={0.8} />
        </Sequence>
        <Sequence from={SP2.final} durationInFrames={SP2.end - SP2.final} name="Финал">
          <SceneFx dur={SP2.end - SP2.final} exit="none">
            <Final />
          </SceneFx>
        </Sequence>
        <Hud total={SP2.end} labels={false} />
        <FitProbe />
      </AbsoluteFill>
    </SfxPack.Provider>
  );
};
