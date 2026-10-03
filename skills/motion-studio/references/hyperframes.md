# HyperFrames — второй движок (HTML → видео)

github.com/heygen-com/hyperframes · Apache-2.0 · ~56k★ · от HeyGen. Claude пишет обычную HTML-страницу с таймингом в `data-*`-атрибутах и GSAP-таймлайном → локальный рендер в MP4 (headless Chrome + ffmpeg). Аккаунт HeyGen не нужен (только для `hyperframes cloud`). Используется в рилсах «Claude made this whole video» (#hyperframe), скилле /brag и паке Charlie Hills для экспорта.

## Установка
```bash
npx skills add heygen-com/hyperframes        # 21 скилл-агент
npx hyperframes doctor                        # проверка: Node, ffmpeg, headless Chrome, память
npx hyperframes init my-video && cd my-video
npx hyperframes preview --background          # Studio
npx hyperframes check                         # lint + runtime + layout + motion + contrast (0 findings)
npx hyperframes snapshot --at 1.5,4,7         # контрольные кадры
npx hyperframes render                        # MP4 — после одобрения
npx hyperframes transcribe audio.mp3 --model small --json   # локальный Whisper (small.en — только англ.)
```

## Контракт композиции (минимум)
```html
<div id="root" data-composition-id="reel-2" data-width="1080" data-height="1920" data-fps="60" data-duration="12">
  <section class="scene clip" data-start="0" data-duration="2.4"><h1 class="title">…</h1></section>
  <video class="clip" data-start="11.14" data-duration="3" data-track-index="0" src="page.mp4"></video>
  <audio id="vo" data-start="0" data-track-index="2" data-volume="1" src="voice.wav"></audio>
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(".title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
  window.__timelines["reel-2"] = tl;      // ключ = data-composition-id
</script>
```
Правила (линтер ловит): один paused GSAP-таймлайн на композицию; длина = `data-duration` корня; не сочетать CSS `transform` и GSAP-твин того же свойства (`fromTo` вместо этого); у каждого `<audio>` есть id (иначе тишина); без `crossorigin` на медиа; не твинить `visibility/autoAlpha/display` у `.clip` (анимировать ребёнка); именованный шрифт = локальный `@font-face`; без `Math.random/Date.now`; позиции не через `getBoundingClientRect` во время твина; только `x/y/scale/rotation/opacity`, не `width/top/left`.

## Маршрутизация (точка входа — скилл `hyperframes`)
| Задача | Скилл-воркфлоу |
|---|---|
| Порт из Remotion | remotion-to-hyperframes |
| Презентация/деки | slideshow |
| Простые субтитры на говорящую голову | embedded-captions (35 стилей-«ДНК»: chrome, cream, documentary, editorial, glitch, ink, keynote, loud, neon, velocity…; матинг — текст за человеком; локально) |
| Дизайн-карточки/титры/цифры поверх говорящей головы | talking-head-recut (транскрипт → storyboard.json → карточки HTML → сборка; клип играет нетронутым; 16:9/9:16/4:5) |
| Ролик под музыку (бит-сетка) | music-to-video |
| Короткий моушн <10–30 с без голоса | motion-graphics (кинетика, счётчик, график, лого-стинг, лоуэр-терд, карта, твит/статья, UI-анимация; можно прозрачный оверлей) |
| Видео из GitHub PR | pr-to-video |
| Промо сайта/продукта/приложения | product-launch-video |
| Эксплейнер темы без съёмок | faceless-explainer |
| Всё остальное | general-video |
Домены: hyperframes-core (контракт), -animation (правила, блюпринты, переходы, адаптеры GSAP/Lottie/Three/Anime/CSS/WAAPI/TypeGPU, 24 текстовых эффекта), -keyframes (зумы, Ken Burns, камера, маски, SVG-морф), -creative (палитры, типографика, нарратив, бит-план), -audio (микс, дакинг, эффекты), media-use (музыка, SFX, лого, TTS, транскрипция, удаление фона, грейдинг), -registry (~400 готовых блоков: CRT, glitch, зерно, shimmer, графики, терминал, карта, конфетти — искать ДО ручной сборки), -cli, -studio, figma.

## Remotion или HyperFrames?
- Remotion: React-экосистема, интерактивный Studio с правкой в код, Zod-параметры и пакетный рендер, прозрачный ProRes, карты, плеер для сайта, Lambda.
- HyperFrames: ниже порог (HTML+GSAP), 21 готовый воркфлоу, сильные субтитры и оверлеи на говорящую голову, локальный Whisper из коробки, 400 блоков.
- Один ролик — один движок.
