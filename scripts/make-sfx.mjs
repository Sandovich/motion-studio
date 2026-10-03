// Генератор звукового набора для моушн-роликов: node scripts/make-sfx.mjs
// Все звуки синтезируются кодом (без сэмплов) → свои, без лицензий, детерминированы (seed).
// Результат: public/sfx/*.wav (48 кГц, 16 бит, моно).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 48000;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

// ── утилиты ─────────────────────────────────────────────────────────────
const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const buf = (sec) => new Float32Array(Math.round(sec * SR));
const TAU = Math.PI * 2;

// Биквад (RBJ) с пересчётом коэффициентов на каждом сэмпле — для «сдвигающихся» фильтров.
const biquad = (type) => {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x, f, q = 0.707) => {
    const w = (TAU * Math.min(f, SR * 0.45)) / SR, c = Math.cos(w), a = Math.sin(w) / (2 * q);
    let b0, b1, b2;
    if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = a; b1 = 0; b2 = -a; } // bp
    const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
};
const pink = (r) => { // розовый шум (Пол Келлет, упрощённый)
  let b0 = 0, b1 = 0, b2 = 0;
  return () => {
    const w = r() * 2 - 1;
    b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913;
    return (b0 + b1 + b2 + w * 0.1848) * 0.25;
  };
};
const normalize = (s, peak = 0.89) => { // пик −1 dBFS
  let m = 0; for (const v of s) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < s.length; i++) s[i] *= peak / m;
  // микрофейд в конце, чтобы не щёлкало
  const f = Math.min(240, s.length); for (let i = 0; i < f; i++) s[s.length - 1 - i] *= i / f;
  return s;
};
const wav = (name, s, peak) => {
  normalize(s, peak);
  const b = Buffer.alloc(44 + s.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + s.length * 2, 4); b.write("WAVE", 8);
  b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write("data", 36); b.writeUInt32LE(s.length * 2, 40);
  s.forEach((v, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  writeFileSync(join(OUT, `${name}.wav`), b);
  console.log(`✓ sfx/${name}.wav  ${(s.length / SR).toFixed(2)} с`);
};

// ── 1. Клавиши: 4 варианта (печать) + пробел + Enter ─────────────────────
// Щелчок = короткий шумовой транзиент через полосовой фильтр + «тело» клавиши (низкий тон) + тихий отпуск.
const key = (seed, { tone = 1, body = 1, len = 0.09 } = {}) => {
  const r = rng(seed), s = buf(len), bp = biquad("bp"), bp2 = biquad("bp"), hp = biquad("hp");
  const fc = (2600 + r() * 1800) * tone, fb = (140 + r() * 60) * tone, rel = 0.035 + r() * 0.012;
  for (let i = 0; i < s.length; i++) {
    const t = i / SR, n = r() * 2 - 1;
    const press = Math.exp(-t / 0.006) * bp(n, fc, 1.4);
    const thock = body * 0.55 * Math.exp(-t / 0.012) * Math.sin(TAU * fb * t);
    const tr = t - rel, release = tr > 0 ? 0.35 * Math.exp(-tr / 0.004) * bp2(n, fc * 1.3, 2) : 0;
    s[i] = hp(press + thock + release, 90);
  }
  return s;
};
[11, 23, 37, 41].forEach((seed, i) => wav(`key-${i + 1}`, key(seed)));
wav("key-space", key(53, { tone: 0.7, body: 1.6, len: 0.11 }));
wav("key-enter", key(67, { tone: 0.8, body: 2.2, len: 0.13 }));

// ── 2. Whoosh — появление титра / смена сцены ──────────────────────────
// Розовый шум, полосовой фильтр едет вверх-вниз, огибающая «пролёта» с пиком на 55 %.
const whoosh = (seed, len, f0, f1, f2) => {
  const r = rng(seed), p = pink(r), s = buf(len), bp = biquad("bp"), lp = biquad("lp");
  for (let i = 0; i < s.length; i++) {
    const x = i / s.length;
    const f = x < 0.55 ? f0 + (f1 - f0) * Math.pow(x / 0.55, 2) : f1 + (f2 - f1) * ((x - 0.55) / 0.45);
    const env = x < 0.55 ? Math.pow(x / 0.55, 2.2) : Math.pow(1 - (x - 0.55) / 0.45, 1.6);
    s[i] = env * lp(bp(p(), f, 0.9), f * 2.5);
  }
  return s;
};
wav("whoosh", whoosh(101, 0.55, 250, 2200, 600));
wav("whoosh-soft", whoosh(103, 0.4, 400, 1600, 700), 0.6);

// ── 3. Pop — появление карточки/бейджа ─────────────────────────────────
const pop = (seed, f0, f1) => {
  const r = rng(seed), s = buf(0.16), hp = biquad("hp");
  let ph = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SR, f = f1 + (f0 - f1) * Math.exp(-t / 0.018);
    ph += (TAU * f) / SR;
    const click = 0.25 * Math.exp(-t / 0.002) * (r() * 2 - 1);
    s[i] = hp(Math.exp(-t / 0.045) * Math.sin(ph) + click, 120);
  }
  return s;
};
wav("pop", pop(201, 1100, 380));
wav("pop-high", pop(203, 1600, 620), 0.7);

// ── 4. Hit — «приземление», акцент ─────────────────────────────────────
{
  const r = rng(301), s = buf(0.7), lp = biquad("lp");
  let ph = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SR, f = 48 + 70 * Math.exp(-t / 0.05);
    ph += (TAU * f) / SR;
    const sub = Math.exp(-t / 0.22) * Math.sin(ph);
    const crack = 0.6 * Math.exp(-t / 0.03) * lp(r() * 2 - 1, 2500);
    s[i] = Math.tanh(1.6 * (sub + crack));
  }
  wav("hit", s);
}

