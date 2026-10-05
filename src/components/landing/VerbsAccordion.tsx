import { useState } from "react";
import { VERBS } from "../../lib/landingContent";
import Icon from "../ui/Icon";
import Fold from "./Fold";
import LandingSection from "./LandingSection";
import Rise from "./Rise";

/** Three huge verbs. Hover widens one; click opens a short explanation. */
export default function VerbsAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <LandingSection id="what-you-can-do" innerClassName="pb-[100px] pt-[60px]">
      <div className="border-b-2 border-ink">
        {VERBS.map((v, i) => (
          <Rise key={v.title}>
            <button
              id={`verb-${i}`}
              type="button"
              aria-expanded={open === i}
              aria-controls={`verb-panel-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className="landing-verb group flex w-full items-center justify-between gap-6 border-t-2 border-ink py-[26px] text-left"
            >
              <span className="axis landing-verb-word text-[clamp(52px,11vw,170px)]">{v.title}</span>
              <span className="grid size-[52px] shrink-0 place-items-center rounded-full border-2 border-ink transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-aria-expanded:rotate-45 group-aria-expanded:bg-ink group-aria-expanded:text-paper">
                <Icon name="plus" size={24} strokeWidth={2} />
              </span>
            </button>
            <Fold open={open === i} id={`verb-panel-${i}`} labelledBy={`verb-${i}`}>
              <p className="m-0 max-w-[560px] pb-8 text-[clamp(18px,1.7vw,24px)]">{v.body}</p>
            </Fold>
          </Rise>
        ))}
      </div>
    </LandingSection>
  );
}
