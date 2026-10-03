#!/usr/bin/env bash
# Мастер звука для соцсетей: −14 LUFS, пик ≤ −1 dBTP. Видео копируется без перекодирования.
# bash scripts/master-audio.sh out/raw.mp4 out/final.mp4
set -euo pipefail
in="$1"; out="${2:-${1%.*}-master.mp4}"
ffmpeg -y -hide_banner -loglevel error -i "$in" -c:v copy \
  -af "loudnorm=I=-13.8:TP=-2:LRA=11,alimiter=limit=0.76:attack=1:release=50:level=false,aresample=48000" \
  -c:a aac -b:a 192k -movflags +faststart "$out"
ffmpeg -hide_banner -nostats -i "$out" -af ebur128=peak=true -f null - 2>&1 | grep -A15 Summary | grep -E "I:|Peak:"
echo "→ $out  (норма: I ≈ −14 LUFS ±1, Peak ≤ −1)"
