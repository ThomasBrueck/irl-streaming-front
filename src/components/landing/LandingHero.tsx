import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import LandingSection from "./LandingSection";
import LandingButton from "./LandingButton";
import VariableTitle from "./VariableTitle";

export default function LandingHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-fade]", { y: 26, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.7 });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <LandingSection id="landing-hero">
      <div ref={ref} className="flex min-h-[560px] flex-col md:min-h-[780px] justify-between gap-12 pb-20 pt-[60px]">
        <VariableTitle />
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p data-fade className="m-0 max-w-[480px] text-[clamp(18px,1.6vw,22px)]">
            Watch people do things live, chat with them as it happens, or go live yourself. Free, and nothing to install.
          </p>
          <div data-fade className="flex flex-wrap gap-3">
            <LandingButton to="/register">Start watching</LandingButton>
            <LandingButton href="#how-it-starts" variant="outline">
              See how it starts
            </LandingButton>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
