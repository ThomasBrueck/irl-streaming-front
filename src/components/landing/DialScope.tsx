import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { nearestStation, noiseLevel } from "../../lib/dial";

const GRID = "#d9dae6";
const INK = "#0c0a14";
const STATIC = "#9a98ab";
const RED = "#e8334a";

/** Wave shape per station: voices, blocks, steps, bursts, triangles. */
function shape(station: number, u: number, t: number): number {
  switch (station) {
    case 0:
      return Math.sin(u * 2 + t) * 0.5 + Math.sin(u * 5 - t * 1.4) * 0.22;
    case 1:
      return Math.sign(Math.sin(u * 3 + t)) * 0.45 * (0.7 + 0.3 * Math.sin(t));
    case 2:
      return Math.floor(Math.sin(u * 2.4 + t) * 0.5 * 5) / 5;
    case 3:
      return Math.sin(u * 4 + t * 1.6) * 0.55 * Math.abs(Math.sin(u * 0.8 + t * 0.6));
    default:
      return (Math.asin(Math.sin(u * 3 + t)) / 1.5708) * 0.5;
  }
}

/** A small oscilloscope: a clean line when the dial is tuned to a station,
 * scribbles when the needle is between two. */
export default function DialScope({ pos }: { pos: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef(pos);
  const renderRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    posRef.current = pos;
    // With reduced motion there is no loop, so redraw once per change.
    if (reduced) renderRef.current?.();
  }, [pos, reduced]);

  useEffect(() => {
    const cv = canvasRef.current;
    const c = cv?.getContext("2d");
    if (!cv || !c) return;
    let w = 0;
    let h = 0;
    let t = 0;
    let visible = true;
    let raf = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const p = posRef.current;
      const station = nearestStation(p);
      const noise = noiseLevel(p);
      c.clearRect(0, 0, w, h);
      c.strokeStyle = GRID;
      c.lineWidth = 1;
      c.beginPath();
      for (let x = 0; x <= w; x += 36) {
        c.moveTo(x, 0);
        c.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += 30) {
        c.moveTo(0, y);
        c.lineTo(w, y);
      }
      c.stroke();

      c.strokeStyle = noise > 0.5 ? STATIC : INK;
      c.lineWidth = 3;
      c.lineJoin = "round";
      c.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const base = shape(station, (x / w) * 6.2832, t);
        const scribble = reduced ? Math.sin(x * 3.1) * Math.sin(x * 0.37) : Math.random() - 0.5;
        const y = base * (1 - noise) + scribble * 1.4 * noise;
        const yy = h / 2 - y * h * 0.4;
        if (x === 0) c.moveTo(x, yy);
        else c.lineTo(x, yy);
      }
      c.stroke();

      if (noise < 0.5 && !reduced) {
        const sx = (t * 70) % w;
        c.strokeStyle = RED;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(sx, 0);
        c.lineTo(sx, h);
        c.stroke();
      }
    };
    renderRef.current = draw;

    size();
    const ro = new ResizeObserver(() => {
      size();
      draw();
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(cv);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      t += 0.04;
      draw();
    };
    if (reduced) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderRef.current = null;
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block h-full min-h-[190px] w-full" />;
}
