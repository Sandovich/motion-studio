# Темп трека (BPM) по автокорреляции огибающей ударов: python scripts/bpm.py track.mp3 → число
import subprocess, sys
import numpy as np

sr = 11025
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-t", "60", "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
hop = 128
frames = len(x) // hop
e = np.array([np.sum(x[i * hop:(i + 1) * hop] ** 2) for i in range(frames)])
onset = np.maximum(0, np.diff(np.log(e + 1e-9)))
onset -= onset.mean()
ac = np.correlate(onset, onset, mode="full")[len(onset) - 1:]
fps = sr / hop
bmin, bmax = (float(sys.argv[2]), float(sys.argv[3])) if len(sys.argv) > 3 else (100.0, 140.0)  # house/поп по умолчанию
lo, hi = int(fps * 60 / bmax), int(fps * 60 / bmin)
lag = lo + int(np.argmax(ac[lo:hi]))
# уточнение параболой
a, b, c = ac[lag - 1], ac[lag], ac[lag + 1]
lag_f = lag + 0.5 * (a - c) / (a - 2 * b + c)
print(round(60 * fps / lag_f, 2))
