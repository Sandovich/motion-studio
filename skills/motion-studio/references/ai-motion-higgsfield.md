# ИИ-моушн через Higgsfield MCP (рилсы 13–14, Sanjar Nai-Chien)

Второй путь, кроме «всё кодом»: картинку и движение **генерирует** видеомодель (Seedance 2.5) прямо из Claude через Higgsfield MCP, а Remotion только собирает: субтитры, строка промпта, звук, сплит со спикером. Так делают Vox-коллажи, тушь на рваной бумаге, плоский вектор, клеймейшн — стили, которые кодом рисовать долго или невозможно.

**Деньги:** любой вызов генерации списывает кредиты. Перед КАЖДЫМ запуском — модель, параметры, кредиты, € (1 кр ≈ €0,048 на Pro), остаток — и ждать «да». Справочные вызовы (`balance`, `models_explore`, `get_explainer_presets`, `get_workflow_instructions`) бесплатные.

## Что показали рилсы
- **13 — DceFNdVM-NG** «Vox-style motion design»: коллаж в стиле Vox — рваная бумага, вырезанные фото зданий, гравюры, жёлтый круг-солнце, рука-гравюра, бумажная текстура, крупный serif-логотип, жёлтые рукописные обводки маркером, счётчик просмотров. Правка **одной фразой** в строке промпта поверх видео: «Change the background to blue», «Swap out the building», «Add animated falling coins», «Remove the background». Формат: сверху анимация, снизу говорящая голова, слово-субтитр капсом посередине. Связка: Higgsfield MCP + Seedance 2.5 (режим правки видео).
- **14 — DagCtA_MA5s** «Claude generates full motion graphics in 5 minutes»: конвейер целиком в Claude — (1) референсы стиля (у него через Pinterest API; у нас — референсы пользователя, поиск в интернете или Chrome); (2) раскадровка-варианты в выбранном стиле, промпт на экране: «Storyboard a 15-sec origami samurai short, ink wash on torn paper, indigo and bone»; (3) выбрать лучший → «Use motion design skills to make a motion video with Higgsfield MCP» → анимация с единым стилем, движением и светом; (4) примеры стилей: тушь на рваной бумаге, плоский вектор оранжево-чёрный (часы, голова-силуэт, монеты), мультяшный 3D, коллажи. Сплит со спикером, крупные слова-субтитры.

## Конвейер у нас
1. **Стиль.** Каталог стилей Higgsfield (бесплатно): `get_explainer_presets` — 22 пресета, близкие к рилсам: **Mixed Media** (Vox-коллаж: вырезки, рваные бумажные плашки), **Paper collage**, **Editorial Motion Graphics**, **Paper Diorama**, **Poster Vector**, **Watercolor Chronicle**, **Hand Drawn**, **3D Papercraft**, Claymotion, Pastel Flat 2D, Isometric Flat Vector, Low Poly, Pixel Art и др. Выбранный → `resolve_explainer_preset` → media_id стилевого референса.
2. **Раскадровка** (курс SYNTX, урок 4.5): кадры-ключи картинкой — `nano_banana_pro` 2K ≈ 2 кр/кадр или `gpt_image_2_5` ≈ 2,75 кр. Для Seedance **цвет скетча = стиль видео**: монохромный скетч — только для композиции; если нужен именно стиль коллажа — делать цветные стилевые кадры. 4–6 кадров на 10–15 с.
3. **Анимация** — `seedance_2_5`, режим `omni_reference` (кадры + стиль-референс) или start/end-кадры. Длительность 4–30 с, 480p/720p/1080p. Ориентир цены: 720p 10 с ≈ 70 кр (≈ €3,4). Сначала `draft: true` (480p, дешевле) → понравилось → `draft_job_id` до 1080p.
4. **Правка одной фразой** — `seedance_2_5` `mode: "video_edit"` (оплата по длине исходника): шаблоны EDIT из скилла `ai-video-generation` (`references/edit-extend.md`) — всегда с диапазоном «с X по Y секунду»: смена фона/цвета, замена объекта, добавить анимированные элементы, удалить фон. Много вариантов одного ролика — workflow `ad-multiplier`.
5. **Сборка в Remotion**: `<Video>` сгенерированных клипов + `PromptBar` (строка промпта с печатью и стрелкой) + `MarkerCircle` (жёлтая рукописная обводка) + слова-субтитры + `SfxPack`/музыка + проверка `qa-fit`. Сплит «анимация сверху / спикер снизу» — если есть запись лица.

## Промпт Vox-коллажа (каркас, по курсу: тип → крупность → субъект в действии → детали → ракурс → фон → свет → настроение → камера)
```
Vox-style editorial mixed-media collage animation, vertical 9:16. [СУБЪЕКТ — вырезанное фото/гравюра] cut out with
white paper edge, placed on aged off-white paper with visible fibers; torn paper strips with [ЦВЕТ] sky photo behind;
a flat [yellow #F2B705] circle sun; halftone engraving texture; a vintage engraved hand [ДЕЙСТВИЕ];
small birds as cutouts drifting. Motion: paper layers slide in with stop-motion jitter (12 fps feel), parallax between
layers, torn edges flutter, [ОБЪЕКТ] rises from the bottom; camera slow push-in. Muted newsprint palette with one
[accent] accent. No text, no letters, no logos.
```
Текст, логотипы и цифры поверх (как «Vox», счётчик просмотров) — **кодом в Remotion**, не генерацией (нейросети ломают буквы, особенно русские — курс, общие правила).

## Подключение в Claude Code
Higgsfield MCP: `claude mcp add` по инструкции higgsfield.ai/mcp (вход делает пользователь). Пакеты сценариев MCP: `get_workflow_instructions` → `faceless-video` (озвученный объясняющий ролик с закреплённым стилем), `video-editing` (Higgsedit: монтаж и моушн-графика), `video-montage`, `ad-multiplier`.
