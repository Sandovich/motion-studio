# Вырезает отдельные удары клавиш из записи печати: python scripts/slice-keys.py typing.wav out_dir → key-1..8.wav
import sys, wave
import numpy as np

src, out = sys.argv[1], sys.argv[2]
w = wave.open(src)
sr, ch = w.getframerate(), w.getnchannels()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch).astype(np.float32).mean(1) / 32768
win = int(sr * 0.004)
env = np.convolve(np.abs(x), np.ones(win) / win, mode="same")
thr, gap, hits, i = env.max() * 0.35, int(sr * 0.09), [], int(sr * 0.5)
while i < len(env) and len(hits) < 12:
    if env[i] > thr:
        hits.append(i)
        i += gap
    else:
        i += 1
for k, h in enumerate(hits[2:10]):
    seg = x[max(0, h - int(sr * 0.005)): h + int(sr * 0.11)].copy()
    seg *= np.minimum(1, np.linspace(1.6, 0, len(seg)))  # мягкий хвост без щелчка
    seg = seg / (np.abs(seg).max() + 1e-9) * 0.89
    o = wave.open(f"{out}/key-{k + 1}.wav", "wb")
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
    o.writeframes((seg * 32767).astype(np.int16).tobytes())
    o.close()
print(f"✓ key-1..{min(8, len(hits) - 2)} вырезаны из записи печати")