// ── 5. Ding — «готово», успех (колокольчик из негармоничных обертонов) ─
{
  const s = buf(1.6), parts = [[1, 1, 0.9], [2.76, 0.45, 0.45], [5.4, 0.2, 0.22], [8.93, 0.08, 0.12]];
  const f = 1046.5; // C6
  for (let i = 0; i < s.length; i++) {
    const t = i / SR, att = Math.min(1, t / 0.002);
    s[i] = att * parts.reduce((a, [m, g, d]) => a + g * Math.exp(-t / d) * Math.sin(TAU * f * m * t), 0);
  }
  wav("ding", s, 0.75);
}

// ── 6. Riser — нарастание перед финалом ────────────────────────────────
{
  const r = rng(401), p = pink(r), s = buf(1.3), hp = biquad("hp");
  let ph = 0;
  for (let i = 0; i < s.length; i++) {
    const x = i / s.length, t = i / SR;
    ph += (TAU * (180 * Math.pow(4, x))) / SR;
    const env = Math.pow(x, 2.4) * (x > 0.96 ? (1 - x) / 0.04 : 1);
    s[i] = env * (0.7 * hp(p(), 300 + 5000 * x * x, 0.8) + 0.25 * Math.sin(ph) * (0.6 + 0.4 * Math.sin(TAU * 7 * t * (1 + x))));
  }
  wav("riser", s, 0.8);
}

// ── 7. Музыкальная подложка — тёплый пэд Am–F–C–G, 8 с на цикл ─────────
// Длина по аргументу: node scripts/make-sfx.mjs 40  → bed.wav на 40 с (по умолчанию 40).
{
  const len = Number(process.argv[2]) || 40, s = buf(len), lp = biquad("lp"), r = rng(501);
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const chords = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]; // Am F C G
  const bass = [45, 41, 36, 43], bar = 2; // секунд на аккорд
  const phases = new Float64Array(16).map(() => r() * TAU);
  for (let i = 0; i < s.length; i++) {
    const t = i / SR, k = Math.floor(t / bar) % 4, tb = t % bar;
    const xf = Math.min(1, tb / 0.35); // мягкая смена аккорда
    const prev = (k + 3) % 4;
    let v = 0;
    for (const [ci, w] of [[k, xf], [prev, 1 - xf]]) {
      if (w <= 0) continue;
      chords[ci].forEach((m, j) => {
        for (const det of [-0.11, 0.11]) { // два слегка расстроенных голоса = «хорус»
          const f = hz(m) * Math.pow(2, det / 12);
          v += w * 0.11 * (Math.sin(TAU * f * t + phases[j]) + 0.3 * Math.sin(TAU * 2 * f * t + phases[j + 4]));
        }
      });
      v += w * 0.3 * Math.sin(TAU * hz(bass[ci]) * t);
    }
    const pulse = 0.82 + 0.18 * Math.pow(Math.cos((Math.PI * (t % 0.5)) / 0.5), 2); // лёгкая пульсация 120 BPM
    const cutoff = 900 + 500 * Math.sin((TAU * t) / 16);
    const fade = Math.min(1, t / 1.5, (len - t) / 2.5);
    s[i] = fade * pulse * lp(v, cutoff, 0.8);
  }
  wav("bed", s, 0.7);
}
