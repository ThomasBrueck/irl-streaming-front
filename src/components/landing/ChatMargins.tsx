import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { CHAT_BUBBLES } from "../../lib/landingContent";
import LandingSection from "./LandingSection";
import Rise from "./Rise";

/** A paragraph about chat, with example messages floating in its margins. */
export default function ChatMargins() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-bubble]").forEach((el, i) => {
        gsap.from(el, {
          scale: 0.6,
          opacity: 0,
          yPercent: 40,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: i * 0.1,
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        });
        gsap.to(el, { y: -8, duration: 2.4 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 + i * 0.2 });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <LandingSection innerClassName="pb-[130px] pt-[60px]">
      <div ref={ref} className="relative md:min-h-[640px]">
        <Rise>
          <p className="axis relative z-[1] mx-auto max-w-[860px] text-center font-semibold normal-case leading-[1.08] text-[clamp(30px,4.4vw,64px)] [font-variation-settings:'wdth'_90,'wght'_600]">
            The best part of a live stream is everyone <span className="text-signal">talking at once.</span>
          </p>
        </Rise>
        <Rise>
          <p className="relative z-[1] mx-auto mt-7 max-w-[520px] text-center text-[19px] text-ink-soft">
            Messages appear the moment they are sent, and the chat is saved so latecomers can read what they missed.
          </p>
        </Rise>
        <div aria-hidden="true" className="mt-8 flex flex-wrap justify-center gap-2 md:mt-0 md:block">
          {CHAT_BUBBLES.map((b) => (
            <span
              key={b.text}
              data-bubble
              className={`inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white py-2.5 pl-3 pr-[18px] text-[15px] shadow-[0_1px_2px_rgba(12,10,20,.08),0_14px_30px_-14px_rgba(12,10,20,.3)] md:absolute ${b.place}`}
            >
              <b className="inline-flex size-7 items-center justify-center rounded-full text-xs text-white" style={{ background: b.color }}>
                {b.initial}
              </b>
              {b.text}
            </span>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
