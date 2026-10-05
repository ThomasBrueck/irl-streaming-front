import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DIAL_STATIONS } from "../../lib/landingContent";
import { TUNED_WITHIN, nearestStation, signalDistance } from "../../lib/dial";
import Icon from "../ui/Icon";
import Rise from "./Rise";
import LandingSection from "./LandingSection";
import DialScope from "./DialScope";

// Ruler: 51 ticks. Every tenth (offset 5) sits under a station.
const TICKS = Array.from({ length: 51 }, (_, i) => {
  const major = i % 10 === 5;
  const mid = i % 5 === 0;
  return {
    x: i * 20,
    h: major ? 84 : mid ? 50 : 28,
    stroke: major ? "#0c0a14" : mid ? "#5a5870" : "#a3a2b5",
    width: major ? 3.5 : mid ? 2.5 : 2,
  };
});

/** The "Tune in" section: a dial over the five categories. Drag the needle,
 * tap the ruler or use the arrow keys; it settles on the closest channel. */
export default function ChannelDial() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(() => (reduced ? 50 : 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const idx = nearestStation(pos);
  const station = DIAL_STATIONS[idx];
  const clear = signalDistance(pos) < TUNED_WITHIN;

  // On first view the needle sweeps across once to show that it moves.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".dial-tick", {
        scaleY: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.012,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const p = { v: 0 };
          tweenRef.current = gsap.to(p, { v: 50, duration: 2.4, ease: "power2.inOut", onUpdate: () => setPos(p.v) });
        },
      });
    }, root);
    return () => {
      ctx.revert();
      tweenRef.current?.kill();
    };
  }, [reduced]);

  const stopTween = () => {
    tweenRef.current?.kill();
  };

  const snapTo = (target: number, from: number) => {
    stopTween();
    if (reduced) {
      setPos(target);
      return;
    }
    const p = { v: from };
    tweenRef.current = gsap.to(p, { v: target, duration: 0.5, ease: "power3.out", onUpdate: () => setPos(p.v) });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const forward = e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "PageUp";
    const backward = e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "PageDown";
    let target: number | undefined;
    if (forward) target = DIAL_STATIONS.find((s) => s.pos > pos + 0.5)?.pos ?? DIAL_STATIONS[DIAL_STATIONS.length - 1].pos;
    else if (backward) target = [...DIAL_STATIONS].reverse().find((s) => s.pos < pos - 0.5)?.pos ?? DIAL_STATIONS[0].pos;
    else if (e.key === "Home") target = DIAL_STATIONS[0].pos;
    else if (e.key === "End") target = DIAL_STATIONS[DIAL_STATIONS.length - 1].pos;
    if (target === undefined) return;
    e.preventDefault();
    snapTo(target, pos);
  };

  return (
    <LandingSection id="tune-in" innerClassName="pb-[110px] pt-10">
      <div ref={sectionRef}>
        <Rise>
          <h2 className="axis mb-5 text-[clamp(56px,10vw,160px)]">Tune in.</h2>
        </Rise>
        <Rise>
          <p className="mb-12 max-w-[520px] text-[clamp(18px,1.6vw,22px)] text-ink-soft">
            Turn the dial to find a channel. Slide it, tap it, or use the arrow keys.
          </p>
        </Rise>

        <Rise>
          <div className="rounded-[28px] bg-white p-2.5 shadow-[0_0_0_2px_#0c0a14,0_24px_50px_-28px_rgba(12,10,20,.45)]">
            <div className="relative h-[210px] overflow-hidden rounded-[18px] bg-paper shadow-[inset_0_2px_6px_rgba(12,10,20,.14)] focus-within:shadow-[inset_0_2px_6px_rgba(12,10,20,.14),0_0_0_3px_#5b2fe0]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(circle 260px at ${pos}% 60%, rgba(232,51,74,.14), transparent 70%)` }}
              />
              <svg viewBox="0 0 1000 210" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full">
                {TICKS.map((t) => (
                  <line
                    key={t.x}
                    className="dial-tick"
                    x1={t.x}
                    x2={t.x}
                    y1={172}
                    y2={172 - t.h}
                    stroke={t.stroke}
                    strokeWidth={t.width}
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              {DIAL_STATIONS.map((s, i) => (
                <span
                  key={s.value}
                  aria-hidden="true"
                  className={`dial-label absolute bottom-3 z-[2] w-[18%] -translate-x-1/2 whitespace-normal text-center text-[10px] leading-[1.1] sm:w-auto sm:whitespace-nowrap sm:text-[13px] ${i === idx && clear ? "text-tally-text" : "text-ink-faint"}`}
                  style={{ left: `${s.pos}%` }}
                >
                  {s.label}
                </span>
              ))}
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={pos}
                aria-label="Channel dial"
                aria-valuetext={clear ? station.label : "Between channels"}
                className="dial-range absolute inset-0 z-[3] m-0 size-full"
                onChange={(e) => {
                  stopTween();
                  setPos(Number(e.target.value));
                }}
                onPointerDown={stopTween}
                onPointerUp={(e) => {
                  const v = Number(e.currentTarget.value);
                  snapTo(DIAL_STATIONS[nearestStation(v)].pos, v);
                }}
                onKeyDown={onKeyDown}
              />
            </div>

            <div className="px-[26px] pb-6 pt-[30px]">
              <div aria-live="polite" aria-atomic="true">
                <div className={`min-h-5 text-[13px] font-bold uppercase tracking-[.1em] ${clear ? "text-tally-text" : "text-ink-faint"}`}>
                  {clear ? "Tuned in" : "Looking for a signal"}
                </div>
                <div
                  className={`axis dial-name m-0 break-words text-[clamp(34px,9vw,140px)] ${clear ? "text-ink" : "text-[#7b7a8f]"}`}
                  style={{ fontVariationSettings: clear ? '"wdth" 130, "wght" 900' : '"wdth" 62, "wght" 300' }}
                >
                  {clear ? station.label : "Searching"}
                </div>
              </div>
              <div className="mt-[26px] flex flex-wrap items-stretch gap-7">
                <div className="min-w-0 flex-[1_1_320px]">
                  <p className="m-0 min-h-[58px] max-w-[420px] text-[19px] text-ink-soft">
                    {clear ? station.description : "Keep turning until a channel comes in clearly."}
                  </p>
                  <div className="mt-3.5 min-h-6">
                    {clear && (
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-2 font-bold text-ink underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-signal"
                      >
                        See who is live in {station.label}
                        <Icon name="arrow-right" size={18} strokeWidth={2} />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="min-h-[190px] min-w-0 flex-[1_1_360px] overflow-hidden rounded-[14px] bg-paper shadow-[inset_0_2px_6px_rgba(12,10,20,.14)]">
                  <DialScope pos={pos} />
                </div>
              </div>
            </div>
          </div>
        </Rise>
      </div>
    </LandingSection>
  );
}
