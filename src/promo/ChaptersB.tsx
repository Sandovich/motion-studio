// Главы 9–15 промо скилла: Лямин ч.2 и ч.1, Mr. Pynk, brag, saint4ai, Grafigator (глубина/ритм), наше (iPhone + проверка зон).
import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CountUp, Halftone, HomeBar, IPhone, PW, Sfx, StatusBarIOS, Touch, clamp, iosFont } from "../components";
import { Arrow, C, CX, Words, mono, prog, ui, usePath, useSpring, wide } from "./kit";

// ── 9. ЛЯМИН ч.2: светло-серый фон + лайм, счётчик в чёрной пилюле + линия, прожектор, степпер, изометрия ──
export const Lyamin2: React.FC = () => {
  const f = useCurrentFrame();
  const line = prog(f, 8, 50);
  const steps = ["смотришь", "кидаешь Claude", "он повторяет"];
  return (
    <AbsoluteFill style={{ backgroundColor: C.grey }}>
      <div style={{ position: "absolute", left: 120, width: 720, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: wide, fontWeight: 800, fontSize: 40, color: C.ink }}>разборов рилсов</div>
        <div style={{ padding: "14px 44px", borderRadius: 60, backgroundColor: C.ink }}>
          <CountUp from={0} to={12} start={6} duration={40} style={{ fontFamily: wide, fontWeight: 900, fontSize: 96, color: C.white }} />
        </div>
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d="M 150 720 C 300 700, 420 650, 520 600 S 720 470, 820 430" fill="none" stroke={C.lime} strokeWidth="10" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - line)} />
      </svg>
      {/* прожектор на иконку */}
      <div style={{ position: "absolute", left: CX - 240, top: 760, width: 480, height: 300, background: "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0))", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", opacity: prog(f, 30, 44) }} />
      <div style={{ position: "absolute", left: CX - 60, top: 1000, width: 120, height: 120, borderRadius: 30, backgroundColor: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, color: C.white, scale: String(useSpring(36, 10, 160)) }}>✳</div>
      <div style={{ position: "absolute", left: CX - 160, top: 1150, width: 320, height: 16, borderRadius: 8, backgroundColor: "rgba(13,13,22,0.12)" }}>
        <div style={{ width: `${prog(f, 44, 74) * 100}%`, height: 16, borderRadius: 8, backgroundColor: C.lime }} />
      </div>
      {/* степпер */}
      <div style={{ position: "absolute", left: 160, top: 1200, display: "flex", flexDirection: "column", gap: 14, opacity: prog(f, 76, 86) }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: wide, fontWeight: 700, fontSize: 30, color: C.ink, opacity: prog(f, 78 + i * 8, 86 + i * 8) }}>
            <span style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: f > 80 + i * 8 ? C.lime : "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
      {/* изометрические плитки */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 600 + i * 70, top: 1220 - i * 40, width: 110, height: 110, backgroundColor: C.lime, transform: "rotateX(55deg) rotateZ(45deg)", boxShadow: "0 18px 0 #8FB82E", opacity: prog(f, 84 + i * 6, 94 + i * 6) }} />
      ))}
      {[6, 12, 18, 24, 30, 36].map((a) => (
        <Sfx key={a} s="key-2" at={a} volume={0.2} rate={1.25} />
      ))}
      <Sfx s="pop" at={36} volume={0.6} />
      <Sfx s="ding" at={74} volume={0.45} />
      {[78, 86, 94].map((a) => (
        <Sfx key={a} s="ui-click" at={a} volume={0.5} />
      ))}
    </AbsoluteFill>
  );
};

