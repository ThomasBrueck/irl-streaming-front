import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/** A thin red bar across the top that fills as the page scrolls. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const tween = gsap.to(el, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  if (reduced) return null;
  return <div ref={ref} aria-hidden="true" className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-tally" style={{ transform: "scaleX(0)" }} />;
}
