import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { STEPS } from "../../lib/landingContent";
import LandingSection from "./LandingSection";

/** Three big phrases that fill with ink as they cross the middle of the screen. */
export default function StepsFill() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".landing-fill").forEach((el) => {
        gsap.fromTo(
          el,
          { "--f": 0 },
          { "--f": 100, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: 0.5 } }
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <LandingSection id="how-it-starts" innerClassName="pb-[120px] pt-10">
      <div ref={ref}>
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className={`flex flex-wrap items-end justify-between gap-x-10 gap-y-3 border-t-2 border-ink pb-7 pt-5 ${i === STEPS.length - 1 ? "border-b-2" : ""}`}
          >
            <div className="axis landing-fill text-[clamp(46px,9.6vw,150px)]">{s.title}</div>
            <p className="mb-3 max-w-[300px] text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
