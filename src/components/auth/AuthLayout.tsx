import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import LandingButton from "../landing/LandingButton";
import LoudTitle from "./LoudTitle";
import PassBadge, { type PassCheck } from "./PassBadge";

interface AuthLayoutProps {
  headline: string;
  pct: number;
  alt: { to: string; label: string };
  pass: { name: string; handle: string; stamp: string; checks: PassCheck[]; progress: number };
  children: ReactNode;
}

/** Shared frame for Log in and Sign up: header, loud headline, the sentence
 * form and the hanging live pass. From 900px up they sit side by side with
 * the pass on the right; below that the pass hangs under the form. */
export default function AuthLayout({ headline, pct, alt, pass, children }: AuthLayoutProps) {
  return (
    <div className="landing min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-[1520px] flex-col min-[900px]:flex-row">
        <div className="flex min-w-0 flex-1 flex-col px-[clamp(20px,4vw,56px)] pb-14">
          <header className="flex items-center justify-between gap-4 py-[22px]">
            <Link to="/" aria-label="irl, back to the home page" className="axis text-[34px] lowercase tracking-[-0.04em]">
              irl
            </Link>
            <div className="flex items-center gap-3">
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] font-bold tracking-[.04em] shadow-[0_1px_2px_rgba(12,10,20,.08),0_6px_16px_-8px_rgba(12,10,20,.2)]">
                <i className="size-[9px] rounded-full bg-tally [animation:landing-blink_1.4s_steps(2,start)_infinite]" />
                ON AIR
              </span>
              <LandingButton to={alt.to} variant="outline" size="sm">
                {alt.label}
              </LandingButton>
            </div>
          </header>
          <LoudTitle text={headline} pct={pct} />
          {children}
        </div>
        <PassBadge {...pass} />
      </div>
    </div>
  );
}
