import LandingButton from "./LandingButton";
import LandingSection from "./LandingSection";
import Rise from "./Rise";

export default function LandingCta() {
  return (
    <LandingSection id="your-turn" className="bg-ink text-paper" innerClassName="pb-14 pt-[110px]">
      <Rise>
        <h2 className="axis mb-10 text-[clamp(70px,15vw,230px)] uppercase">Your turn.</h2>
      </Rise>
      <div className="flex flex-wrap gap-3">
        <LandingButton to="/register" variant="paper" size="lg">
          Create your account
        </LandingButton>
        <LandingButton to="/login" variant="paper-outline" size="lg">
          Log in
        </LandingButton>
      </div>
      <footer className="mt-[90px] flex flex-wrap items-center justify-between gap-3 text-[#b4b2c4]">
        <span className="axis text-[28px] lowercase text-paper">irl</span>
        <span>Free to watch. Free to stream. &copy; {new Date().getFullYear()} irl</span>
      </footer>
    </LandingSection>
  );
}
