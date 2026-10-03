# Промпты: структуры и дословный банк

## 0. Из чего состоит сильный промпт на моушн (формула, выведенная из всех источников)
```
[РОЛЬ + АМБИЦИЯ]   You're a world-class motion designer… go all out / Go crazy.
[ФОРМАТ]           [N]-second, [1080×1920 вертикаль | 1920×1080], [30/60 fps], [loop | один проход].
[СУТЬ]             о чём ролик + для кого + одна мысль, которую унести.
[ИСТОЧНИК КОНТЕНТА] «Visit [URL] to learn the brand, then write the content yourself» ИЛИ точный скрипт по фразам ИЛИ список фактов («use only these facts»).
[ДРАМАТУРГИЯ]      open with a striking hook in the first second → build through distinct techniques (typography, shape play, camera moves, colour shifts) → land on a clean memorable final frame; one cohesive story, each scene leads into the next.
[СТИЛЬ]            «read MOTION.md» ИЛИ конкретно: фон/текст/акцент hex, шрифт, фактура, референс (только look, не слова и не лого).
[РИТМ И ЗВУК]      pacing like it's cut to music; найди трек (Mixkit) и SFX; смены картинки — в удар.
[ДВИЖОК]           через Remotion | HyperFrames + GSAP; без voiceover/футажа если нужно.
[ЗАПРЕТЫ]          no typewriter headlines, no glow, no bounce, no gradients on text, no invented numbers, real logos only.
[ПРОВЕРКА]         after the build capture one frame from the middle of every scene, check cut-off text/overlaps/wrong facts, fix, keep the earlier version.
[ЯЗЫК]             текст на экране на русском.
```
Короткая версия работает (п.1), длинная даёт управляемость. Правки — отдельными однострочниками (п.7).

## Дословный банк

Источники: 10 рилсов (`reels-breakdown.md`), Charlie Hills (`charlie-motion-graphics/prompts/`), «Opus 5 Video Recreation Guide» (`recreation-guide.md`), шаблон Riccardo Bosso (`spec-ad-template.md`), Skillry (`skillry-475-prompts.md`, 475 шт).

## 1. Однострочный старт (Charlie Hills / Ev Astapov)
```
Make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are. Go all out.
```
Правки — по одной, словами: «Slow down the second scene.» · «Swap the text for mine: […]» · «Make the orange navy.» · «Use my brand colours: [hex].» · «Make it 1080 x 1350 for LinkedIn.»

## 2. Бренд-ролик по сайту (Ev Astapov, 3 промпта подряд)
```
Make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are. The content should focus on [ИМЯ], a [РОЛЬ]. He/She has a specific brand style and tone of voice. Visit the website, [URL], to learn about the personal brand, then write the video content yourself.
```
```
Rewrite the headlines to tell one cohesive story, with a clear beginning, progression, and ending. Each scene should naturally lead into the next, and the visuals and transitions should support that narrative.
```
```
Make the transitions between scenes smoother. It's okay if the video ends up being 17-19 seconds long.
```

## 3. Шоурил-промо одним промптом (Чиковинский, «Дубль», Remotion)
```
/goal You're a world-class motion designer make a dynamic 30 second motion graphics video that shows what an incredible designer you are like its your showreel for a resume to showcase you motion video skillset and capabilities go all out to impress the audience. Make it dynamic and confident: open with a striking hook in the first second, build through a sequence of distinct techniques (typography, shape play, camera moves, colour shifts), and land on a clean, memorable final frame. Pacing should feel like it's cut to music. Go crazy.
script — «[СЦЕНАРИЙ ПО ФРАЗАМ]»
твоя задача сделать крутой проморолик вертикальное видео про [ПРОДУКТ] ([ПЛАТФОРМЫ]), расскажи что это для кого, бери скрины/референсы/подготовь в том числе их сам, дизайн — ни на что не опирайся — делай сам. go all out! ты свободен в творчестве. через remotion. найди крутой трек на mixkit например и доп звуки если потребуются. текст на ру
```
Claude сам выбрал сквозной мотив (съёмочная площадка «ДУБЛЬ 01…10», REC, таймкод), трек Mixkit 123 BPM и посадил каждую смену картинки в удар.

## 4. MOTION.md из 5 референсов (brand-intake)
```
I am giving you five frames from motion graphics I already like. They are in the examples folder.

Write me one file called MOTION.md that any AI can read before it animates anything for me. It must cover:
1. Every colour as a hex code, and what each one is for
2. The fonts and the type sizes
3. Timing: how things come in, how long they hold, and how they leave
4. How things move: the frame rate, the easing, and anything that makes it feel handmade
5. Texture and finish
6. Five things my motion must never do, named plainly
7. One example, described shot by shot, of it done right

Work only from what is in the frames. Where you cannot tell, write ASK ME rather than guessing.
Show me the file before you save it.
```
Правило в CLAUDE.md (дословно, строка про амбиции обязательна — без неё выходит «слишком вежливо»):
```
Before designing, generating or animating anything, read MOTION.md in full.
Every colour, font, timing and motion value comes from that file.
The file sets the look, not the ambition. When I say go all out, go all out.
If something I ask for is not covered there, ask me rather than choosing for yourself.
When you have finished, check your own frames against MOTION.md, fix what fails, and only then show me.
```

