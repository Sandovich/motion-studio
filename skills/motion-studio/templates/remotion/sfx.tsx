// Звуковой дизайн: SFX, привязанные к кадрам анимации.
// Звуки — public/sfx/*.wav (генерируются: node scripts/make-sfx.mjs). Можно передать и URL (https://remotion.media/whoosh.wav).
import React, { createContext, useContext } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useVideoConfig } from "remotion";

export type SfxName =
  | "key-1"
  | "key-2"
  | "key-3"
  | "key-4"
  | "key-space"
  | "key-enter"
  | "whoosh"
  | "whoosh-soft"
  | "pop"
  | "pop-high"
  | "hit"
  | "ding"
  | "riser";

// Длительность каждого звука в секундах — чтобы Sequence не держал пустую дорожку.
const LEN: Record<SfxName, number> = {
  "key-1": 0.09,
  "key-2": 0.09,
  "key-3": 0.09,
  "key-4": 0.09,
  "key-space": 0.11,
  "key-enter": 0.13,
  whoosh: 0.55,
  "whoosh-soft": 0.4,
  pop: 0.16,
  "pop-high": 0.16,
  hit: 0.7,
  ding: 1.6,
  riser: 1.3,
};

// Сколько кадров звук должен опережать картинку, чтобы ощущаться синхронным:
// у whoosh пик в середине, у riser — в конце; ударные звучат ровно в кадр.
export const SFX_LEAD: Partial<Record<SfxName, number>> = {
  whoosh: 0.3,
  "whoosh-soft": 0.22,
  riser: 1.25,
};

const src = (s: SfxName | string) =>
  s.startsWith("http") ? s : staticFile(`sfx/${s}.wav`);

// Набор записанных звуков: <SfxPack.Provider value={PRO_PACK}> подменяет синтезированные звуки на настоящие записи
// (scripts/fetch-sound-pack.sh → public/sfx-pro). Имена те же, поэтому сцены переписывать не нужно.
export type PackEntry = { src: string; len: number; lead?: number; gain?: number };
// Записанные эффекты короткие: чтобы их было слышно поверх музыки, поднимаем их, а музыку держим ~на −15 дБ
const PRO_BOOST = 1.6;
export const SfxPack = createContext<Record<string, PackEntry> | null>(null);
const pk = (name: string, len: number, lead = 0, gain = 1): PackEntry => ({ src: `sfx-pro/${name}.wav`, len, lead, gain });
// длительность — до спада звука, lead — где пик (чтобы пик попал ровно в кадр события); замерено скриптом
export const PRO_PACK: Record<string, PackEntry> = {
  whoosh: pk("whoosh", 1.2, 0.98, 0.8),
  "whoosh-soft": pk("whoosh-soft", 0.6, 0.26, 0.9),
  "whoosh-slide": pk("whoosh-slide", 0.5, 0.11),
  hit: pk("hit", 1.5, 0.44, 0.9),
  pop: pk("pop", 0.2, 0.04, 0.8),
  "pop-high": pk("pop-soft", 0.25, 0.01, 0.9),
  shutter: pk("shutter", 0.45, 0.03),
  ding: pk("ding", 0.7, 0.03, 0.7),
  riser: pk("riser", 1.7, 1.61, 0.8),
  rewind: pk("rewind", 1.75, 0.28),
  glitch: pk("glitch", 0.5, 0.34, 0.7),
  "key-enter": pk("click", 0.3, 0.07),
  click: pk("click", 0.3, 0.07),
  "key-space": pk("key-5", 0.12, 0.01),
  ...Object.fromEntries([1, 2, 3, 4].map((k) => [`key-${k}`, pk(`key-${k * 2 - (k % 2)}`, 0.12, 0.01)])),
  "ui-click": pk("ui-click", 0.1, 0.01),
};
// Вариант для моды: вспышки образов — затвор камеры
export const FASHION_PACK: Record<string, PackEntry> = { ...PRO_PACK, "pop-high": PRO_PACK.shutter };

// Глушитель: всё внутри <SfxMute.Provider value> молчит (перемотка, повтор куска ролика через <Freeze>).
export const SfxMute = createContext(false);

