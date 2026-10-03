# motion-studio

Скилл для Claude Code, который делает моушн-видео **кодом**: Remotion (основной движок) и HyperFrames. Каждый кадр — код, рендер локально в MP4, без After Effects и генераторов видео.

| Демо компонентов (`Showcase`, 12 с) | Первый тест (`Proof`, 8 с) |
|---|---|
| [examples/showcase.mp4](examples/showcase.mp4) | [examples/proof.mp4](examples/proof.mp4) |

**Видео-инструкция по установке (38 с):** [examples/tutorial.mp4](examples/tutorial.mp4)

## Установка скилла (1 команда)

```bash
npx skills add Sandovich/motion-studio -a claude-code -y
```
Или вручную: скопировать папку `skills/motion-studio` в `~/.claude/skills/` (для всех проектов) или в `.claude/skills/` проекта.

Расширенная установка (+ официальные скиллы Remotion, apple-design; с `--full` ещё Charlie Hills и HyperFrames):
```bash
git clone https://github.com/Sandovich/motion-studio && bash motion-studio/scripts/install-skills.sh
```

## Что внутри скилла (`skills/motion-studio/`)

| Файл | Содержание |
|---|---|
| `SKILL.md` | Вход: выбор движка, порядок работы (бренд → бриф → сборка → проверка кадров → аудит → рендер), правила, карта знаний |
| `references/prompts.md` | Формула сильного промпта из 10 блоков + дословные рабочие промпты (старт одной строкой, бренд по сайту, шоурил, MOTION.md, Apple-аудит, 21st.dev, повтор чужого ролика, «почему…», спек-реклама, подкаст-вставки) |
| `references/skillry-patterns.md` | Разбор 475 промптов Opus 5.5 со Skillry: 10 рабочих каркасов, приёмы лучших авторов, статистика |
| `references/skillry-index.md` | Каталог всех 475 роликов со ссылками на исходные промпты |
| `scripts/fetch-skillry-prompts.py` | Собирает все 475 полных промптов локально: `python scripts/fetch-skillry-prompts.py` (~8 мин) |
| `references/remotion-guide.md` | Полный практический справочник Remotion: проект, анимация, переходы, медиа, кириллица, звук, субтитры, эффекты, рендер, прозрачность, найденные баги |
| `references/motion-design-system.md` | MOTION.md и brand.md, тайминги по умолчанию, 13 правил качества, аудит «как у Apple», 21st.dev, как давать правки |
| `references/techniques.md` | Каталог приёмов и 8 стилей-пресетов из рилсов |
| `references/reels-breakdown.md` | Покадровый разбор 10 рилсов: промпты, команды, приёмы |
| `references/recreation-guide.md` | Как повторить чужой ролик в новом стиле |
| `references/spec-ad-template.md` | Шаблон спек-рекламы бренда (голос, музыка, SFX, мастер) |
| `references/export-qa.md` | Проверка кадров, экспорт в рилс, сравнение моделей, GIF-петля, громкость |
| `references/hyperframes.md` | Второй движок: контракт HTML, 21 воркфлоу, когда он лучше |
| `references/ecosystem.md` | Все инструменты, установка, что платно |
| `references/charlie-motion-graphics/` | 13 рецептов + промпты Charlie Hills (MIT) |
| `templates/` | MOTION.md, бриф, библиотека проверенных компонентов Remotion и 2 демо |

## Remotion-проект в этом репо

```bash
npm i
npm run dev                                   # Studio — превью
npx remotion render Showcase out/showcase.mp4 # рендер демо
```
`src/components/index.tsx` — 9 компонентов: BlurWords (пословное проявление), CountUp, DrawPath, SplitFlap (табло), CircleWipe, TypingInput (печать в поле), KaraokeCaptions (субтитры), GlassCard, GlowBackground.

## Как пользоваться
Откройте Claude Code (модель Opus 5.5) и опишите ролик: «сделай 15-секундный моушн-промо для …», «субтитры на мой рилс», «повтори движение этого ролика в моём стиле». Для своего стиля сначала дайте 3–5 кадров-референсов — скилл соберёт MOTION.md.

## Лицензии
Код и тексты репозитория — для личного использования. Рецепты Charlie Hills — MIT (`references/charlie-motion-graphics/LICENSE`). Remotion бесплатен для частных лиц и команд до 3 человек (remotion.dev/license). Промпты Skillry принадлежат их авторам (ссылки на оригиналы внутри).
