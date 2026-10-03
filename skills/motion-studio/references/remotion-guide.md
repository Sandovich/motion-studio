# Remotion — полный практический справочник

Remotion 4.x: видео как React-компоненты. Кадр = функция номера кадра. Рендер — headless Chrome + ffmpeg → MP4/WebM/ProRes/GIF/PNG-секвенция. Сайт: remotion.dev · исходники: github.com/remotion-dev/remotion.

**Лицензия.** Бесплатно (в т.ч. коммерчески): частное лицо, компания до 3 сотрудников, некоммерческая организация, оценка. Крупнее — Company License (remotion.pro). Нельзя продавать/перелицензировать изменённый Remotion.

---

## 1. Проект

```bash
npx create-video@latest --yes --blank --no-tailwind my-video   # новая папка
cd my-video && npm i
npx remotion skills add      # официальные агент-скиллы Remotion в проект (.agents/.claude)
npm run dev                  # = npx remotion studio → http://localhost:3000
```
- Пустая папка → можно `npx create-video@latest --yes --blank --no-tailwind .` (удалить только мусор вроде .DS_Store; .git/.env — не трогать).
- Нужны Node.js и Git. Пакеты `@remotion/*`, `zod`, `mediabunny` ставить ТОЛЬКО через `npx remotion add <pkg>` (подбирает совпадающую версию).
- Структура: `src/index.ts` (registerRoot) → `src/Root.tsx` (список `<Composition>`) → компоненты сцен. Ассеты — `public/`, ссылка `staticFile("file.png")`.
- Сначала открыть Studio (превью), потом писать композицию — пользователь видит процесс. Рендер — только когда явно попросили («отрендери», «дай MP4»).

## 2. Композиция

```tsx
// Root.tsx
import { Composition, Folder } from "remotion";
export const RemotionRoot = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={450} fps={30} width={1080} height={1920}
      defaultProps={{ title: "Привет" }} />
    <Folder name="Scenes">{/* сцены отдельными композициями для правки */}</Folder>
  </>
);
```
Форматы: Reel/Stories/TikTok 1080×1920 · LinkedIn/Instagram-лента 1080×1350 · квадрат 1080×1080 · YouTube 1920×1080. fps: 30 стандарт; 60 — для «Apple-гладкости» (шаблон Bosso); 24 + «на двойках» — для рукотворного/документального.

## 3. Анимация — только от кадра

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
const frame = useCurrentFrame();
const { fps, width, height, durationInFrames } = useVideoConfig();

