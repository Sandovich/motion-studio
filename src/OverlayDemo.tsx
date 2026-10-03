import { AbsoluteFill } from "remotion";
import { MarkerCircle, PromptBar } from "./components";
import { C, ui } from "./promo/kit";

// Образец оформления ИИ-моушна (рилсы 13–14): строка промпта поверх сгенерированного видео + обводка маркером.
// Вместо фона — сюда кладётся <Video> из Higgsfield (Seedance 2.5).
export const OverlayDemo: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, #8EC5FF 0%, #EDE6D6 60%)` }}>
    <div style={{ position: "absolute", left: 300, top: 560, width: 360, height: 520, backgroundColor: "#CFC6B2", borderRadius: 12, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }} />
    <MarkerCircle cx={480} cy={700} rx={170} ry={120} at={50} />
    <PromptBar text="Change the background to blue" at={10} font={ui} y={1160} />
    <div style={{ position: "absolute", left: 120, width: 720, top: 1300, textAlign: "center", fontFamily: ui, fontWeight: 800, fontSize: 40, color: C.ink }}>BACKGROUND</div>
  </AbsoluteFill>
);
