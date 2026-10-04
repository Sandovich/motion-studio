# Вырезает объект с фона (U²-Net, локально, бесплатно): python scripts/cutout.py in.jpg out.png [модель.onnx]
# Модель u2netp.onnx (≈4,6 МБ) из релизов rembg: github.com/danielgatis/rembg/releases (Apache-2.0).
import sys
import cv2
import numpy as np
import onnxruntime as ort

src, out = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else ".tools/u2netp.onnx"
img = cv2.imread(src, cv2.IMREAD_COLOR)
h, w = img.shape[:2]
x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (320, 320)).astype(np.float32) / 255.0
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
m = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
m = (m - m.min()) / (m.max() - m.min() + 1e-8)
m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
alpha = np.clip((m - 0.25) / 0.5, 0, 1)
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
rgba = np.dstack([img, (alpha * 255).astype(np.uint8)])
cv2.imwrite(out, rgba)
print(f"✓ {out} ({w}×{h})")
