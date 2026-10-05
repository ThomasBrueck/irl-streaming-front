import { useEffect, useRef, useState } from "react";

interface AccountMenuProps {
  username: string;
  onLogout: () => void;
}

/** The round avatar in the header. Opens a small menu with the way out. */
export default function AccountMenu({ username, onLogout }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${username}`}
        onClick={() => setOpen((o) => !o)}
        className="axis grid size-12 place-items-center rounded-full border-2 border-ink bg-[#c4b5fd] text-[22px] uppercase transition-[scale] duration-200 active:scale-[.96] [font-variation-settings:'wdth'_110,'wght'_900]"
      >
        {(username.charAt(0) || "?").toUpperCase()}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[60px] z-30 w-60 rounded-[22px] bg-white p-2 shadow-[inset_0_0_0_2px_#0c0a14,0_28px_50px_-24px_rgba(12,10,20,.5)]"
        >
          <div className="px-3.5 pb-2 pt-3">
            <div className="axis text-xl uppercase">{username}</div>
            <div className="text-sm text-ink-soft">@{username}</div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="flex min-h-11 w-full items-center rounded-[14px] px-3.5 text-left font-bold transition-colors duration-150 hover:bg-paper"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
