# saint4ai · Reels Pipeline Автомонтаж — что взято и когда открывать

Источник: **[saint4ai/reels-pipline-automotaj](https://github.com/saint4ai/reels-pipline-automotaj)** — автор Alexander (@saint4ai), **onAI Academy** (onai.academy). Лицензия **MIT** с условием атрибуции (`saint4ai/NOTICE`): сохранять `LICENSE` и `NOTICE`, указывать источник и не выдавать метод за свой. Копия от 03.10.2026 лежит в `references/saint4ai/` почти целиком. Не перенесены звуки `studio/public/sfx` (лицензия не указана), шрифты (бесплатные OFL, есть на Google Fonts), логотипы сервисов (это товарные знаки) и записи автора.

## Когда это нужнее нашего

Наш motion-studio силён в рекламе и эксплейнерах без человека в кадре. saint4ai построен под **говорящую голову**: спикер внизу, графика сверху, субтитры капсулой, плюс **подкаст-нарезка** и **YouTube 16:9**. Если у пользователя есть запись лица или подкаст — начинать отсюда.

| Задача | Куда смотреть |
|---|---|
| Выбрать стиль ролика со спикером, показать варианты картинкой | `saint4ai/reference/style-previews/styles.jpg` (стили 1–4) и `more-styles.jpg` (5–12); описание — `saint4ai/knowledge/montage-concepts.md` |
| Механика конкретного стиля (раскладка, код, что владелец принимал и отклонял) | `saint4ai/patterns/styles/<стиль>/PATTERN.md`, кадры — `saint4ai/patterns/reels/<ролик>/frames.jpg` |
| Каталог всего (стили, блоки движения, переходы, эффекты текста) | `saint4ai/patterns/README.md` |
| 62 приёма анимации: что показывает, механика, когда уместен | `saint4ai/knowledge/01_catalog.md` (большой — читать поиском по разделу) |
| Смысл фразы → приём, плотность, цветовой код, раскладка | `saint4ai/knowledge/03_rules.md` |
| Ритм, склейки, джамп-каты, что выглядит дорого/дёшево | `saint4ai/knowledge/02_editing.md`, `saint4ai/patterns/techniques/montage-principles.md` |
| Разговорный / подкаст / экспертный рилс | `saint4ai/knowledge/11_formats.md`, `saint4ai/docs/agent-contract/PODCAST-ARCHETYPES.md` |
| Подкаст: найти сильные куски, нарезать, кадрировать спикера | `saint4ai/studio/scripts/cut-podcast.py`, `podcast-index.py`, `podcast-speaker.py`, `saint4ai/workflows/podcast-clip-mining.js` |
| Хуки, живая речь, CTA, стоп-лист штампов | `saint4ai/knowledge/06_copywriting.md` (частично по CC BY 4.0 Rob Palmer — атрибуция в `THIRD_PARTY_NOTICES.md`), навык текста рилса — `saint4ai/patterns/writing/reels-script/` |
| Удержание, эмоция, комментарии | `saint4ai/patterns/techniques/reels-retention-plan-2026-09-19.md` |
| Предмет превращается по смыслу фразы | `saint4ai/patterns/techniques/object-transformation-patterns.md` |
| Звук: выбор по действию, обрезка, вариации | `saint4ai/patterns/techniques/audio-apple-pack.md` (наши звуки — `sound-design.md`) |
| Разборы чужих сильных авторов (Pronin, Dashi, Apple-стиль, 21st.dev) | `saint4ai/patterns/breakdowns/` |
| Этапы работы с владельцем и стоп-точки | `saint4ai/docs/agent-contract/WORKFLOW.md` (у нас то же самое в SKILL.md §2) |
| Как не сжечь подписку на длинном монтаже | `saint4ai/docs/checklist.md` (кратко ниже) |
| Безопасные зоны Instagram/TikTok: оверлеи и обоснование | `saint4ai/reference/platform-guides/` |

## Код (образец, не запускать целиком)

`saint4ai/studio/` — их студия Remotion + Storybook (1440×2560, 60 fps). Зависимости, которых нет у нас: `@heroui/react`, `@react-three/fiber`, `three`, `@remotion/three`, `@remotion/transitions`, `@remotion/tailwind-v4`, `culori`, `react-aria*`. Блок переносится в наш проект поштучно: скопировать файл в `src/`, поставить нужный пакет (`npx remotion add @remotion/three` и т. п.), подогнать под 1080×1920. Шапку атрибуции в файле сохранить.

| Нужно | Файл |
|---|---|
| Жидкое стекло с преломлением, капсулы | `studio/src/kit/liquid/` |
| Постерная типографика | `studio/src/kit/poster.tsx` |
| Переходы сцен: portal, blurThrough, bloom, whip, shrinkTo, lift | `studio/src/kit/presentations.tsx` |
| 3D-телефон, иллюминатор, прожектор, тогл+курсор, штекер, окно браузера | `studio/src/kit/` |
| Эффекты текста: маркер, глитч, барабан слов, рукописная обводка, печать, терминал | `studio/src/kit/remocn/` |
| Блоки движения: колода, рентген, слот-машина, разрыв кадра, перемотка, разбор на детали, подарок | `studio/src/examples/vibe/blocks/` |
| Стили 5–12 на одном движке | `studio/src/styles/engine.tsx` и файлы стилей |
| Субтитры-капсула без вылезания текста | `studio/src/montage/Captions.tsx` |
| Стеклянные 3D-предметы (webp + промпт генерации рядом) | `studio/public/objects/` |

## Что уже встроено в наш скилл

1. **Безопасная зона Instagram Reels 1080×1920** (по гайду Meta и замеру автора): заголовки, субтитры, CTA, логотипы — **x 120–840, y 260–1360**. Справа от 840 — лента кнопок (лайк, коммент, отправить), ниже 1360 — профиль, подпись, навигация. Фон и декор могут уходить в край.
2. **Проверка текста до рендера** — наша версия их `qa-fit`, работает на любой композиции без переделки компонентов:
   ```bash
   # в композицию последним слоем: <FitProbe />   (src/components/qa.tsx)
   node scripts/qa-fit.mjs <композиция> [src/index.ts]   # → FIT PASS / FIT FAIL со списком
   node scripts/qa-fit.mjs FitTest                        # контроль: ОБЯЗАН дать FIT FAIL (3 находки)
   ```
   Ловит: текст вылез из блока (`overflow-x`), текст за кадром (`off-frame`), критичный текст под интерфейсом Instagram (`ui-zone`). Макеты экранов, декор и входящую анимацию пометить `data-fit="decor"`, служебное — `data-fit="ignore"`. Грабля, найденная при переносе: Remotion растягивает кадр уже после монтирования, поэтому зонд ждёт, пока корень получит размер. Без этого мерил нулевой контейнер, и контроль проходил вслепую.
3. **Правила кадра** (из их `remotion-montage`): один главный объект ≥ 50 % зоны графики, не больше трёх смысловых элементов в кадре, новый элемент не чаще раза в 1,2 с. 6–9 событий на 30 с. Ни одного пустого кадра: первый кадр не пустой, после стыка нет голого фона. Названный сервис — только его настоящий логотип. Курсор кликает по пункту, а не проезжает мимо. Эмоция вместо перечисления: пункт зачёркивается и вспыхивает, число считается с нуля.
4. **Экономия подписки** (их замеры: 74,5 % расхода дают параллельные субагенты, чтение всех файлов — 0,3 %): без веера субагентов, кадры смотреть листами, один ролик — одна свежая сессия, рендер фоновой задачей без опроса в цикле, большие справочники (`01_catalog.md`, `timochko-techniques.md`) читать поиском по разделу, не целиком.

## Атрибуция при публикации

Если ролик или материал собран на их стиле или блоке, достаточно строки «метод/блоки — saint4ai/reels-pipline-automotaj (onAI Academy)» в описании репозитория или проекта. В самом ролике подпись не нужна.
