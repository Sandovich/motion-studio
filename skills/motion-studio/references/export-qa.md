# Проверка качества и экспорт

## 1. Проверка кадров (до показа пользователю)
1. Отрендерить кадр из СЕРЕДИНЫ каждой сцены:
   `npx remotion render <id> out/frames --frames=45,120,200 --image-format=png`
2. Склеить в один лист и посмотреть глазами:
```bash
ffmpeg -y -i out/frames/element-045.png -i out/frames/element-120.png -i out/frames/element-200.png \
  -filter_complex "[0]scale=360:-1[a];[1]scale=360:-1[b];[2]scale=360:-1[c];[a][b][c]hstack=3" sheet.jpg
```
3. Чек-лист: обрезанный/вылезающий текст · наложения · слипшиеся слова · читаемость на телефоне (смотреть в 360 px ширины) · все цифры = бриф, символ в символ · цвета/шрифты = MOTION.md · первые 3 с уже показывают суть · CTA держится ≥3 с · ничего «гладкого» там, где должно быть «на двойках».
4. Для петли: кадры 0, 1, 2.2, 4.4, 6.6, 7.9, 8 с — 0 и 8 идентичны; 0, 1, 2.2 различаются (иначе часть эффекта не работает); на 4.4 смысл читается одним стоп-кадром.
5. Исправлять только реальное, сохранять предыдущую версию, перепроверять теми же кадрами. Не выдумывать «улучшения», если проблем нет.
6. Аудит движения скиллом apple-design (см. motion-design-system.md §4).

## 2. Готовый рилс для Instagram/TikTok (reel-export)
Вертикаль 1080×1920; горизонтальное видео 16:9 при ширине 1080 = высота 608 → ставить на y 660, заголовок сверху в safe zone (y 360–1420, не в правых 120 px). Оверлей (заголовок, лого на тёмных скруглённых плашках) сверстать в HTML прозрачным PNG.
```bash
ffmpeg -y -i in.mp4 -loop 1 -i overlay.png -f lavfi -i anullsrc=r=48000:cl=stereo -filter_complex \
"color=c=0x0B0B0F:s=1080x1920:r=30[bg];[0:v]fps=30,scale=1080:-2,setsar=1[v];[bg][v]overlay=0:660:shortest=1[o];[o][1:v]overlay=0:0:shortest=1,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[out]" \
-map "[out]" -map 2:a -shortest -c:v libx264 -profile:v high -crf 18 -pix_fmt yuv420p -color_range tv \
-colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 128k -movflags +faststart reel.mp4
```
(Если у видео свой звук — `-map 0:a` вместо `-map 2:a`.) Проверка перед загрузкой:
```bash
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,pix_fmt,color_range,color_space -of compact reel.mp4
```
Годен: h264, 1080×1920, yuv420p, color_range=tv, bt709 + один aac. `hevc` или `color_range=pc` → перекодировать (телефонные записи часто HEVC full-range → «выцветают»). Без `+faststart` ролик не стартует до полной загрузки. Хук — две короткие строки.

## 3. Сравнение трёх моделей одним роликом (model-showdown)
Три панели 1080×360 на y 540 / 900 / 1260 поверх тёмного фона + прозрачный overlay.png с заголовком и подписями моделей (на тёмных плитках, полное имя с версией):
```bash
ffmpeg -y -i a.mp4 -i b.mp4 -i c.mp4 -loop 1 -i overlay.png -f lavfi -i anullsrc=r=48000:cl=stereo -filter_complex "color=c=0x0B0B0F:s=1080x1920:r=30:d=12[bg];[0:v]fps=30,scale=1080:360:force_original_aspect_ratio=increase,crop=1080:360,setsar=1[a];[1:v]fps=30,scale=1080:360:force_original_aspect_ratio=increase,crop=1080:360,setsar=1[b];[2:v]fps=30,scale=1080:360:force_original_aspect_ratio=increase,crop=1080:360,setsar=1[c];[bg][a]overlay=0:540[t1];[t1][b]overlay=0:900[t2];[t2][c]overlay=0:1260[t3];[t3][3:v]overlay=0:0,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[out]" -map "[out]" -map 4:a -t 12 -c:v libx264 -crf 18 -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 128k -movflags +faststart showdown-reel.mp4
```
Честный тест: одинаковый бриф дословно, только первая попытка, один рендерер, провал остаётся в ролике.

## 4. GIF-петля для обложки (loop-cover)
896×640, 180 кадров, 20 fps, двигается только один названный элемент; петлю «повернуть», чтобы кадр 1 был готовой картинкой (почта показывает первый кадр). Кодировать без дизеринга:
```bash
ffmpeg -y -framerate 20 -i f%03d.png -filter_complex "split[x][y];[x]palettegen=max_colors=128:stats_mode=full[p];[y][p]paletteuse=dither=none" -loop 0 cover.gif
```
Измерить шов (не на глаз): кадры в серый 216×154 → среднее |разницы| последний↔первый (цель 0,0–0,3), максимальное отклонение от кадра 0 (0,7–2,8; ≈0 = ничего не двигается), размер 0,6–2,3 МБ. В фильтре `eq` добавлять `eval=frame`. Проверить в 240 px ширины. Видео-модели добавляют движение камеры — для неподвижной камеры анимировать в коде.

## 5. Прозрачный оверлей
ProRes 4444 (`.mov`) — для монтажных программ; WebM VP9 alpha — для веба. Команды — remotion-guide.md §11. Это лучше хромакея: нет зелёной кромки.

## 6. Email/новостная рассылка
GIF 9 с до 5 МБ: 8 fps, ширина 540, лёгкий денойз (дождь/шум сжимаются лучше).

## 7. Звук-мастер
`ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1:LRA=11 -c:v copy out.mp4` → −14 LUFS / −1 dBTP (норма соцсетей).
