import { Link } from "react-router-dom";
import LandingButton from "./LandingButton";

const LINKS = [
  { href: "#tune-in", label: "Tune in" },
  { href: "#what-you-can-do", label: "What you can do" },
  { href: "#how-it-starts", label: "How it starts" },
  { href: "#questions", label: "Questions" },
];

export default function LandingNav() {
  return (
    <header className="sticky top-0 z-40 bg-paper shadow-[0_1px_0_rgba(12,10,20,.1)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-[clamp(20px,4vw,56px)] py-4">
        <a href="#landing-hero" aria-label="irl, back to the top" className="axis text-[34px] lowercase tracking-[-0.04em]">
          irl
        </a>
        <nav aria-label="Sections" className="hidden gap-1.5 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2.5 font-medium transition-colors duration-200 hover:bg-ink/5">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden min-h-9 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] font-bold tracking-[.04em] shadow-[0_1px_2px_rgba(12,10,20,.08),0_6px_16px_-8px_rgba(12,10,20,.2)] md:inline-flex">
            <i className="size-[9px] rounded-full bg-tally [animation:landing-blink_1.4s_steps(2,start)_infinite]" />
            ON AIR
          </span>
          <Link to="/login" className="rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:text-ink">
            Log in
          </Link>
          <LandingButton to="/register?intent=broadcast" size="sm">
            Go live
          </LandingButton>
        </div>
      </div>
    </header>
  );
}
