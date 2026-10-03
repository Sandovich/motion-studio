// Проверка кадра до рендера: текст не вылез из контейнера и не залез под интерфейс Instagram.
// Работает на любой композиции без переделки компонентов: положить <FitProbe /> последним слоем.
// В обычном превью/рендере ничего не делает; включается только с inputProps { qa: true } (scripts/qa-fit.mjs).
// Зоны — из reference/platform-guides saint4ai/reels-pipline-automotaj (MIT, onAI Academy), по гайду Meta для Reels.
import React, { useLayoutEffect, useRef } from "react";
import { continueRender, delayRender, getInputProps, useCurrentFrame, useVideoConfig } from "remotion";

// Критическая зона для 1080×1920: заголовки, субтитры, CTA, логотипы, активные узлы схем.
// Справа 840 — дальше лента кнопок (лайк, коммент, отправить); снизу 1360 — подпись, профиль, навигация.
export const REELS_SAFE = { x: 120, y: 260, right: 840, bottom: 1360 };

const visible = (el: Element) => {
  let op = 1;
  for (let e: Element | null = el; e; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    op *= Number(cs.opacity);
    if (op < 0.15) return false;
  }
  return true;
};

const ownText = (el: Element) =>
  [...el.childNodes]
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent ?? "")
    .join("")
    .trim();

export const FitProbe: React.FC<{ zone?: typeof REELS_SAFE }> = ({ zone }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const qa = Boolean((getInputProps() as { qa?: boolean }).qa);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!qa) return;
    const handle = delayRender("FitProbe");
    // Remotion растягивает и ставит кадр на место уже после монтирования — ждём, пока корень получит размер
    const waitLayout = (tries = 0): Promise<void> =>
      new Promise((res) => {
        const root = ref.current?.parentElement;
        const b = root?.getBoundingClientRect();
        if ((b && b.width >= 10 && b.height >= 10) || tries > 60) res();
        else setTimeout(() => waitLayout(tries + 1).then(res), 50);
      });
    Promise.all([document.fonts.ready, waitLayout()]).then(() => {
      // координаты экрана → координаты композиции: меряем от слоя-маркера во весь кадр
      const marker = ref.current;
      const root = marker?.parentElement;
      if (!marker || !root) return continueRender(handle);
      const pr = root.getBoundingClientRect();
      if (pr.width < 10 || pr.height < 10) {
        console.log("[fit] probe: кадр так и не получил размер — проверка не выполнена");
        return continueRender(handle);
      }
      const rb = marker.getBoundingClientRect();
      const k = rb.width ? width / rb.width : 1;
      const z = zone ?? (width === 1080 && height === 1920 ? REELS_SAFE : null);
      for (const el of root.querySelectorAll("*")) {
        if (el.closest("[data-fit='ignore']")) continue;
        const text = ownText(el);
        if (!text || !visible(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const x = (r.left - rb.left) * k, y = (r.top - rb.top) * k, w = r.width * k, h = r.height * k;
        const label = `«${text.slice(0, 28)}»`;
        // 1. переполнение: содержимое шире/выше своего блока
        const he = el as HTMLElement;
        if (he.scrollWidth > he.clientWidth + 2 && he.clientWidth > 0) console.log(`[fit] overflow-x: ${label} кадр ${frame}`);
        // 2. вылет за кадр
        const decor = Boolean(el.closest("[data-fit='decor']"));
        if (!decor && (x < -1 || y < -1 || x + w > width + 1 || y + h > height + 1)) console.log(`[fit] off-frame: ${label} кадр ${frame} (${Math.round(x)},${Math.round(y)})`);
        // 3. под интерфейсом Instagram (только критичный текст: всё, что не помечено data-fit="decor")
        else if (z && !decor && (x < z.x || y < z.y || x + w > z.right || y + h > z.bottom))
          console.log(`[fit] ui-zone: ${label} кадр ${frame} x ${Math.round(x)}–${Math.round(x + w)}, y ${Math.round(y)}–${Math.round(y + h)}`);
      }
      continueRender(handle);
    });
  }, [qa, frame, width, height, zone]);
  return qa ? <div ref={ref} data-fit="ignore" style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none" }} /> : null;
};