style={{
  opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  translate: interpolate(frame, [0, 20], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
  scale: interpolate(frame, [0, 20], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", output: "perceptual-scale" }),
  rotate: interpolate(frame, [0, 30], ["-8deg", "0deg"], { extrapolateRight: "clamp" }),
}}
```
- **Запрещено:** CSS `transition`/`animation`, Tailwind-анимации (не рендерятся), `Math.random()` без seed, `Date.now()`, `setTimeout`. Случайность — `random("seed-1")` из remotion.
- Без `clamp` значения уходят за диапазон — почти всегда ставить clamp.
- Easing: `Easing.bezier(0.16,1,0.3,1)` — «премиум ease-out» по умолчанию; `Easing.spring({damping:200})` — толчок без отскока; несколько ключей → массив easing из n−1 элементов.
- `output: "perceptual-scale"` для scale — иначе на больших значениях рост кажется медленнее.
- `posterize: 2` — «движение на двойках» (каждая поза держится 2 кадра).
- Раздельные свойства `scale`/`translate`/`rotate` лучше строки `transform` (правятся в Studio). `transform` — только для skew/perspective/цепочек.
- `spring({ frame, fps, config: { damping: 200 } })` → 0..1 физическая пружина; для отскока damping ~10–15, для «без отскока» 200.
- Держать `interpolate()` прямо в `style` — тогда ключи редактируются в Studio.

## 4. Время: Sequence, Series, TransitionSeries

```tsx
<Sequence from={30} durationInFrames={60} premountFor={fps}><Title/></Sequence>   // внутри useCurrentFrame() начинается с 0
<Series>
  <Series.Sequence name="Хук" durationInFrames={78} premountFor={fps}><Hook/></Series.Sequence>
  <Series.Sequence name="Счётчик" durationInFrames={78} premountFor={fps}><Counter/></Series.Sequence>
</Series>
```
- `premountFor={fps}` на всех Sequence/медиа — заранее грузит, без мигания.
- Переходы: `npx remotion add @remotion/transitions`
```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";      // + slide({direction:"from-left"}), wipe, flip, clockWipe
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60} premountFor={fps}><A/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
  <TransitionSeries.Sequence durationInFrames={60} premountFor={fps}><B/></TransitionSeries.Sequence>
</TransitionSeries>
```
  Переход НАКЛАДЫВАЕТ сцены → общая длина = сумма − длины переходов (60+60−15=105). `TransitionSeries.Overlay` (напр. light leak) — поверх склейки, длину не меняет; Overlay не может стоять рядом с Transition.
- Light leak: `@remotion/effects/light-leak` → `<Solid effects={[lightLeak({progress})]}/>` в Overlay.
- Многосценное видео: каждая сцена — свой компонент/файл, зарегистрирована как отдельная композиция (папка Scenes) → у неё свой таймлайн в Studio.

## 5. Медиа
```tsx
import { Video, Audio } from "@remotion/media";      // npx remotion add @remotion/media
import { staticFile, Img, AnimatedImage } from "remotion";
<Video src={staticFile("clip.mp4")} premountFor={fps} objectFit="cover" volume={0.8} trimBefore={30} trimAfter={300} playbackRate={1} />
<Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, 30], [0, 0.5], { extrapolateRight: "clamp" })} />
```
- Картинки: `<Img>`/`<CanvasImage>`; GIF/APNG/WebP — `<AnimatedImage>` (синхронно с таймлайном).
- Lottie — `@remotion/lottie`; 3D — `@remotion/three` (React Three Fiber, кадр через `useCurrentFrame`).
- Длительность/размер медиа — mediabunny (`getVideoDuration`, `getAudioDuration`), динамическая длина композиции — `calculateMetadata`.
- ffmpeg — для обрезки, тишины (silence detection), перекодирования исходников.

## 6. Шрифты (кириллица!)
```tsx
import { loadFont } from "@remotion/google-fonts/Inter";   // npx remotion add @remotion/google-fonts
const { fontFamily } = loadFont("normal", { weights: ["400","800"], subsets: ["latin", "cyrillic"] });
```
Без `subsets: ["cyrillic"]` русский текст рисуется запасным шрифтом. Локальный шрифт — `@remotion/fonts` `loadFont({family, url: staticFile("x.woff2")})`. Измерение текста/влезания — `@remotion/layout-utils` (`measureText`, `fitText`).

## 7. Звук
- Готовые SFX по URL: `https://remotion.media/` + `whoosh.wav`, `whip.wav`, `page-turn.wav`, `switch.wav`, `mouse-click.wav`, `shutter-modern.wav`, `shutter-old.wav`, `ding.wav`, `vine-boom.wav`, `record-scratch.wav`, `yippee.wav`, `snapchat-notification.wav`, `mac-quack.wav`, `windows-xp-error.wav` (и мемные: bruh, anime-wow, wilhelm-scream…). Больше — github.com/kapishdima/soundcn.
- Музыка: Mixkit (бесплатно) — резать смены картинки по BPM: кадр удара = round(n × 60/BPM × fps).
- Озвучка: ElevenLabs API (`eleven_multilingual_v2`, ключ `ELEVENLABS_API_KEY`, платно) → mp3 по сценам в public/ → `calculateMetadata` считает длительность сцен по аудио. Локальная альтернатива — Kokoro TTS / HyperFrames `tts`.
- Визуализация звука — `@remotion/media-utils` (`useAudioData`, `visualizeAudio`) → бары/волна/бас-реакция.
- Правила микса: голос сверху, музыка ≥15 дБ ниже под словами, whoosh на появление титра, hit на «приземление», мастер −14 LUFS / −1 dBTP (ffmpeg `loudnorm`).

