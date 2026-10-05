import { Link } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import Icon from "../ui/Icon";

interface DashboardHeaderProps {
  username: string;
  onLogout: () => void;
  /** Shows the red "You are on air" tally when your own channel is live. */
  onAir: boolean;
  /** Shows a "Where to?" link back to the dashboard (used on the watch page). */
  showBack?: boolean;
}

export default function DashboardHeader({ username, onLogout, onAir, showBack = false }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-[clamp(20px,3vw,48px)] py-[18px]">
      <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
        <Link to="/dashboard" className="axis text-4xl lowercase tracking-[-0.04em]" aria-label="irl, home">
          irl
        </Link>
        {showBack && (
          <Link
            to="/dashboard"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-bold shadow-[inset_0_0_0_2px_#0c0a14] transition-[scale,background-color] duration-200 hover:bg-white active:scale-[.96]"
          >
            <Icon name="arrow-left" size={18} strokeWidth={2.2} />
            Where to?
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3.5">
        {onAir && (
          <span className="inline-flex items-center gap-2 text-sm font-bold text-tally-text">
            <i className="size-[9px] rounded-full bg-tally [animation:landing-blink_1.4s_steps(2,start)_infinite]" />
            You are on air
          </span>
        )}
        <AccountMenu username={username} onLogout={onLogout} />
      </div>
    </header>
  );
}
