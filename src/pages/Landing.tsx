import { useEffect } from "react";
import { ScrollTrigger } from "../lib/gsap";
import LandingNav from "../components/landing/LandingNav";
import LandingHero from "../components/landing/LandingHero";
import ChannelDial from "../components/landing/ChannelDial";
import VerbsAccordion from "../components/landing/VerbsAccordion";
import ChatMargins from "../components/landing/ChatMargins";
import StepsFill from "../components/landing/StepsFill";
import LandingFaq from "../components/landing/LandingFaq";
import LandingCta from "../components/landing/LandingCta";
import ScrollProgress from "../components/landing/ScrollProgress";

/** The public landing page ("Say it live"): a light, type-led page that is
 * deliberately the one non-dark surface of the app. All of its styling is
 * scoped under `.landing` in index.css. */
export default function Landing() {
  // Variable fonts change text widths when they load; re-measure scroll triggers then.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="landing min-h-screen overflow-x-clip">
      <ScrollProgress />
      <LandingNav />
      <main>
        <LandingHero />
        <ChannelDial />
        <VerbsAccordion />
        <ChatMargins />
        <StepsFill />
        <LandingFaq />
      </main>
      <LandingCta />
    </div>
  );
}
