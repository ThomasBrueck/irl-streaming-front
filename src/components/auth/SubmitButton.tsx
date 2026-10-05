import type { ReactNode } from "react";
import Icon from "../ui/Icon";

interface SubmitButtonProps {
  loading: boolean;
  children: ReactNode;
}

export default function SubmitButton({ loading, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex min-h-16 items-center justify-center gap-3 rounded-full border-2 border-ink bg-ink px-[38px] text-[19px] font-bold text-paper transition-[scale,background-color] duration-200 ease-[cubic-bezier(.2,0,0,1)] hover:bg-[#2a2540] active:scale-[.96] disabled:cursor-wait disabled:opacity-80"
    >
      {loading && (
        <span className="size-5 rounded-full border-[3px] border-paper/30 border-t-paper [animation:auth-spin_.7s_linear_infinite]" />
      )}
      <span>{children}</span>
      <Icon name="arrow-right" size={18} strokeWidth={2} />
    </button>
  );
}
