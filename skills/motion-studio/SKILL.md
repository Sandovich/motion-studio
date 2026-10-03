---
name: motion-studio
description: Полный скилл моушн-графики КОДОМ через Claude Code — Remotion (основной) и HyperFrames. Внутри всё нужное — справочник Remotion с кодом, структуры и банк дословных промптов, разбор 475 промптов Opus 5.5 со Skillry (10 каркасов, приёмы мастерства, каталог ссылок, скрипт полной выгрузки), разбор 10 рилсов, MOTION.md и бриф-шаблоны, 13 рецептов Charlie Hills и 16 эффектов, проверенная библиотека компонентов (пословные субтитры, счётчик, табло, вайп, печать в поле, караоке), проверка кадров и экспорт в рилс. Use when the user asks for a motion graphic, animated reel/promo/explainer/launch video, kinetic text, animated chart/counter, subtitles or overlays on a talking-head video, «сделай моушн», «смонтируй рилс через Remotion», «промо-ролик», «анимированный текст», «как у Apple», «повтори этот ролик», or pastes a reference video to recreate. Not for AI-generated live footage (Seedance/Kling/Veo).
---

# motion-studio — моушн-видео кодом

Каждый кадр — код (React в Remotion или HTML+GSAP в HyperFrames), рендер локально в MP4. Без After Effects, CapCut и видеогенераторов. Модель: Opus 5.5 (`/model`).

## 0. Сначала — подходит ли запрос
- Графика, текст, UI, цифры, схемы, титры, субтитры, оверлеи, промо продукта, эксплейнер → **здесь**.
- Нужны сгенерированные реальные кадры (люди, предметы, природа) → видеогенератор, не этот скилл. Код не рисует фотореалистичного человека.

## 1. Выбор движка (один ролик — один движок)

| Задача | Движок | Рецепт внутри скилла |
|---|---|---|
| Пользователь сказал «через Remotion», нужен Studio/параметры/прозрачный оверлей/карты | **Remotion** | `references/remotion-guide.md` + `templates/remotion/` |
| Промо продукта/оффера/курса 30–45 с | Remotion или HF | `charlie-motion-graphics/skills/launch-video/RECIPE.md` |
| Apple-стиль (менюбар, выемка → виджеты) | Remotion/HF | `.../apple-launch-film/RECIPE.md` |
| Эксплейнер «почему…?» 30–60 с | Remotion/HF | `.../vox-explainer/RECIPE.md` |
| Анимированный график (петля) | любой | `.../animated-chart/RECIPE.md` |
| Число-веха (частицы → число) | любой | `.../milestone-reveal/RECIPE.md` |
| Один из 16 премиум-эффектов в бренде | любой | `.../motion-effects/RECIPE.md` + `references/effects.md` |
| 3D-титры (Three.js) | любой | `.../title-sequence-3d/RECIPE.md` |
| Промо рассылки / GIF-обложка / сравнение 3 моделей | любой | `newsletter-promo`, `loop-cover`, `model-showdown` RECIPE.md |
| Говорящая голова + графика сверху, подкаст-нарезка, YouTube 16:9 (12 стилей: канвас, стекло, постер, сцены, PRISM, ORBIT…) | Remotion | `references/saint4ai.md` → `references/saint4ai/` |
| Субтитры / дизайн-карточки на говорящую голову | HyperFrames (или Remotion `KaraokeCaptions`) | `references/hyperframes.md` |
| Ролик под музыку (бит-синк) | HyperFrames | `references/hyperframes.md` |
| Горизонталь → готовый рилс | ffmpeg | `references/export-qa.md` §2 |
| Повторить чужой ролик в своём стиле | любой | `references/recreation-guide.md` + prompts.md §8 |
| Спек-реклама бренда со звуком | любой | `references/spec-ad-template.md` |
| Звук: печать, whoosh, pop, hit, ding, музыка, мастер | Remotion | `references/sound-design.md` |
По умолчанию — **Remotion** (если не сказано иное). Все рецепты Charlie написаны под «один HTML с `window.seek(seconds)`»; в Remotion то же самое = композиция, где всё вычисляется из `useCurrentFrame()` — рецепт (сцены, тайминги, правила, проверки) переносится 1:1.

