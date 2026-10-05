import type { ReactNode } from "react";

interface FoldProps {
  open: boolean;
  id: string;
  labelledBy: string;
  children: ReactNode;
}

/** Height-animating panel for accordions: the grid row slides between 0fr and 1fr. */
export default function Fold({ open, id, labelledBy, children }: FoldProps) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
