// Реалистичный iPhone для моушн-роликов: титановая рамка, боковые кнопки, Dynamic Island, блик стекла,
// статус-бар iOS (сигнал, Wi-Fi, батарея), полоска «домой», 3D-наклон, касание как в записи экрана.
// <IPhone tiltY tiltX>{экран PW×PH}</IPhone>; внутри — <StatusBarIOS/>, свой интерфейс, <HomeBar/>, <Touch/>.
import React from "react";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { interpolate, useCurrentFrame } from "remotion";

const { fontFamily: ui } = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin", "cyrillic"] });
export const iosFont = ui;
export const PW = 600, PH = 1300; // экран, px (≈ 393×852 pt × 1,53)

// ── статус-бар iOS ─────────────────────────────────────────────────────
export const StatusBarIOS: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const c = dark ? "#fff" : "#000";
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 82, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 50px 0 62px", fontFamily: ui, fontWeight: 600, fontSize: 26, color: c, zIndex: 20 }}>
      <span style={{ letterSpacing: -0.3 }}>9:41</span>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="30" height="20" viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.7} y={9 - i * 2.8} width="3.2" height={3 + i * 2.8} rx="0.8" fill={c} />
          ))}
        </svg>
        <svg width="28" height="20" viewBox="0 0 17 12">
          <path d="M8.5 2.6c2.4 0 4.6.9 6.3 2.5l1.2-1.2C13.9 1.9 11.3.9 8.5.9S3.1 1.9 1 3.9l1.2 1.2C3.9 3.5 6.1 2.6 8.5 2.6zm0 3.4c1.5 0 2.8.5 3.9 1.5l1.2-1.2C12.2 4.9 10.4 4.3 8.5 4.3S4.8 4.9 3.4 6.3l1.2 1.2C5.7 6.5 7 6 8.5 6zm0 3.4c.6 0 1.1.2 1.5.6L8.5 11.5 7 10c.4-.4.9-.6 1.5-.6z" fill={c} />
        </svg>
        <svg width="44" height="21" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke={c} strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.2" fill={c} />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill={c} fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
};

export const HomeBar: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", bottom: 12, left: (PW - 210) / 2, width: 210, height: 8, borderRadius: 4, backgroundColor: dark ? "#fff" : "#000", opacity: 0.9, zIndex: 20 }} />
);

export const IgIconReal: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.225, background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
    <div style={{ width: size * 0.62, height: size * 0.62, borderRadius: size * 0.19, border: `${size * 0.062}px solid #fff`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: size * 0.25, height: size * 0.25, borderRadius: "50%", border: `${size * 0.062}px solid #fff` }} />
      <div style={{ position: "absolute", top: size * 0.05, right: size * 0.06, width: size * 0.075, height: size * 0.075, borderRadius: "50%", backgroundColor: "#fff" }} />
    </div>
  </div>
);
export const TgIconReal: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="tgg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#37BBFE" />
        <stop offset="1" stopColor="#007DBB" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22.5" fill="url(#tgg)" />
    <path d="M22.6 49.2c11.7-5.1 19.5-8.5 23.4-10.1 11.1-4.6 13.4-5.4 14.9-5.4.3 0 1.1.1 1.6.5.4.3.5.8.6 1.1 0 .3.1 1 0 1.6-.6 6.3-3.2 21.6-4.5 28.6-.6 3-1.7 4-2.7 4.1-2.3.2-4.1-1.5-6.3-3-3.5-2.3-5.5-3.7-8.9-5.9-3.9-2.6-1.4-4 .9-6.3.6-.6 10.7-9.8 10.9-10.6 0-.1.1-.5-.2-.7-.2-.2-.6-.1-.9-.1-.4.1-6.4 4.1-18.1 12-1.7 1.2-3.3 1.8-4.7 1.7-1.5 0-4.5-.9-6.7-1.6-2.7-.9-4.8-1.3-4.7-2.8.1-.8 1.2-1.6 3.3-2.4z" fill="#fff" transform="translate(-6 2) scale(1.12)" />
  </svg>
);
// ── корпус ─────────────────────────────────────────────────────────────
export const IPhone: React.FC<{ children: React.ReactNode; tiltY?: number; tiltX?: number }> = ({ children, tiltY = 0, tiltX = 0 }) => {
  const bz = 16, frame = 10;
  const W = PW + 2 * (bz + frame), H = PH + 2 * (bz + frame);
  const ti = "linear-gradient(135deg, #6E6E73 0%, #C7C7CC 22%, #5A5A5F 48%, #B4B4B9 75%, #4A4A4E 100%)";
  const btn = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 7, borderRadius: 3, background: ti, ...s }} />;
  return (
    <div style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d", rotate: `x ${tiltX}deg`, transform: `rotateY(${tiltY}deg)` }}>
      {btn({ left: -6, top: 230, height: 54 })}
      {btn({ left: -6, top: 320, height: 96 })}
      {btn({ left: -6, top: 432, height: 96 })}
      {btn({ right: -6, top: 360, height: 150 })}
      <div style={{ position: "absolute", inset: 0, borderRadius: 112, background: ti, padding: frame, boxShadow: "0 60px 120px rgba(18,16,16,0.38), 0 20px 40px rgba(18,16,16,0.25)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 102, backgroundColor: "#050505", padding: bz }}>
          <div style={{ position: "relative", width: PW, height: PH, borderRadius: 86, overflow: "hidden", backgroundColor: "#000" }}>
            {children}
            <div style={{ position: "absolute", top: 18, left: (PW - 190) / 2, width: 190, height: 56, borderRadius: 28, backgroundColor: "#000", zIndex: 40 }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 41, pointerEvents: "none", background: `linear-gradient(${112 + tiltY * 2}deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 22%, rgba(255,255,255,0) 40%)` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Касание как в записи экрана iOS
export const Touch: React.FC<{ keys: [number, number, number][]; taps: number[]; from: number; to: number }> = ({ keys, taps, from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const x = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[2]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tap = taps.find((t) => f >= t - 3 && f < t + 12);
  const press = tap !== undefined ? interpolate(f, [tap - 3, tap, tap + 5], [1, 0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const ring = tap !== undefined ? interpolate(f, [tap, tap + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const op = interpolate(f, [from, from + 4, to - 4, to], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x - 40, top: y - 40, width: 80, height: 80, opacity: op, zIndex: 50 }}>
      {tap !== undefined && <div style={{ position: "absolute", inset: 0, borderRadius: 40, border: "4px solid rgba(255,255,255,0.9)", scale: String(1 + ring * 1.3), opacity: 1 - ring }} />}
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, backgroundColor: "rgba(200,200,205,0.72)", boxShadow: "0 2px 12px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(255,255,255,0.7)", scale: String(press) }} />
    </div>
  );
};