## 8. Субтитры
Тип `Caption` из `@remotion/captions`: `{ text: " слово", startMs, endMs, timestampMs, confidence, pageBreakAfter? }` — **пробел перед словом обязателен**.
- Транскрипция: `@remotion/whisper-webgpu` (`transcribe`, модель `small.en`; для русского — `small` + `language`) — **нужна хорошая видеокарта с WebGPU**. Без неё — faster-whisper (Python):
```python
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = m.transcribe("audio.mp3", language="ru", word_timestamps=True)
caps = [{"text": " " + w.word.strip(), "startMs": int(w.start*1000), "endMs": int(w.end*1000), "timestampMs": int((w.start+w.end)*500), "confidence": None} for s in segs for w in s.words]
```
  (На Windows писать результат в файл с `encoding="utf-8"`, не печатать кириллицу в консоль.) Или `npx hyperframes transcribe audio.mp3 --model small`. Импорт .srt — `parseSrt` из `@remotion/captions`.
- Отображение: элемент Basic Captions (remotion.dev/elements/captions/basic-captions) или свой компонент (`KaraokeCaptions` в templates — страница из N слов, текущее подсвечено). `createTikTokStyleCaptions()` из `@remotion/captions` — группировка по страницам.
- Субтитры инлайнить массивом прямо в проп — тогда их можно править в Studio.

## 9. Эффекты
Порядок предпочтения: (1) обычный HTML/CSS (blur, clip-path, mask, gradient, SVG); (2) эффект на элементе или обёртка `<HtmlInCanvas effects={[…]}>` (`@remotion/effects`: готовые + `createEffect()` для своих шейдеров); (3) Three.js/шейдер. Motion blur — `@remotion/motion-blur` (`<CameraMotionBlur>`/`<Trail>`) или HTML-in-canvas; на тяжёлых сценах дорого.
Подсветки текста (маркер, обвод кругом, подчёркивание, зачёркивание, рамка) — анимировать SVG-путь `strokeDashoffset` (компонент `DrawPath`).
Карты — `remotion-maps` (Mapbox/MapLibre/MapTiler/Cesium 3D-пролёт; детерминизм: ждать загрузку тайлов `delayRender`).

## 10. Интерактивность в Studio
`Interactive.withSchema({ Component, componentName, schema, wrapInSequence: true })` + схема пропов (`text-content`, `color`…) → правка текста/цветов прямо в Studio с записью в код. Параметризация композиции — Zod-схема (`schema` у Composition) → правка пропов в боковой панели и рендер вариантов (batch).

## 11. Рендер
```bash
npx remotion render <id> out/video.mp4                              # H.264 по умолчанию
npx remotion render <id> out/frames --frames=0,30,90 --image-format=png   # контрольные кадры
npx remotion still <id> out/still.png --frame=45                   # один кадр
npx remotion render <id> out.mov --image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444   # прозрачный для монтажки
npx remotion render <id> out.webm --image-format=png --pixel-format=yuva420p --codec=vp9                              # прозрачный для веба
npx remotion render <id> out.gif --codec=gif --every-nth-frame=2
```
Флаги: `--props='{"title":"…"}'`, `--concurrency=2` (мало RAM), `--scale=0.5` (быстрый черновик), `--crf=18`. Прозрачный рендер = оверлей поверх любого видео без хромакея (лучше «зелёного экрана» из рилса Mr. Pynk). Облако — Remotion Lambda / Cloud Run / Vercel (`remotion-saas`). Встроить плеер в сайт — `@remotion/player`.

## 12. Проверено на практике (баги и решения)
- **Слова слипаются** в flex-строке: `gap: "0 0.28em"` считает em от шрифта контейнера (16px), не слова → `columnGap: size * 0.28` в px.
- Первый кадр рисуется запасным шрифтом → грузить шрифт через `loadFont` на уровне модуля (до рендера).
- Тяжёлые blur/backdrop-filter замедляют рендер в разы → ограничивать радиус, не размывать весь кадр.
- `tsc --noEmit` перед рендером ловит ошибки типов сразу.
- Рендер 8 с 1080×1920 на слабом ноутбуке ≈ 1 мин; 12 с ≈ 1,5–2 мин.
- Удобная проверка: рендер кадров из середины каждой сцены → склейка ffmpeg `xstack` в один лист → смотреть глазами.

## 13. Обновление
`npx remotion upgrade` — Remotion, пакеты и агент-скиллы одной версии. Документация по API: remotion.dev/docs (у каждой страницы есть .md-версия: добавить `.md` к URL).
