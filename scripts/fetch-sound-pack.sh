#!/usr/bin/env bash
# Настоящие записанные звуки и музыка для роликов (Mixkit, бесплатная лицензия для видео:
# https://mixkit.co/license/ — использовать в роликах можно, выкладывать сами файлы отдельно нельзя,
# поэтому public/sfx-pro и public/music в .gitignore, а в репо — только этот скрипт).
# bash scripts/fetch-sound-pack.sh  → public/sfx-pro/*.wav (обрезаны, пик −1 dBFS), public/music/*.mp3 (подогнаны под 120 BPM)
set -euo pipefail
PY=$(command -v python || command -v python3)
cd "$(dirname "$0")/.."
SFX=public/sfx-pro; MUS=public/music; TMP=$(mktemp -d)
mkdir -p "$SFX" "$MUS"
get() { curl -sfL -m 60 -A "Mozilla/5.0" "https://assets.mixkit.co/active_storage/sfx/$1/$1-preview.mp3" -o "$TMP/$1.mp3"; }
# имя | id Mixkit | что это
while read -r name id; do
  [ -z "$name" ] && continue
  get "$id"
  # срезать тишину в начале, пик −1 dBFS, 48 кГц стерео
  ffmpeg -y -hide_banner -loglevel error -i "$TMP/$id.mp3" -af "silenceremove=start_periods=1:start_threshold=-45dB,aresample=48000" -ac 2 "$TMP/$name.wav"
  peak=$(ffmpeg -hide_banner -nostats -i "$TMP/$name.wav" -af volumedetect -f null - 2>&1 | grep max_volume | grep -o '\-\?[0-9.]*' | head -1)
  ffmpeg -y -hide_banner -loglevel error -i "$TMP/$name.wav" -af "volume=$(awk "BEGIN{print -1-($peak)}")dB" "$SFX/$name.wav"
  echo "✓ $name ($id)"
done <<'EOF'
whoosh 1492
whoosh-soft 166
whoosh-slide 3120
pop 2364
pop-soft 2356
shutter 1430
hit 1143
click 1109
ui-click 2568
ding 2870
riser 790
rewind 1092
glitch 2595
typing 2531
EOF
# отдельные удары клавиш из записи печати (по пикам громкости)
"$PY" scripts/slice-keys.py "$SFX/typing.wav" "$SFX"
# музыка: скачать и подогнать темп к 120 BPM (склейки на кратные 15 кадрам при 30 fps)
music() {
  curl -sfL -m 120 -A "Mozilla/5.0" "https://assets.mixkit.co/music/$2/$2.mp3" -o "$TMP/$1.mp3"
  bpm=$("$PY" scripts/bpm.py "$TMP/$1.mp3")
  ffmpeg -y -hide_banner -loglevel error -i "$TMP/$1.mp3" -af "atempo=$(awk "BEGIN{print 120/$bpm}")" -b:a 256k "$MUS/$1.mp3"
  echo "✓ музыка $1 ($2): $bpm BPM → 120"
}
music catwalk 371         # Cat Walk — Arulo (House)
music tech-house 130      # Tech House vibes — Alejandro Magaña (Electronica)
music deep-urban 623      # Deep Urban — Eugenio Mininni (House)

# спикер для главы saint4ai в промо v4 (Mixkit 4834, бесплатная лицензия для видео): квадратный кроп 720×720, 7 с
mkdir -p public/promo3
curl -sfL -m 180 "https://assets.mixkit.co/videos/4834/4834-1080.mp4" -o "$TMP/speaker.mp4" && \
  ffmpeg -y -hide_banner -loglevel error -ss 1 -t 7 -i "$TMP/speaker.mp4" -an -vf "crop=1080:1080:420:0,scale=720:720,fps=30" -c:v libx264 -crf 22 -pix_fmt yuv420p public/promo3/speaker.mp4 && echo "✓ спикер public/promo3/speaker.mp4"
rm -rf "$TMP"
