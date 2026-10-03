import { AbsoluteFill } from "remotion";
import { FitProbe } from "./components";

// Контроль проверки: здесь всё нарочно неправильно — qa-fit ОБЯЗАН дать FIT FAIL (3 находки).
export const FitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#111", color: "#fff", fontSize: 60 }}>
    <div style={{ position: "absolute", top: 600, left: 200, width: 300, whiteSpace: "nowrap", overflow: "hidden" }}>Этот текст не влезает в плашку</div>
    <div style={{ position: "absolute", top: 800, left: 900 }}>Лайк</div>
    <div style={{ position: "absolute", top: 1600, left: 200 }}>Под подписью</div>
    <FitProbe />
  </AbsoluteFill>
);
