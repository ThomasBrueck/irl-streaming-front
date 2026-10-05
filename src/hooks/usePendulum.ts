import { useEffect, useRef, type PointerEvent } from "react";

interface Controller {
  down: (e: PointerEvent) => void;
  move: (e: PointerEvent) => void;
  impulse: (amount: number) => void;
  consumeDrag: () => boolean;
}

const GRAVITY = 8.2; // stiffness of the pendulum (about a 2.2 s swing)
const DAMPING = 1.15;
const MAX_ANGLE = 1.25; // radians the pass can be pulled to

/** Makes an element hang from its top edge like a pendulum you can grab,
 * throw and poke. All per-frame work is one `transform` write on the hanging
 * element, outside React, and the loop sleeps as soon as the pass is at rest.
 * `anchorRef` must point at a zero-size element placed on the pivot (the top
 * center of the hanging element) that does not rotate with it. */
export function usePendulum(reduced: boolean) {
  const hangRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const ctrl = useRef<Controller | null>(null);

  useEffect(() => {
    const hang = hangRef.current;
    const anchor = anchorRef.current;
    if (!hang || !anchor) return;

    const s = { th: reduced ? 0 : 0.6, om: 0, drag: false, press: false, dragged: false, raf: 0, vel: 0, tl: 0, sx: 0, sy: 0, prevT: 0 };

    const apply = () => {
      hang.style.transform = `rotate(${s.th.toFixed(4)}rad)`;
    };

    const kick = () => {
      if (s.raf) return;
      s.tl = performance.now();
      const frame = (now: number) => {
        const dt = Math.min(0.033, (now - s.tl) / 1000);
        s.tl = now;
        if (!s.drag) {
          const a = -GRAVITY * Math.sin(s.th) - DAMPING * s.om;
          s.om += a * dt;
          s.th += s.om * dt;
          if (Math.abs(s.th) < 0.0007 && Math.abs(s.om) < 0.002) {
            s.th = 0;
            s.om = 0;
            apply();
            s.raf = 0;
            return;
          }
        }
        apply();
        s.raf = requestAnimationFrame(frame);
      };
      s.raf = requestAnimationFrame(frame);
    };

    const onWinMove = (e: globalThis.PointerEvent) => {
      if (!s.press) return;
      if (!s.drag) {
        if (Math.hypot(e.clientX - s.sx, e.clientY - s.sy) < 6) return;
        s.drag = true;
        s.dragged = true;
        s.om = 0;
        hang.classList.add("is-grabbing");
        kick();
      }
      const r = anchor.getBoundingClientRect();
      const dx = e.clientX - r.left;
      const dy = Math.max(60, e.clientY - r.top);
      const th = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, Math.atan2(-dx, dy)));
      const now = performance.now();
      const dt = Math.max(1, now - s.prevT) / 1000;
      s.vel = s.vel * 0.6 + ((th - s.th) / dt) * 0.4;
      s.th = th;
      s.prevT = now;
    };

    const onWinUp = () => {
      window.removeEventListener("pointermove", onWinMove);
      window.removeEventListener("pointerup", onWinUp);
      window.removeEventListener("pointercancel", onWinUp);
      const wasDragging = s.drag;
      s.press = false;
      s.drag = false;
      hang.classList.remove("is-grabbing");
      if (wasDragging) {
        s.om = Math.max(-14, Math.min(14, s.vel));
        kick();
      }
    };

    ctrl.current = {
      down: (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        s.press = true;
        s.dragged = false;
        s.sx = e.clientX;
        s.sy = e.clientY;
        s.prevT = performance.now();
        s.vel = 0;
        window.addEventListener("pointermove", onWinMove);
        window.addEventListener("pointerup", onWinUp);
        window.addEventListener("pointercancel", onWinUp);
      },
      // Moving the mouse across the pass gives it a small push.
      move: (e) => {
        if (s.drag || s.press || reduced || e.pointerType !== "mouse") return;
        s.om = Math.max(-3.5, Math.min(3.5, s.om - e.movementX * 0.012));
        if (Math.abs(e.movementX) > 1) kick();
      },
      impulse: (amount) => {
        if (reduced) return;
        s.om += amount;
        kick();
      },
      // True once after a drag, so the click that ends a drag does not flip the pass.
      consumeDrag: () => {
        const was = s.dragged;
        s.dragged = false;
        return was;
      },
    };

    apply();
    if (!reduced) kick(); // the pass drops in swinging

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("pointermove", onWinMove);
      window.removeEventListener("pointerup", onWinUp);
      window.removeEventListener("pointercancel", onWinUp);
      ctrl.current = null;
    };
  }, [reduced]);

  return {
    hangRef,
    anchorRef,
    onPointerDown: (e: PointerEvent) => ctrl.current?.down(e),
    onPointerMove: (e: PointerEvent) => ctrl.current?.move(e),
    impulse: (amount: number) => ctrl.current?.impulse(amount),
    consumeDrag: () => ctrl.current?.consumeDrag() ?? false,
  };
}
