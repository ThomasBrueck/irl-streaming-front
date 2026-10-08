import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePendulum } from "../../hooks/usePendulum";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Icon from "../ui/Icon";

export interface PassCheck {
  label: string;
  ok: boolean;
}

interface PassBadgeProps {
  name: string;
  handle: string;
  /** Text of the green stamp, or empty for none. */
  stamp: string;
  checks: PassCheck[];
  /** Grows as the form fills in; each step gives the pass a little push. */
  progress: number;
}

const AVATAR_COLORS = ["#f9a8d4", "#6ee7b7", "#7dd3fc", "#fcd34d", "#c4b5fd"];
const CATEGORY_DOTS = ["#f472b6", "#34d399", "#38bdf8", "#fbbf24", "#94a3b8"];

/** A live pass hanging from the top of the page. Drag it, throw it, poke it
 * with the mouse, or tap it to see the checklist on the back. */
export default function PassBadge({ name, handle, stamp, checks, progress }: PassBadgeProps) {
  const reduced = useReducedMotion();
  const { hangRef, anchorRef, onPointerDown, onPointerMove, impulse, consumeDrag } = usePendulum(reduced);
  const [flipped, setFlipped] = useState(false);
  const previous = useRef(progress);

  useEffect(() => {
    if (progress > previous.current) impulse((progress >= 10 ? 0.8 : 0.32) * (Math.random() < 0.5 ? -1 : 1));
    previous.current = progress;
  }, [progress, impulse]);

  const initial = (name.charAt(0) || "i").toUpperCase();
  const avatarColor = AVATAR_COLORS[initial.charCodeAt(0) % AVATAR_COLORS.length];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      impulse((e.key === "ArrowRight" ? -1 : 1) * 0.9);
    }
  };

  return (
    <div className="relative flex flex-none flex-col items-center max-[899px]:mt-4 max-[899px]:overflow-hidden min-[900px]:min-h-[720px] min-[900px]:w-[clamp(340px,34vw,440px)]">
      {/* Below 900px the pass hangs under the form, so it gets its own rail and mount to hang from. */}
      <i aria-hidden="true" className="absolute inset-x-[clamp(20px,4vw,56px)] top-0 z-10 h-0.5 rounded-full bg-ink min-[900px]:hidden" />
      <i aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-3 w-[72px] -translate-x-1/2 rounded-b-[10px] bg-ink min-[900px]:hidden" />
      <div className="relative w-[min(320px,80vw)]">
        <i ref={anchorRef} aria-hidden="true" className="absolute left-1/2 top-0 size-0" />
        <div
          ref={hangRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          className="pass-hang flex flex-col items-center"
        >
          <div className="pass-strap" aria-hidden="true">
            IRL LIVE IRL LIVE IRL LIVE IRL LIVE IRL LIVE IRL LIVE
          </div>
          <div className="pass-clip" aria-hidden="true" />
          <div className="pass-stage">
            <div className="pass-card">
              <div className={`pass-flip ${flipped ? "is-flipped" : ""}`}>
                <div className="pass-face pass-front">
                  <div className="pass-slot" />
                  <div className="mb-4 flex items-center justify-between">
                    <span className="axis text-2xl lowercase tracking-[-0.04em]">irl</span>
                    <span className="text-xs font-bold tracking-[.14em]">LIVE PASS</span>
                  </div>
                  <div className="pass-avatar" style={{ background: avatarColor }}>
                    {initial}
                  </div>
                  {stamp && <div className="pass-stamp">{stamp}</div>}
                  <div className="axis mb-1 mt-4 break-words text-center text-[26px] uppercase leading-none">{name}</div>
                  <div className="text-center text-base font-medium text-ink-soft">{handle}</div>
                  <div className="my-4 flex justify-center gap-2" aria-hidden="true">
                    {CATEGORY_DOTS.map((c) => (
                      <i key={c} className="size-3 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="pass-barcode" />
                  <div className="mt-[7px] text-center text-xs text-ink-soft">One channel. Free to watch, free to stream.</div>
                </div>

                <div className="pass-face pass-back">
                  <div className="pass-slot" />
                  <div className="axis mb-3.5 text-[28px] uppercase">Your checklist</div>
                  {checks.map((c) => (
                    <div key={c.label} className={`pass-check ${c.ok ? "is-ok" : ""}`}>
                      <i>{c.ok && <Icon name="check" size={14} strokeWidth={3} />}</i>
                      <span>{c.label}</span>
                    </div>
                  ))}
                  <div className="pass-barcode mt-5" />
                  <div className="mt-[7px] text-center text-xs text-[#b4b2c4]">Tap the pass to flip it back.</div>
                </div>
              </div>
              <button
                type="button"
                className="pass-flipbtn"
                aria-label="Your live pass. Press Enter to flip it. Arrow keys make it swing."
                aria-describedby="pass-hint"
                onClick={() => {
                  if (consumeDrag()) return;
                  setFlipped((f) => !f);
                }}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
      <p id="pass-hint" className="m-0 mt-auto px-4 pb-8 pt-6 text-center text-[15px] text-ink-soft">
        Drag it, swing it, tap to flip.
      </p>
    </div>
  );
}
