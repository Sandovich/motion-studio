// Главы 9–15 промо скилла: Лямин ч.2 и ч.1, Mr. Pynk, brag, saint4ai, Grafigator (глубина/ритм), наше (iPhone + проверка зон).
// Вёрстка — та же сетка: всё по центру кадра, текст в колонке 600 px, заголовки через fitText.
import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CountUp, Halftone, HomeBar, IPhone, PW, Sfx, StatusBarIOS, Touch, clamp, iosFont } from "../components";
import { Arrow, C, CX, Center, L, Title, W, Words, mono, prog, ui, usePath, useSpring, wide } from "./kit";

// ── 9. ЛЯМИН ч.2: светло-серый фон + лайм, счётчик в чёрной пилюле + растущая линия, прожектор, степпер, изометрия ──
export const Lyamin2: React.FC = () => {
  const f = useCurrentFrame();
  const line = prog(f, 8, 50);
  const icon = useSpring(36, 10, 160);
  const steps = ["смотришь", "кидаешь Claude", "он повторяет"];
  return (
    <AbsoluteFill style={{ backgroundColor: C.grey }}>
      <Title text="разборов рилсов" top={300} max={40} color={C.ink} weight={800} />
      <Center top={370} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "12px 46px", borderRadius: 60, backgroundColor: C.ink }}>
          <CountUp from={0} to={14} start={6} duration={40} style={{ fontFamily: wide, fontWeight: 900, fontSize: 96, color: C.white }} />
        </div>
      </Center>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${L} 700 C ${L + 150} 690, ${L + 260} 640, ${CX} 600 S ${L + 520} 500, ${L + W} 470`} fill="none" stroke={C.lime} strokeWidth="10" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - line)} />
      </svg>
      <div style={{ position: "absolute", left: CX - 240, top: 740, width: 480, height: 300, background: "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0))", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", opacity: prog(f, 30, 44) }} />
      <div style={{ position: "absolute", left: CX - 60, top: 960, width: 120, height: 120, borderRadius: 30, backgroundColor: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, color: C.white, scale: String(icon) }}>✳</div>
      <Center top={1110} w={320} h={16} style={{ borderRadius: 8, backgroundColor: "rgba(13,13,22,0.12)" }}>
        <div style={{ width: `${prog(f, 44, 74) * 100}%`, height: 16, borderRadius: 8, backgroundColor: C.lime }} />
      </Center>
      <Center top={1170} w={420} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: wide, fontWeight: 700, fontSize: 30, color: C.ink, opacity: prog(f, 78 + i * 8, 86 + i * 8) }}>
            <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 21, backgroundColor: f > 80 + i * 8 ? C.lime : "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{i + 1}</span>
            {s}
          </div>
        ))}
      </Center>
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
  const { x, y, press } = usePath([[60, 820, 1400], [84, CX + 40, 1185], [104, CX + 40, 1185]], [88]);
  const sub = f >= 90;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.3, filter: "blur(16px)", scale: "1.1" }}>
        <Video src={staticFile("promo/tut_a.mp4")} muted objectFit="cover" style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <Center top={330} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 18 }}>
        {KARAOKE.map((w, i) => (
          <span key={w} style={{ fontFamily: wide, fontWeight: 900, fontSize: 60, lineHeight: 1.15, color: i === cur ? C.yellow : C.white, opacity: i <= cur ? 1 : 0.35, textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>
            {w}
          </span>
        ))}
      </Center>
      <Center top={760} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: prog(f, 36, 44) }}>
        <div style={{ padding: "20px 26px", borderRadius: 20, backgroundColor: "#111118", fontFamily: mono, fontWeight: 500, fontSize: 30, color: C.cream }}>
          <span style={{ color: C.lime }}>$ </span>npx create-video@latest
        </div>
        <div style={{ padding: "12px 20px", borderRadius: 30, backgroundColor: C.lime, fontFamily: wide, fontWeight: 800, fontSize: 22, color: C.ink, opacity: copied ? 1 : 0, scale: copied ? "1" : "0.6" }}>✓ скопировано</div>
      </Center>
      <Center top={1130} w={460} h={110} style={{ borderRadius: 55, backgroundColor: sub ? "#2A2A33" : C.lime, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: wide, fontWeight: 800, fontSize: 38, color: sub ? C.cream : C.ink, scale: String(1 - press * 0.06), opacity: prog(f, 56, 64) }}>
        {sub ? "✓ Вы подписаны" : "Подписаться"}
      </Center>
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

// ── 11. MR. PYNK: надутые буквы, журнальные вырезки, неон ─────────────────
export const Pynk: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.min(2, Math.floor(f / 40));
  const local = f - k * 40;
  const s = useSpring(k * 40, 9, 170);
  const neon = Math.sin(f * 1.7) > -0.6 ? 1 : 0.35;
  return (
    <AbsoluteFill style={{ backgroundColor: k === 2 ? "#0B0618" : "transparent", alignItems: "center", justifyContent: "center" }}>
      <div style={{ scale: String(s), display: "flex", justifyContent: "center" }}>
        {k === 0 && (
          <div style={{ fontFamily: wide, fontWeight: 900, fontSize: 170, letterSpacing: -6, color: "#FF7BC1", textShadow: "0 2px 0 #FF5CAF, 0 4px 0 #F7449F, 0 6px 0 #E8338F, 0 8px 0 #D52480, 0 14px 30px rgba(0,0,0,0.35)", WebkitTextStroke: "3px #fff" }}>ВАУ!</div>
        )}
        {k === 1 && (
          <div style={{ display: "flex" }}>
            {"СТИЛЬ".split("").map((ch, i) => (
              <span key={i} style={{ display: "inline-block", fontFamily: i % 2 ? wide : ui, fontWeight: i % 2 ? 900 : 800, fontSize: 78, padding: "4px 12px", margin: "0 4px", backgroundColor: [C.white, C.yellow, C.ink, C.pink, C.lime][i], color: i === 2 ? C.white : C.ink, rotate: `${[-6, 4, -3, 7, -5][i]}deg`, translate: `0 ${(1 - Math.min(1, Math.max(0, (local - i * 3) / 6))) * -400}px` }}>
                {ch}
              </span>
            ))}
          </div>
        )}
        {k === 2 && <div style={{ fontFamily: wide, fontWeight: 900, fontSize: 124, letterSpacing: 4, color: "#FFE9FF", opacity: neon, textShadow: "0 0 10px #FF4FD8, 0 0 30px #FF4FD8, 0 0 60px #B12CFF" }}>НЕОН</div>}
      </div>
      <Sfx s="pop" at={2} volume={0.6} rate={0.8} />
      {[40, 43, 46, 49, 52].map((a) => (
        <Sfx key={a} s="shutter" at={a} volume={0.4} rate={1.2} />
      ))}
      <Sfx s="glitch" at={82} volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 12. BRAG (рилс 1): заголовок сверху по центру, iPhone с процентами, галочки ФАКТ/ХАЙП ──
export const Brag: React.FC = () => {
  const f = useCurrentFrame();
  const pct = Math.round(interpolate(f, [10, 70], [2, 99], { ...clamp, easing: (t) => t * t * (3 - 2 * t) }));
  const fact = f >= 84;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Title text="Собрал проект." top={300} max={70} color={C.white} />
      <Title text="Снова." top={390} max={70} color={C.red} at={8} />
      <div data-fit="decor" style={{ position: "absolute", left: CX - (PW + 52) / 2, top: 520, scale: "0.6", transformOrigin: "50% 0%" }}>
        <IPhone tiltY={-10 + Math.sin(f / 30) * 3} tiltX={4}>
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
      <Center top={1250} style={{ display: "flex", justifyContent: "center", gap: 40, opacity: prog(f, 74, 82) }}>
        {([["ФАКТ", fact], ["ХАЙП", false]] as [string, boolean][]).map(([l, on]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: wide, fontWeight: 800, fontSize: 40, color: C.white }}>
            <span style={{ width: 52, height: 52, borderRadius: 12, border: `4px solid ${C.white}`, backgroundColor: on ? C.lime : "transparent", color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{on ? "✓" : ""}</span>
            {l}
          </div>
        ))}
      </Center>
      {[10, 20, 30, 40, 50, 60].map((a) => (
        <Sfx key={a} s="ui-click" at={a} volume={0.4} rate={0.9 + a / 100} />
      ))}
      <Sfx s="ding" at={70} volume={0.5} />
      <Sfx s="click" at={84} volume={0.7} />
    </AbsoluteFill>
  );
};

// ── 13. SAINT4AI: сцена с прожекторами, «Монтирует всё», таймлайн с волной, раскадровка, ×25, спикер снизу ──
export const Saint: React.FC = () => {
  const f = useCurrentFrame();
  const tl = prog(f, 30, 66);
  const x25 = useSpring(80, 11, 150);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #08090C 0%, #121318 60%, #0E4B43 100%)" }}>
      {[0.25, 0.5, 0.75].map((p, i) => (
        <div key={i} style={{ position: "absolute", left: 1080 * p - 140, top: 0, width: 280, height: 780, background: "linear-gradient(to bottom, rgba(255,255,255,0.32), rgba(255,255,255,0))", clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)", rotate: `${(i - 1) * 14}deg`, transformOrigin: "50% 0" }} />
      ))}
      <Words text="МОНТИРУЕТ ВСЁ" at={2} size={66} top={320} highlight={["ВСЁ", C.mint]} weight={900} />
      <Center top={500} h={200} style={{ opacity: prog(f, 20, 30) }}>
        <div style={{ fontFamily: mono, fontSize: 22, color: "rgba(241,236,227,0.6)", textAlign: "center" }}>01 · запись и расшифровка</div>
        <svg width={W} height="120" style={{ position: "absolute", top: 60, left: 0 }}>
          {[...Array(50)].map((_, i) => {
            const h = 10 + 90 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31));
            return <rect key={i} x={i * 12} y={60 - h / 2} width={7} height={h} rx={3} fill={i * 12 < tl * W ? C.mint : "rgba(241,236,227,0.3)"} />;
          })}
        </svg>
        <div style={{ position: "absolute", left: tl * W, top: 46, width: 4, height: 150, backgroundColor: C.mint }} />
      </Center>
      <Center top={740} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, opacity: prog(f, 50, 60) }}>
        {["хук", "проблема", "шаг 1", "шаг 2", "проверка", "призыв"].map((lab, i) => (
          <div key={lab} style={{ height: 104, borderRadius: 18, backgroundColor: f > 56 + i * 4 ? "rgba(61,237,195,0.92)" : "rgba(255,255,255,0.1)", padding: 12, fontFamily: ui, fontWeight: 700, fontSize: 22, color: f > 56 + i * 4 ? C.ink : C.cream }}>
            <div style={{ fontFamily: mono, fontSize: 18, opacity: 0.7 }}>K{i + 1}</div>
            {lab}
          </div>
        ))}
      </Center>
      <Title text="×25" top={1000} max={150} color={C.cream} at={80} style={{ opacity: x25 }} />
      <div data-fit="decor" style={{ position: "absolute", left: CX - 200, top: 1300, width: 400, height: 360, borderRadius: 40, background: `linear-gradient(160deg, ${C.mint}, #0B6B5C)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}>
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
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#141428", opacity: 1 - rhythm }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const x = CX + Math.sin(f * 0.05 + i * 1.3) * 250, y = 940 + Math.cos(f * 0.045 + i * 2.1) * 320;
          const r = 90 + (i % 3) * 40;
          return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 30% 28%, #ffffff 0%, #C9F 14%, #7AF 30%, #FF7AC6 52%, #3B2BFF 72%, #120F3A 100%)", boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset -20px -30px 50px rgba(0,0,0,0.35)", opacity: 0.95 }} />;
        })}
        <Title text="ГЛУБИНА" top={880} max={120} color={C.white} style={{ textShadow: "0 10px 40px rgba(0,0,0,0.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: rhythm }}>
        <Halftone bg={C.cobalt} dot={C.cream} />
        <Words text="РИТМ" at={70} size={160} top={860} color={C.ink} weight={900} plate={C.cream} />
      </AbsoluteFill>
      <Sfx s="whoosh-soft" at={2} volume={0.5} />
      <Sfx s="whoosh" at={66} volume={0.5} />
      <Sfx s="hit" at={72} volume={0.6} />
    </AbsoluteFill>
  );
};

