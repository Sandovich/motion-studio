# Где начинать трек (120 BPM): первый такт, где громкость вышла на «полную» часть, с фазой на сильную долю.
# python scripts/music-start.py track.mp3 [длина ролика, с] → секунда старта
import subprocess, sys
import numpy as np

sr = 11025
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
need = float(sys.argv[2]) if len(sys.argv) > 2 else 20
hop = 64
e = np.array([np.sum(x[i * hop:(i + 1) * hop] ** 2) for i in range(len(x) // hop)])
fps = sr / hop
on = np.maximum(0, np.diff(np.log(e + 1e-9)))
period = fps * 0.5  # удар при 120 BPM
best = max(range(int(period)), key=lambda p: on[np.arange(p, len(on), period).astype(int)].sum())
phase = best / fps
# громкость по тактам (2 с)
bars = [(phase + k * 2, np.sqrt(np.mean(x[int((phase + k * 2) * sr):int((phase + k * 2 + 2) * sr)] ** 2))) for k in range(int((len(x) / sr - phase) // 2))]
loud = np.percentile([b[1] for b in bars], 70)
dur = len(x) / sr
start = next((t for t, r in bars if r >= loud * 0.9 and t + need < dur), phase)
print(round(start, 3))