// ── 10. ЛЯМИН ч.1: караоке-субтитры капсом, плашка терминала «скопировано», «Подписаться» + курсор ──
const KARAOKE = ["СУБТИТРЫ", "ПО", "СЛОВАМ", "С", "ПОДСВЕТКОЙ"];
export const Lyamin1: React.FC = () => {
  const f = useCurrentFrame();
  const cur = Math.min(KARAOKE.length - 1, Math.floor(f / 8));
  const copied = f >= 50;
  const { x, y, press } = usePath([[60, 760, 1400], [84, 480, 1185], [104, 480, 1185]], [88]);
  const sub = f >= 90;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.35, filter: "blur(14px)", scale: "1.1" }}>
        <Video src={staticFile("promo/tut_a.mp4")} muted objectFit="cover" style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, width: 720, top: 330, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 18 }}>
        {KARAOKE.map((w, i) => (
          <span key={w} style={{ fontFamily: wide, fontWeight: 900, fontSize: 64, lineHeight: 1.15, color: i === cur ? C.yellow : C.white, opacity: i <= cur ? 1 : 0.35, textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>
            {w}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, width: 720, top: 760, display: "flex", alignItems: "center", gap: 18, opacity: prog(f, 36, 44) }}>
        <div style={{ flex: 1, padding: "22px 26px", borderRadius: 20, backgroundColor: "#111118", fontFamily: mono, fontWeight: 500, fontSize: 30, color: C.cream }}>
          <span style={{ color: C.lime }}>$ </span>npx create-video@latest
        </div>
        <div style={{ padding: "14px 20px", borderRadius: 30, backgroundColor: C.lime, fontFamily: wide, fontWeight: 800, fontSize: 22, color: C.ink, opacity: copied ? 1 : 0, scale: copied ? "1" : "0.6" }}>скопировано</div>
      </div>
      <div style={{ position: "absolute", left: CX - 230, top: 1130, width: 460, height: 110, borderRadius: 55, backgroundColor: sub ? "#2A2A33" : C.lime, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: wide, fontWeight: 800, fontSize: 38, color: sub ? C.cream : C.ink, scale: String(1 - press * 0.06), opacity: prog(f, 56, 64) }}>
        {sub ? "✓ Вы подписаны" : "Подписаться"}
      </div>
      {f >= 60 && <Arrow x={x} y={y} press={press} />}
      {KARAOKE.map((_, i) => (
        <Sfx key={i} s="pop-high" at={i * 8} volume={0.3} rate={1 + i * 0.05} />
      ))}
      <Sfx s="click" at={50} volume={0.6} />
      <Sfx s="click" at={88} volume={0.75} />
      <Sfx s="ding" at={91} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 11. MR. PYNK: стили анимированного текста — надутые буквы, журнальные вырезки, неон ──
export const Pynk: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.min(2, Math.floor(f / 40));
  const local = f - k * 40;
  const s = useSpring(k * 40, 9, 170);
  const bubble = (txt: string) => (
    <div style={{ fontFamily: wide, fontWeight: 900, fontSize: 170, letterSpacing: -6, color: "#FF7BC1", textShadow: "0 2px 0 #FF5CAF, 0 4px 0 #F7449F, 0 6px 0 #E8338F, 0 8px 0 #D52480, 0 14px 30px rgba(0,0,0,0.35), inset 0 0 0 #fff", WebkitTextStroke: "3px #fff" }}>{txt}</div>
  );
  const ransom = "СТИЛЬ".split("").map((ch, i) => (
    <span key={i} style={{ display: "inline-block", fontFamily: i % 2 ? wide : ui, fontWeight: i % 2 ? 900 : 800, fontSize: 108, padding: "4px 14px", margin: "0 6px", backgroundColor: [C.white, C.yellow, C.ink, C.pink, C.lime][i], color: i === 2 ? C.white : C.ink, rotate: `${[-6, 4, -3, 7, -5][i]}deg`, translate: `0 ${(1 - Math.min(1, Math.max(0, (local - i * 3) / 6))) * -400}px` }}>
      {ch}
    </span>
  ));
  const neon = Math.sin(f * 1.7) > -0.6 ? 1 : 0.35;
  return (
    <AbsoluteFill style={{ backgroundColor: k === 2 ? "#0B0618" : "transparent" }}>
      <div style={{ position: "absolute", left: 120, width: 720, top: 760, display: "flex", justifyContent: "center", scale: String(s) }}>
        {k === 0 && bubble("ВАУ!")}
        {k === 1 && <div style={{ display: "flex" }}>{ransom}</div>}
        {k === 2 && (
          <div style={{ fontFamily: wide, fontWeight: 900, fontSize: 124, letterSpacing: 4, color: "#FFE9FF", opacity: neon, textShadow: `0 0 10px #FF4FD8, 0 0 30px #FF4FD8, 0 0 60px #B12CFF` }}>НЕОН</div>
        )}
      </div>
      <Sfx s="pop" at={2} volume={0.6} rate={0.8} />
      {[40, 43, 46, 49, 52].map((a) => (
        <Sfx key={a} s="shutter" at={a} volume={0.4} rate={1.2} />
      ))}
      <Sfx s="glitch" at={82} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 12. BRAG (рилс 1): чёрный фон, заголовок слева + iPhone с процентами, галочки ФАКТ/ХАЙП ──
export const Brag: React.FC = () => {
  const f = useCurrentFrame();
  const pct = Math.round(interpolate(f, [10, 70], [2, 99], { ...clamp, easing: (t) => t * t * (3 - 2 * t) }));
  const fact = f >= 84;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", left: 134, top: 330, width: 700, fontFamily: wide, fontWeight: 900, fontSize: 64, lineHeight: 1.08, color: C.white, letterSpacing: -2 }}>
        <div style={{ opacity: prog(f, 0, 8) }}>Собрал проект.</div>
        <div style={{ opacity: prog(f, 8, 16), color: C.red }}>Снова.</div>
      </div>
      <div data-fit="decor" style={{ position: "absolute", left: 540 - (PW + 52) / 2, top: 540, scale: "0.62", transformOrigin: "50% 0%" }}>
        <IPhone tiltY={-14 + Math.sin(f / 30) * 3} tiltX={4}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #111, #000)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, fontFamily: iosFont }}>
            <StatusBarIOS dark />
            <div style={{ fontWeight: 800, fontSize: 140, color: C.white }}>{pct}%</div>
            <div style={{ width: 420, height: 18, borderRadius: 9, backgroundColor: "#333" }}>
              <div style={{ width: `${pct}%`, height: 18, borderRadius: 9, backgroundColor: C.mint }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 34, color: "#aaa" }}>рендер ролика</div>
            <HomeBar dark />
          </div>
        </IPhone>
      </div>
      <div style={{ position: "absolute", left: 120, width: 720, top: 1240, display: "flex", justifyContent: "center", gap: 30, opacity: prog(f, 74, 82) }}>
        {[["ФАКТ", fact], ["ХАЙП", false]].map(([l, on]) => (
          <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: wide, fontWeight: 800, fontSize: 40, color: C.white }}>
            <span style={{ width: 52, height: 52, borderRadius: 12, border: `4px solid ${C.white}`, backgroundColor: on ? C.lime : "transparent", color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{on ? "✓" : ""}</span>
            {l as string}
          </div>
        ))}
      </div>
      {[10, 20, 30, 40, 50, 60].map((a) => (
        <Sfx key={a} s="ui-click" at={a} volume={0.4} rate={0.9 + a / 100} />
      ))}
      <Sfx s="ding" at={70} volume={0.5} />
      <Sfx s="click" at={84} volume={0.7} />
    </AbsoluteFill>
  );
};

// ── 13. SAINT4AI: спикер снизу, сверху сцена с прожекторами, «Монтирует всё», таймлайн с волной, раскадровка, ×25 ──
export const Saint: React.FC = () => {
  const f = useCurrentFrame();
  const tl = prog(f, 30, 66);
  const x25 = useSpring(80, 11, 150);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #08090C 0%, #121318 60%, #0E4B43 100%)" }}>
      {[0.2, 0.5, 0.8].map((p, i) => (
        <div key={i} style={{ position: "absolute", left: 1080 * p - 140, top: 0, width: 280, height: 800, background: "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))", clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)", rotate: `${(i - 1) * 14}deg`, transformOrigin: "50% 0" }} />
      ))}
      <Words text="МОНТИРУЕТ ВСЁ" at={2} size={66} top={330} highlight={["ВСЁ", C.mint]} weight={900} />
      {/* таймлайн */}
      <div style={{ position: "absolute", left: 120, width: 720, top: 520, height: 220, opacity: prog(f, 20, 30) }}>
        <svg width="720" height="120" style={{ position: "absolute", top: 70 }}>
          {[...Array(60)].map((_, i) => {
            const h = 10 + 90 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31));
            return <rect key={i} x={i * 12} y={60 - h / 2} width={7} height={h} rx={3} fill={i * 12 < tl * 720 ? C.mint : "rgba(241,236,227,0.3)"} />;
          })}
        </svg>
        <div style={{ position: "absolute", left: tl * 720, top: 30, width: 4, height: 190, backgroundColor: C.mint }} />
        <div style={{ position: "absolute", left: 8, top: 0, fontFamily: mono, fontSize: 22, color: "rgba(241,236,227,0.6)" }}>01 · запись и расшифровка</div>
      </div>
      {/* раскадровка K1–K6 */}
      <div style={{ position: "absolute", left: 120, width: 720, top: 780, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, opacity: prog(f, 50, 60) }}>
        {["хук", "проблема", "шаг 1", "шаг 2", "проверка", "призыв"].map((l, i) => (
          <div key={l} style={{ height: 110, borderRadius: 18, backgroundColor: f > 56 + i * 4 ? "rgba(61,237,195,0.9)" : "rgba(255,255,255,0.1)", padding: 12, fontFamily: ui, fontWeight: 700, fontSize: 22, color: f > 56 + i * 4 ? C.ink : C.cream }}>
            <div style={{ fontFamily: mono, fontSize: 18, opacity: 0.7 }}>K{i + 1}</div>
            {l}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, width: 720, top: 1050, textAlign: "center", fontFamily: wide, fontWeight: 900, fontSize: 150, color: C.cream, opacity: x25, scale: String(interpolate(x25, [0, 1], [1.3, 1])) }}>×25</div>
      {/* спикер — карточка снизу */}
      <div data-fit="decor" style={{ position: "absolute", left: CX - 210, top: 1300, width: 420, height: 380, borderRadius: 40, background: `linear-gradient(160deg, ${C.mint}, #0B6B5C)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(13,13,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>🎙</div>
      </div>
      <Sfx s="whoosh-soft" at={2} volume={0.5} />
      <Sfx s="whoosh-slide" at={24} volume={0.4} />
      {[56, 60, 64, 68, 72, 76].map((a) => (
        <Sfx key={a} s="pop-high" at={a} volume={0.35} rate={1 + (a - 56) / 40} />
      ))}
      <Sfx s="hit" at={80} volume={0.7} />
    </AbsoluteFill>
  );
};

// ── 14. GRAFIGATOR: переливающиеся капли поверх «ГЛУБИНА» → растр «РИТМ» ──
export const Depth: React.FC = () => {
  const f = useCurrentFrame();
  const rhythm = prog(f, 66, 78);
  const blobs = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#141428", opacity: 1 - rhythm }}>
        <div style={{ position: "absolute", left: 120, width: 720, top: 860, textAlign: "center", fontFamily: wide, fontWeight: 900, fontSize: 116, color: C.white, letterSpacing: -4 }}>ГЛУБИНА</div>
        {blobs.map((i) => {
          const x = CX + Math.sin(f * 0.05 + i * 1.3) * 260, y = 900 + Math.cos(f * 0.045 + i * 2.1) * 320;
          const r = 90 + (i % 3) * 40;
          return (
            <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 30% 28%, #ffffff 0%, #C9F 14%, #7AF 30%, #FF7AC6 52%, #3B2BFF 72%, #120F3A 100%)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset -20px -30px 50px rgba(0,0,0,0.35)", mixBlendMode: "normal", opacity: 0.95 }} />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: rhythm }}>
        <Halftone bg={C.cobalt} dot={C.cream} />
        <Words text="РИТМ" at={70} size={160} top={840} color={C.ink} weight={900} />
      </AbsoluteFill>
      <Sfx s="whoosh-soft" at={2} volume={0.5} />
      <Sfx s="whoosh" at={66} volume={0.5} />
      <Sfx s="hit" at={72} volume={0.6} />
    </AbsoluteFill>
  );
};

// ── 15. НАШЕ: рилс в iPhone + лайк, затем проверка безопасных зон → FIT PASS ──
export const Ours: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 16, 80);
  const liked = f >= 40;
  const check = prog(f, 62, 74);
  const fix = prog(f, 90, 104);
  const k = 0.42, W = 1080 * k, H = 1920 * k, X = 120, Y = 450;
  const heart = "M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z";
  return (
    <AbsoluteFill>
      <div data-fit="decor" style={{ position: "absolute", inset: 0, perspective: 2200, opacity: 1 - check }}>
        <div style={{ position: "absolute", left: 540 - (PW + 52) / 2, top: 400, translate: `0 ${interpolate(enter, [0, 1], [1300, 0])}px`, scale: "0.85", transformOrigin: "50% 0%" }}>
          <IPhone tiltY={interpolate(enter, [0, 1], [26, 4]) + Math.sin(f / 22) * 4} tiltX={6}>
            <Video src={staticFile("promo/phone_reel.mp4")} muted objectFit="cover" style={{ position: "absolute", inset: 0, width: 600, height: 1300 }} />
            <svg width="58" height="58" viewBox="0 0 24 24" style={{ position: "absolute", right: 24, top: 820 }}>
              <path d={heart} fill={liked ? "#FF3040" : "none"} stroke={liked ? "#FF3040" : "#fff"} strokeWidth="1.9" />
            </svg>
            <StatusBarIOS dark />
            <HomeBar dark />
            <Touch from={22} to={54} keys={[[22, 300, 900], [38, 553, 849], [54, 553, 849]]} taps={[39]} />
          </IPhone>
        </div>
      </div>
      <div style={{ opacity: check }}>
        <Words text="ТЕКСТ НЕ ЗАЛЕЗЕТ ПОД КНОПКИ" at={64} size={50} top={300} color={C.cream} weight={900} />
        <div data-fit="decor" style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 36, overflow: "hidden", backgroundColor: "#16161F", boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ position: "absolute", left: 840 * k, top: 360 * k, width: 240 * k, height: 1100 * k, backgroundColor: "rgba(255,59,48,0.3)" }} />
          <div style={{ position: "absolute", left: 0, top: 1360 * k, width: 1080 * k, height: 560 * k, backgroundColor: "rgba(255,59,48,0.3)" }} />
          <div style={{ position: "absolute", left: 120 * k, top: 260 * k, width: 720 * k, height: 1100 * k, border: `3px dashed ${fix > 0.99 ? C.lime : "rgba(241,236,227,0.4)"}` }} />
          <div style={{ position: "absolute", left: interpolate(fix, [0, 1], [520, 160]) * k, top: interpolate(fix, [0, 1], [1450, 700]) * k, width: 560 * k, padding: 10, borderRadius: 10, backgroundColor: C.orange, fontFamily: wide, fontWeight: 900, fontSize: 28, color: C.ink, outline: `4px solid ${fix > 0.99 ? C.lime : "#FF3B30"}` }}>Заголовок</div>
        </div>
        <div style={{ position: "absolute", left: X + W + 24, top: Y + 40, width: 230, fontFamily: mono, fontWeight: 700, fontSize: 26, lineHeight: 1.5 }}>
          <div style={{ color: "#FF6B5E", opacity: 1 - fix }}>✗ под кнопками</div>
          <div style={{ color: C.lime, opacity: fix }}>✓ FIT PASS</div>
        </div>
      </div>
      <Sfx s="whoosh" at={0} volume={0.5} />
      <Sfx s="click" at={39} volume={0.7} />
      <Sfx s="pop" at={40} volume={0.6} />
      <Sfx s="whoosh-slide" at={62} volume={0.5} />
      <Sfx s="whoosh-soft" at={92} volume={0.5} />
      <Sfx s="ding" at={104} volume={0.55} />
    </AbsoluteFill>
  );
};

