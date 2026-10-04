// Промо скилла v4 — 6 разобранных рилсов, каждый повторён в СВОЁМ стиле (шрифт, палитра, раскладка, ассеты как в оригинале):
// Grafigator · Dami «Cast» · «Дубль» · Ev Astapov · Vox-коллаж (Sanjar) · saint4ai. Всё бесплатно: шрифты Google,
// фото из общественного достояния (вырезка U²-Net локально), стеклянные 3D-предметы saint4ai (MIT), спикер и звук Mixkit.
// Переходы — @remotion/transitions (не шейдерные), вспышки — lightLeak. Музыка тише эффектов (0,16).
import React from "react";
import { Audio } from "@remotion/media";
import { lightLeak } from "@remotion/effects/light-leak";
import { TransitionSeries, springTiming, type TransitionPresentation } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, Sequence, Solid, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DropWord, FitProbe, PRO_PACK, Sfx, SfxPack, clamp } from "./components";
import { Dami, Grafigator, Hook } from "./promo3/Ch1";
import { Dubl, Ev } from "./promo3/Ch2";
import { Saint, Vox } from "./promo3/Ch3";
import { CX, F } from "./promo3/theme";

const CMD = "npx skills add Sandovich/motion-studio";
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sub = spring({ frame: f - 30, fps, config: { damping: 15, stiffness: 120 } });
  const cmd = spring({ frame: f - 44, fps, config: { damping: 15, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 25% 20%, #3B2BFF 0%, transparent 50%), radial-gradient(circle at 80% 80%, #FF3E9A 0%, transparent 45%), #0D0D16" }}>
      <DropWord text="MOTION" at={0} top={600} size={98} font={F.unbounded} color="#F1ECE3" left={CX - 320} width={640} />
      <DropWord text="STUDIO" at={8} top={725} size={98} font={F.unbounded} color="#C6F24E" left={CX - 320} width={640} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontFamily: F.unbounded, fontWeight: 800, fontSize: 29, lineHeight: 1.3, color: "#F1ECE3", opacity: sub, translate: `0 ${(1 - sub) * 30}px` }}>
        Скилл бесплатный.
        <br />
        Ставится одной командой.
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1070, display: "flex", justifyContent: "center", opacity: cmd, translate: `0 ${(1 - cmd) * 30}px` }}>
        <div style={{ padding: "18px 22px", borderRadius: 18, backgroundColor: "#15151F", border: "2px solid #C6F24E", fontFamily: F.mono, fontWeight: 500, fontSize: 23, color: "#F1ECE3", whiteSpace: "nowrap" }}>
          <span style={{ color: "#C6F24E" }}>$ </span>
          {CMD}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontFamily: F.unbounded, fontWeight: 700, fontSize: 24, color: "rgba(241,236,227,0.75)", opacity: cmd }}>github.com/Sandovich/motion-studio</div>
      {[0, 2, 4, 6, 8, 10].map((d) => <Sfx key={`a${d}`} s="pop" at={4 + d} volume={0.6} rate={0.9 + d * 0.03} />)}
      {[0, 2, 4, 6, 8, 10].map((d) => <Sfx key={`b${d}`} s="pop" at={12 + d} volume={0.6} rate={1.05 + d * 0.03} />)}
      <Sfx s="hit" at={24} volume={0.9} />
      <Sfx s="click" at={46} volume={0.7} />
      <Sfx s="ding" at={52} volume={0.6} />
    </AbsoluteFill>
  );
};

const CHAPTERS: [string, React.FC, number][] = [
  ["Хук", Hook, 80],
  ["Grafigator", Grafigator, 150],
  ["Dami Cast", Dami, 150],
  ["Дубль", Dubl, 165],
  ["Ev Astapov", Ev, 150],
  ["Vox-коллаж", Vox, 150],
  ["saint4ai", Saint, 165],
  ["Финал", Final, 140],
];
const TR = 14;
type AnyP = TransitionPresentation<Record<string, unknown>>;
const TRANS = [
  iris({ width: 1080, height: 1920 }),
  slide({ direction: "from-right" }),
  clockWipe({ width: 1080, height: 1920 }),
  wipe({ direction: "from-bottom" }),
  flip({ direction: "from-left" }),
  slide({ direction: "from-bottom" }),
  iris({ width: 1080, height: 1920 }),
] as unknown as AnyP[];
const starts: number[] = [];
CHAPTERS.reduce((t, [, , d], i) => {
  starts[i] = t;
  return t + d - TR;
}, 0);
export const SP3_END = starts[CHAPTERS.length - 1] + CHAPTERS[CHAPTERS.length - 1][2];

const Guard: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill data-fit={f < TR || f > d - TR ? "decor" : undefined}>{children}</AbsoluteFill>;
};
const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  return <Solid width={width} height={height} effects={[lightLeak({ seed: 7, progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp) })]} />;
};

export const SkillPromo3: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (fr: number) => interpolate(fr, [0, 6, SP3_END - 24, SP3_END], [0, 0.16, 0.16, 0], clamp);
  return (
    <SfxPack.Provider value={PRO_PACK}>
      <AbsoluteFill style={{ backgroundColor: "#0D0D16" }}>
        <Audio src={staticFile("music/tech-house.mp3")} trimBefore={489} volume={music} />
        <TransitionSeries>
          {CHAPTERS.flatMap(([name, Comp, d], i) => {
            const items = [
              <TransitionSeries.Sequence key={name} durationInFrames={d} premountFor={fps} name={`${i} ${name}`}>
                <Guard d={d}>
                  <Comp />
                </Guard>
              </TransitionSeries.Sequence>,
            ];
            if (i < CHAPTERS.length - 1) items.push(<TransitionSeries.Transition key={`t${i}`} presentation={TRANS[i]} timing={springTiming({ config: { damping: 200 }, durationInFrames: TR })} />);
            return items;
          })}
        </TransitionSeries>
        {[2, 4, 6].map((i) => (
          <Sequence key={i} from={starts[i] - 4} durationInFrames={TR + 10} name={`вспышка ${i}`}>
            <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.8 }}>
              <LightLeak />
            </AbsoluteFill>
          </Sequence>
        ))}
        <FitProbe />
      </AbsoluteFill>
    </SfxPack.Provider>
  );
};
