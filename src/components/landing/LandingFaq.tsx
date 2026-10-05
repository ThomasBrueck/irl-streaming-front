import { useState } from "react";
import { FAQS } from "../../lib/landingContent";
import Icon from "../ui/Icon";
import Fold from "./Fold";
import LandingSection from "./LandingSection";
import Rise from "./Rise";

export default function LandingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <LandingSection id="questions" innerClassName="max-w-[1100px] pb-[130px] pt-5">
      <Rise>
        <h2 className="axis mb-10 text-[clamp(48px,8vw,120px)]">Questions.</h2>
      </Rise>
      <div className="border-t-2 border-ink">
        {FAQS.map((f, i) => (
          <div key={f.title}>
            <button
              id={`faq-${i}`}
              type="button"
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className="group axis flex min-h-[72px] w-full items-center justify-between gap-6 border-b-2 border-ink py-[26px] text-left normal-case text-[clamp(20px,2.6vw,34px)] [font-variation-settings:'wdth'_100,'wght'_650]"
            >
              <span>{f.title}</span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-aria-expanded:rotate-45 group-aria-expanded:bg-ink group-aria-expanded:text-paper">
                <Icon name="plus" size={20} strokeWidth={2} />
              </span>
            </button>
            <Fold open={open === i} id={`faq-panel-${i}`} labelledBy={`faq-${i}`}>
              <p className="m-0 max-w-[620px] pb-[30px] pt-[22px] text-[19px] text-ink-soft">{f.body}</p>
            </Fold>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
