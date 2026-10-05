import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const LINES = ["SAY IT", "LIVE."];

/** The headline. Every letter swells toward the pointer, wider and heavier,
 * like a voice getting louder; with no pointer around they breathe on their
 * own. The effect is decoration, so the real text lives in the aria-label. */
export default function VariableTitle() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    const set = (el: HTMLElement, wdth: number, wght: number) => {
      el.style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}, "wght" ${Math.round(wght)}`;
    };
    if (reduced) {
      letters.forEach((l) => set(l, 100, 800));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(letters, { yPercent: 115, rotate: 5, duration: 1.2, ease: "expo.out", stagger: 0.06 });
    }, root);

    const pointer = { x: 0, y: 0, active: false };
    let visible = true;
    let t = 0;
    const current = letters.map(() => ({ w: 90, g: 500 }));

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    const tick = () => {
      if (!visible) return;
      t += 0.016;
      const rects = letters.map((l) => l.getBoundingClientRect());
      letters.forEach((l, i) => {
        const r = rects[i];
        let k: number;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
          k = Math.max(0, 1 - d / 360);
          k = k * k * (3 - 2 * k);
        } else {
          k = ((Math.sin(t * 1.3 + i * 0.7) + 1) / 2) * 0.55;
        }
        current[i].w += (70 + 80 * k - current[i].w) * 0.14;
        current[i].g += (300 + 600 * k - current[i].g) * 0.14;
        set(l, current[i].w, current[i].g);
      });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <h1 ref={ref} aria-label="Say it live." className="axis m-0 text-[clamp(76px,17.5vw,270px)] uppercase">
      {LINES.map((line) => (
        <span key={line} aria-hidden="true" className="block overflow-hidden pb-[.03em] pt-[.02em]">
          {line.split("").map((ch, ci) =>
            ch === " " ? (
              <span key={ci} className="inline-block w-[.22em]" />
            ) : (
              <span
                key={ci}
                data-letter
                className={`inline-block will-change-[font-variation-settings] ${ch === "." ? "text-tally" : ""}`}
                style={{ fontVariationSettings: '"wdth" 90, "wght" 500' }}
              >
                {ch}
              </span>
            )
          )}
        </span>
      ))}
    </h1>
  );
}
