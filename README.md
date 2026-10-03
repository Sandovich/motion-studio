# motion-studio

**Промо скилла (61 с, всё — кодом):** [examples/skill-promo.mp4](examples/skill-promo.mp4) — по главе на каждый из разобранных рилсов (Grafigator, Dami ×2, «Дубль», Ev Astapov, Riccardo, Ледовских, Чингиз, Лямин ×2, Mr. Pynk, brag, saint4ai) + наша проверка безопасных зон. Перед рендером: `bash scripts/fetch-sound-pack.sh` (записанные звуки и музыка Mixkit, в репо не кладутся).

Скилл для Claude Code, который делает моушн-видео **кодом**: Remotion (основной движок) и HyperFrames. Каждый кадр — код, рендер локально в MP4, без After Effects и генераторов видео.

| Демо компонентов (`Showcase`, 12 с) | Первый тест (`Proof`, 8 с) |
|---|---|
| [examples/showcase.mp4](examples/showcase.mp4) | [examples/proof.mp4](examples/proof.mp4) |

**Видео-инструкция по установке (38 с, со звуком):** [examples/tutorial.mp4](examples/tutorial.mp4)

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
| `references/reels-breakdown.md` | Покадровый разбор 12 рилсов: промпты, команды, приёмы |
| `references/recreation-guide.md` | Как повторить чужой ролик в новом стиле |
| `references/sound-design.md` | Звуковой дизайн: щелчки печати синхронно с текстом, whoosh/pop/hit/ding/riser, музыка, громкости, мастер −14 LUFS |
| `references/saint4ai.md` + `references/saint4ai/` | Материалы [saint4ai/reels-pipline-automotaj](https://github.com/saint4ai/reels-pipline-automotaj) (onAI Academy, MIT): 12 стилей монтажа со спикером, 62 приёма, подкаст-нарезка, безопасные зоны Instagram/TikTok, код студии как образец |
| `references/spec-ad-template.md` | Шаблон спек-рекламы бренда (голос, музыка, SFX, мастер) |
| `references/export-qa.md` | Проверка кадров, экспорт в рилс, сравнение моделей, GIF-петля, громкость |
| `references/hyperframes.md` | Второй движок: контракт HTML, 21 воркфлоу, когда он лучше |
| `references/ecosystem.md` | Все инструменты, установка, что платно |
| `references/charlie-motion-graphics/` | 13 рецептов + промпты Charlie Hills (MIT) |
| `templates/` | MOTION.md, бриф, библиотека проверенных компонентов Remotion, звук (`sfx.tsx`, `make-sfx.mjs`, `master-audio.sh`) и 2 демо |

## Remotion-проект в этом репо

```bash
npm i
npm run dev                                   # Studio — превью
npx remotion render Showcase out/showcase.mp4 # рендер демо
```
`src/components/index.tsx` — 9 компонентов: BlurWords (пословное проявление), CountUp, DrawPath, SplitFlap (табло), CircleWipe, TypingInput (печать в поле), KaraokeCaptions (субтитры), GlassCard, GlowBackground.

**Шоурил-эффекты** (`src/components/fx.tsx`, `iphone.tsx`): Hud, Punch, ParticleText, CardTunnel, Stripes, Halftone, ShapeGrid, Rewind, DropWord, Orbit, реалистичный IPhone. Образец целиком — композиция `SkillPromo` (`npx remotion render SkillPromo out/promo.mp4`).

**Звук** (`src/components/sfx.tsx`): `Sfx` (звук в кадр), `TypingSfx` (щелчок клавиши на каждый символ TypingInput + Enter), `WordSfx` (whoosh на слово), `MusicBed` (музыка с fade и приглушением под голос).
```bash
node scripts/make-sfx.mjs 40                          # свой набор звуков → public/sfx (синтез кодом, без лицензий)
npx remotion render Tutorial out/raw.mp4
bash scripts/master-audio.sh out/raw.mp4 out/final.mp4  # −14 LUFS, пик ≤ −1 dBTP
```

**Проверка текста до рендера** (`src/components/qa.tsx` + `scripts/qa-fit.mjs`, идея и зоны — saint4ai): текст не вылез из блоков и не залез под кнопки Instagram (x 120–840, y 260–1360).
```bash
node scripts/qa-fit.mjs Tutorial   # FIT PASS
node scripts/qa-fit.mjs FitTest    # контроль: обязан дать FIT FAIL
```

## Как пользоваться
Откройте Claude Code (модель Opus 5.5) и опишите ролик: «сделай 15-секундный моушн-промо для …», «субтитры на мой рилс», «повтори движение этого ролика в моём стиле». Для своего стиля сначала дайте 3–5 кадров-референсов — скилл соберёт MOTION.md.

## Лицензии
Папка `skills/motion-studio/references/saint4ai/` и идея проверки `qa-fit` — из [saint4ai/reels-pipline-automotaj](https://github.com/saint4ai/reels-pipline-automotaj), автор Alexander (@saint4ai), onAI Academy, лицензия MIT с атрибуцией (`references/saint4ai/LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md` сохранены). Код и тексты репозитория — для личного использования. Рецепты Charlie Hills — MIT (`references/charlie-motion-graphics/LICENSE`). Remotion бесплатен для частных лиц и команд до 3 человек (remotion.dev/license). Промпты Skillry принадлежат их авторам (ссылки на оригиналы внутри).
