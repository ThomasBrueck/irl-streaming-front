import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface RiseProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Lifts its content into place once, the first time it scrolls into view. */
export default function Rise({ children, className = "", delay = 0 }: RiseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const tween = gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      delay,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [reduced, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
