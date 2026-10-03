# Экосистема: инструменты, установка, цены

## Ядро (всё бесплатно)
| Инструмент | Что | Установка |
|---|---|---|
| Claude Code + Opus 5.5 | «моушн-дизайнер»: пишет каждый кадр кодом. Все авторы рилсов подчёркивают выбор Opus 5.5 (`/model`); у одного автора Codex с задачей не справился | claude.com/claude-code |
| Remotion (~61k★) | видео на React | `npx create-video@latest`, скиллы `npx remotion skills add` (= `npx skills add remotion-dev/skills`) |
| HyperFrames (~56k★, HeyGen) | видео из HTML+GSAP | `npx skills add heygen-com/hyperframes` |
| Motion Graphics Skill Pack (Charlie Hills, MIT) | 13 скиллов: brand-intake, motion-brief-writer, launch-video, apple-launch-film, vox-explainer, animated-chart, milestone-reveal, motion-effects, title-sequence-3d, model-showdown, newsletter-promo, loop-cover, reel-export | `npx skills add charlie947/motion-graphics-skills` (полный текст уже в `references/charlie-motion-graphics/`) |
| apple-design (Emil Kowalski) | правила движения Apple, аудит | `npx skills add emilkowalski/skills --skill apple-design` |
| Скиллы Emil Kowalski (~42k★) | плавность, скорость, длительность анимаций | `npx skills add emilkowalski/skills` |
| taste-skill (Leonxlnx, ~91k★) | анти-шаблонный дизайн, без «AI-слопа» | github.com/Leonxlnx/taste-skill |
| impeccable (pbakaus) | 24 команды дизайна: /critique /audit /layout /polish /animate… | github.com/pbakaus/impeccable |
| /brag (latent-spaces) | проект → 20-с промо-ролик одной командой (HyperFrames, ~10 мин, ≈$6 токенов на средний проект) | github.com/latent-spaces/brag |
| 21st.dev | реальные UI-компоненты с «Copy prompt» | сайт + правило «structural donor» |
| ffmpeg | экспорт, оверлеи, GIF, проверки | ffmpeg.org |
| faster-whisper | субтитры по словам без GPU | `pip install faster-whisper` |
| Mixkit | бесплатная музыка и SFX | mixkit.co |

Связка «5 бесплатных плагинов» (рилс Чингиза): HyperFrames + Remotion + taste-skill + impeccable + скиллы Эмиля Ковальски — «Claude ведёт ролик от первого кадра до субтитров».

## Платное (только осознанно)
- ElevenLabs — озвучка (оценить кредиты до запуска, 2 дубля за вызов).
- Skillry Pro ($9.99/мес, $79/год, $169 навсегда) — каталог платных скиллов (142 видео-скилла). Бесплатно: раздел «Opus 5.5 videos» — 475 роликов с исходными промптами и ремейками (копия: `skillry-475-prompts.md`).
- HyperFrames cloud / Remotion Lambda — облачный рендер.

## Skillry «Opus 5.5 videos» — как использовать
Категории: Motion graphics 288 · Games 70 · Explainers 62 · 3D scenes 55. Берёшь пример → копируешь промпт → кидаешь Claude → он повторяет; затем меняешь контент/бренд. В локальной копии искать по ключевым словам (`grep -i "remotion\|hyperframes\|three.js" skillry-475-prompts.md`), по автору, по категории. Ссылка «оригинал» ведёт на исходный пост автора.

## Где брать вдохновение и референсы
skillry.dev/ai-videos/opus-5-5 · Dribbble/Pinterest (5 кадров для MOTION.md) · 21st.dev (компоненты) · remotion.dev/showcase · HyperFrames registry.