## 2. Порядок работы (не пропускать)
1. **Бренд.** Есть `MOTION.md` (+ `brand.md`)? Нет → процесс brand-intake (`references/motion-design-system.md` §1, шаблон `templates/MOTION.template.md`): интервью в 2 пакета + 3–5 кадров-референсов → MOTION.md с ASK ME вместо догадок → правило «read MOTION.md first» в CLAUDE.md проекта. Без MOTION.md результат не называть «в бренде».
2. **Бриф и beat sheet** (`templates/BRIEF.template.md`): сцены с секундами, дословный текст, звук. Показать и **ждать «да»**. Все цифры/имена/даты — только из списка фактов; нет данных — спросить.
3. **Проект.** Remotion: `npx create-video@latest --yes --blank --no-tailwind <name>` → `npm i` → `npx remotion add @remotion/google-fonts` → скопировать `templates/remotion/components.tsx` в `src/components/index.tsx` + проверка: `templates/remotion/qa.tsx` → `src/components/qa.tsx`, `qa-fit.mjs` → `scripts/` + звук: `npx remotion add @remotion/media`, `templates/remotion/sfx.tsx` → `src/components/sfx.tsx`, `make-sfx.mjs` и `master-audio.sh` → `scripts/`, `node scripts/make-sfx.mjs` → открыть Studio (`npm run dev`).
4. **Сборка.** Первые 10 с — в 2–3 вариантах стиля, выбрать, достроить. Каждая сцена — свой компонент; `Series`/`TransitionSeries`; `premountFor={fps}`. **Звук — сразу, не дожидаясь просьбы** (`references/sound-design.md`): `Sfx`/`TypingSfx`/`MusicBed` от тех же кадров, что анимация.
5. **Проверка текста автоматом**: `<FitProbe />` последним слоем + `node scripts/qa-fit.mjs <композиция>` → должно быть `FIT PASS` (текст не вылез из блоков и не залез под кнопки Instagram; `FitTest` обязан падать). **Затем кадры глазами** (`references/export-qa.md` §1): кадр из середины каждой сцены → лист → смотреть. Исправлять реальное, хранить прошлую версию.
6. **Аудит движения** apple-design: «ранжированный список всего, что выглядит неправильно, с худшего» → фиксы по одному (`motion-design-system.md` §4).
7. **Рендер MP4 — только по явной просьбе.** До этого — превью в Studio.
8. **Сдача:** мастер звука `bash scripts/master-audio.sh raw.mp4 final.mp4` (−14 LUFS, ≤ −1 dBTP) + путь к файлу + 3 контрольных кадра; для соцсетей — проверки `export-qa.md` §2 (h264, yuv420p, bt709, tv-range, faststart, aac).
9. **Правки** — по одной («Fix one thing only…», prompts.md §7), остальное не трогать.

## 3. Правила (кратко; полностью — `motion-design-system.md` §3)
Факты первыми · только реальные лого/скриншоты · запрещены typewriter-заголовки, glow, bounce, градиенты на тексте, фиолетово-синий «AI-фон» · хук в первые 3 с · премиум = один объект меняет форму + «призрак» исходного состояния · соседние сцены разной раскладки · звук обязателен для промо/эксплейнера (whoosh на титр, hit на приземление, музыка ≥15 дБ под голосом, −14 LUFS) · вертикаль: заголовок ≥84 px, текст ≥44 px, safe zone рилса x 120–840, y 260–1360 (справа кнопки, снизу подпись; гайд Meta + замер saint4ai) · детерминизм: всё от `useCurrentFrame()`, никаких CSS-анимаций и `Math.random` без seed.

## 4. Карта знаний (что где лежит)

| Нужно | Файл |
|---|---|
| Как писать промпт, формула из 10 блоков, дословные рабочие промпты | `references/prompts.md` |
| 10 каркасов промптов и приёмы лучших авторов из 475 роликов Opus 5.5 | `references/skillry-patterns.md` |
| Каталог 475 роликов со ссылками на исходные промпты | `references/skillry-index.md`; полные тексты локально: `python scripts/fetch-skillry-prompts.py` из репозитория motion-studio (≈8 мин) |
| Remotion: проект, анимация, Sequence/переходы, медиа, шрифты-кириллица, звук, субтитры, эффекты, рендер, прозрачность, найденные баги | `references/remotion-guide.md` |
| MOTION.md, тайминги по умолчанию, правила дома, аудит Apple, 21st.dev, как давать правки | `references/motion-design-system.md` |
| Каталог приёмов и 8 стилей-пресетов из рилсов (+ какой есть в коде) | `references/techniques.md` |
| Покадровый разбор 11 рилсов с промптами и командами | `references/reels-breakdown.md` |
| Повтор чужого ролика: покадровый анализ → таймлайн → редизайн → грейд | `references/recreation-guide.md` |
| Стили монтажа со спикером (12), 62 приёма анимации, смысл→приём, подкаст-нарезка, экономия подписки, безопасные зоны IG/TikTok — материалы saint4ai (MIT, с атрибуцией) | `references/saint4ai.md` |
| Звуковой дизайн: компоненты Sfx/TypingSfx/WordSfx/MusicBed, свой набор звуков, карта «событие → звук», громкости, мастер, проверка | `references/sound-design.md` |
| Спек-реклама: бриф, голос, музыка, SFX, мастер, порядок, Resolve-проект | `references/spec-ad-template.md` |
| Проверка кадров, экспорт в рилс, сравнение моделей, GIF-петля, прозрачность, громкость | `references/export-qa.md` |
| HyperFrames: установка, контракт HTML, 21 воркфлоу, когда он лучше Remotion | `references/hyperframes.md` |
| Инструменты, установка, что платно, Skillry, связка «5 плагинов» | `references/ecosystem.md` |
| 13 рецептов + 5 файлов промптов Charlie Hills (MIT) | `references/charlie-motion-graphics/` |
| Шаблоны MOTION.md и брифа; компоненты Remotion, звук (`sfx.tsx`, `make-sfx.mjs`, `master-audio.sh`), проверка текста (`qa.tsx`, `qa-fit.mjs`) | `templates/` |
| Проверенные компоненты Remotion + 2 демо-композиции | `templates/remotion/components.tsx`, `Showcase.tsx`, `Proof.tsx` |

## 5. Окружение и подвохи
- Node ≥20, ffmpeg. Remotion бесплатен для частных лиц и команд ≤3 человек.
- Кириллица: `loadFont("normal", { subsets: ["latin","cyrillic"] })`.
- Слабая видеокарта → не `@remotion/whisper-webgpu`; субтитры через faster-whisper (`word_timestamps=True`) или `npx hyperframes transcribe --model small` (не `small.en` для русского).
- Windows: вывод кириллицы писать в файл с UTF-8, не печатать в консоль; мало RAM → `--concurrency=2`.
- Платное (ElevenLabs, Skillry Pro, облачный рендер) — только с согласия пользователя.