## 5. Аудит по Apple (Emil Kowalski apple-design)
```
Use the apple-design skill to audit this animation. Give me a ranked list of everything that feels off, worst first.
```
Рус.: «Проверь эту анимацию скиллом apple-design. Дай ранжированный список всего, что выглядит неправильно, — с худшего.» Фиксы вставлять обратно по одному.

## 6. Настоящие компоненты (21st.dev) — правило в CLAUDE.md
```
Whenever I paste a component prompt or third-party component code, treat it as a structural donor only. Keep its engineering. Replace its demo copy with my real copy, and translate every colour, border, shadow, font and timing to MOTION.md.
```

## 7. Чинить одно за раз
```
effect.html is close. Fix one thing only: [что не так, напр. заголовок вылезает за плашку на 3-й секунде]. Keep the motion, the timing and the loop exactly as they are. Tell me what you changed.
```
Заметки как дизайнеру (дословно рабочие): «the text at the start undersells what's coming next» · «you can't really hear the audio on top of the sound effects» · «I wouldn't say it looks very premium.» · «This just isn't in my brand colours.» · «It takes a while to get to the reveal.» · «I hate the voice. Maybe we should just go for a nice backing soundtrack instead.»

## 8. Повторить чужой ролик (Влад Лямин + Opus 5 Recreation Guide)
Коротко: «Разбери дизайн-систему этого ролика и давай сделаем такой же.»
Развёрнуто (Recreation Guide, шаг 1): покадровый разбор — длительность и тайминг каждой сцены; число шотов/переходов; камера (zoom/pan/tilt/rotation/tracking/parallax, скорость); движение объектов (позиция/масштаб/поворот/появление/уход); стиль движения (easing, ускорение, bounce, motion blur); слои (фон/объекты/текст/UI/частицы/свет/глубина); композиция; переходы; свет/тени/glow; палитра и грейдинг → таймлайн 0–X с / X–X с / финал → план воссоздания (камера, ключи, переходы, звук) + редизайн с тем же движением в новом стиле.
Мастер-промпт редизайна: «Recreate the exact motion structure from the reference video. Keep the same pacing, camera movement, zoom speed, object placement, transitions, and overall animation flow. Do not change the timing or motion choreography. Replace the original visual design with [НОВЫЙ СТИЛЬ]…» Держать: тайминг, путь камеры, ритм, структуру переходов. Менять: цвета, материалы, графику, свет. Грейд: сбалансированный контраст, без перенасыщения/неона/«AI-glow».
⚠ Копируем ДВИЖЕНИЕ и структуру, НЕ чужие логотипы/тексты/фирменный стиль.

## 9. «Почему…?» эксплейнер (vox-explainer)
```
[Вопрос, который все задают]? And then [визуальный поворот, которого никто не ждёт]. [Метафора, которая показывает идею].
```
Пример: «Why do we dream? And then someone suddenly wakes up, zooms out of the eye, and goes into outer space. There are neural networks of interconnectivity to convey the brain.»

## 10. Спек-реклама бренда (шаблон Riccardo Bosso — полный текст в spec-ad-template.md)
Шапка: бренд/продукт · референс (или «Huel/Shopify/Spotify vibe») · идея (или «питчни 3 идеи») · скрипт · голос · длина ~18 с + энд-кард · чего избегать. ШАГ 1: не строить — написать бриф (концепт, beat sheet с таймингом, скрипт, голос, музыка, план SFX, список ассетов) и ждать ОК.
Постоянные правила: реальные лого из пресс-кита, факты с офсайта; фото фотореал с лицензиями в CREDITS.md; стиль — тёмная сцена с мягким дрейфующим брендовым свечением, Apple-like, тяжёлый motion blur, кинетическая типографика + слой моушн-графики сверху; новые анимации каждый раз; 60 fps, 16:9 и 9:16; VO — 2 дубля, бренд-имена в транскрипции, картинку подгонять под голос; музыка кодом ≥15 дБ под голосом; SFX: whoosh на каждое слово/титр, hit на каждое приземление, звук на каждое движение продукта и лого; мастер −14 LUFS / −1 dBTP; порядок: бриф→ассеты→голос→превью v1 + контакт-лист→финалы 16:9+9:16, стемы, README.

## 11. Подкаст / говорящая голова — вставки (Skillry @stokebuilder)
```
Go through the entire [episode] cut and add full-screen animations and graphics wherever they help. Be aggressive and over-inclusive: 35–50 moments, at least 2 per chapter. The goal is to fill empty talking-head time, explain ideas, and create visual hooks. Style. Pick an aesthetic that's genuinely interesting and very, very cool…
```

## 12. Эксплейнер продукта (Skillry)
```
Create a 15s motion-graphics film explaining {{PRODUCT}}. HyperFrames + GSAP, no voiceover, no footage.
```