// ── Один звук в кадр `at` (локальный кадр текущей Sequence) ──────────────
// lead=true сдвигает whoosh/riser раньше на SFX_LEAD, чтобы пик попал в `at`.
export const Sfx: React.FC<{
  s: SfxName | string;
  at: number;
  volume?: number;
  lead?: boolean;
  rate?: number;
}> = ({ s, at, volume = 0.6, lead = true, rate = 1 }) => {
  const { fps } = useVideoConfig();
  const muted = useContext(SfxMute);
  const pack = useContext(SfxPack);
  const pro = pack?.[s];
  const shift = lead ? Math.round((SFX_LEAD[s as SfxName] ?? 0) * fps) : 0;
  const dur = Math.ceil(((LEN[s as SfxName] ?? 2) / rate) * fps) + 1;
  if (muted) return null;
  if (pro) {
    const sh = lead ? Math.round((pro.lead ?? 0) * fps) : 0;
    return (
      <Sequence from={Math.max(0, at - sh)} durationInFrames={Math.ceil((pro.len / rate) * fps) + 1} layout="none" name={`♪ ${s}`}>
        <Audio src={staticFile(pro.src)} volume={Math.min(1, volume * (pro.gain ?? 1) * PRO_BOOST)} playbackRate={rate} />
      </Sequence>
    );
  }
  return (
    <Sequence
      from={Math.max(0, at - shift)}
      durationInFrames={dur}
      layout="none"
      name={`♪ ${s}`}
    >
      <Audio src={src(s)} volume={volume} playbackRate={rate} />
    </Sequence>
  );
};

// Детерминированный «разброс» по индексу — без Math.random.
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Кадр, в котором TypingInput показывает символ №i (та же формула, что в компоненте).
export const charFrame = (i: number, start: number, cps: number, fps: number) =>
  start + Math.ceil(((i + 1) * fps) / cps);

// ── Щелчки клавиатуры, синхронные с TypingInput ─────────────────────────
// Передать те же text/start/cps. 4 разных щелчка по кругу + разброс громкости и высоты —
// иначе звучит как пулемёт. Пробел — свой звук, в конце — Enter (enter=false, чтобы выключить).
export const TypingSfx: React.FC<{
  text: string;
  start: number;
  cps?: number;
  volume?: number;
  enter?: boolean;
  enterDelay?: number;
}> = ({
  text,
  start,
  cps = 22,
  volume = 0.35,
  enter = true,
  enterDelay = 8,
}) => {
  const { fps } = useVideoConfig();
  const keys: SfxName[] = ["key-1", "key-2", "key-3", "key-4"];
  return (
    <>
      {text.split("").map((ch, i) => {
        const j = jitter(i);
        return (
          <Sfx
            key={i}
            s={ch === " " ? "key-space" : keys[Math.floor(j * 4)]}
            at={charFrame(i, start, cps, fps)}
            volume={volume * (0.75 + 0.35 * jitter(i + 99))}
            rate={0.94 + 0.12 * j}
          />
        );
      })}
      {enter && (
        <Sfx
          s="key-enter"
          at={charFrame(text.length - 1, start, cps, fps) + enterDelay}
          volume={volume * 1.3}
        />
      )}
    </>
  );
};

// ── Whoosh на каждое слово BlurWords (стиль спек-рекламы) ───────────────
// Для инструкций/спокойных роликов хватит одного Sfx на весь заголовок.
export const WordSfx: React.FC<{
  text: string;
  start: number;
  perWord: number;
  volume?: number;
  s?: SfxName;
}> = ({ text, start, perWord, volume = 0.35, s = "whoosh-soft" }) => (
  <>
    {text.split(" ").map((_, i) => (
      <Sfx
        key={i}
        s={s}
        at={start + i * perWord + Math.round(perWord / 2)}
        volume={volume}
      />
    ))}
  </>
);

// ── Музыкальная подложка с плавным входом/выходом ───────────────────────
// duck: участки [from, to] (кадры), где музыка уходит на −10 дБ (под голос или важный звук).
export const MusicBed: React.FC<{
  src?: string;
  durationInFrames: number;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  duck?: [number, number][];
}> = ({
  src: file = "bed",
  durationInFrames: d,
  volume = 0.3,
  fadeIn = 20,
  fadeOut = 45,
  duck = [],
}) => (
  <Sequence durationInFrames={d} layout="none" name="♪ музыка">
    <Audio
      src={src(file)}
      volume={(f) => {
        const edge = interpolate(f, [0, fadeIn, d - fadeOut, d], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const ducked = Math.min(
          1,
          ...duck.map(([a, b]) =>
            interpolate(f, [a - 8, a, b, b + 8], [1, 0.32, 0.32, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          ),
        );
        return volume * edge * ducked;
      }}
    />
  </Sequence>
);