// ── 15. НАШЕ: рилс в iPhone + лайк, затем проверка безопасных зон → FIT PASS (подписи под макетом) ──
export const Ours: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 16, 80);
  const liked = f >= 40;
  const check = prog(f, 62, 74);
  const fix = prog(f, 90, 104);
  const k = 0.36, MW = 1080 * k, MH = 1920 * k, MX = CX - MW / 2, MY = 430;
  const heart = "M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z";
  return (
    <AbsoluteFill>
      <div data-fit="decor" style={{ position: "absolute", inset: 0, perspective: 2200, opacity: 1 - check }}>
        <div style={{ position: "absolute", left: CX - (PW + 52) / 2, top: 420, translate: `0 ${interpolate(enter, [0, 1], [1300, 0])}px`, scale: "0.8", transformOrigin: "50% 0%" }}>
          <IPhone tiltY={interpolate(enter, [0, 1], [26, 0]) + Math.sin(f / 22) * 4} tiltX={6}>
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
        <Words text="ТЕКСТ НЕ ЗАЛЕЗЕТ ПОД КНОПКИ" at={64} size={48} top={280} color={C.cream} weight={900} />
        <div data-fit="decor" style={{ position: "absolute", left: MX, top: MY, width: MW, height: MH, borderRadius: 32, overflow: "hidden", backgroundColor: "#16161F", boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ position: "absolute", left: 840 * k, top: 360 * k, width: 240 * k, height: 1100 * k, backgroundColor: "rgba(255,59,48,0.3)" }} />
          <div style={{ position: "absolute", left: 0, top: 1360 * k, width: 1080 * k, height: 560 * k, backgroundColor: "rgba(255,59,48,0.3)" }} />
          <div style={{ position: "absolute", left: 120 * k, top: 260 * k, width: 720 * k, height: 1100 * k, border: `3px dashed ${fix > 0.99 ? C.lime : "rgba(241,236,227,0.4)"}` }} />
          <div style={{ position: "absolute", left: interpolate(fix, [0, 1], [520, 160]) * k, top: interpolate(fix, [0, 1], [1450, 700]) * k, width: 560 * k, padding: 8, borderRadius: 10, backgroundColor: C.orange, fontFamily: wide, fontWeight: 900, fontSize: 24, color: C.ink, outline: `4px solid ${fix > 0.99 ? C.lime : "#FF3B30"}` }}>Заголовок</div>
        </div>
        <Center top={MY + MH + 30} style={{ textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: 30 }}>
          <span style={{ color: fix > 0.5 ? C.lime : "#FF6B5E" }}>{fix > 0.5 ? "✓ FIT PASS" : "✗ под кнопками"}</span>
        </Center>
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
