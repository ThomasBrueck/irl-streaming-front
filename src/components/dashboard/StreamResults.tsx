import { Link } from "react-router-dom";
import type { StreamResponse } from "../../types/stream";
import { categoryMeta } from "../../lib/categories";

interface StreamResultsProps {
  streams: StreamResponse[];
  activeIndex: number;
  onActivate: (index: number) => void;
  myStreamId?: number;
}

/** The live streams as a keyboard-friendly list. Focus stays in the search
 * box; the highlighted row is announced through aria-activedescendant. */
export default function StreamResults({ streams, activeIndex, onActivate, myStreamId }: StreamResultsProps) {
  return (
    <div id="stream-results" role="listbox" aria-label="Live streams" className="flex flex-col gap-1">
      {streams.map((s, i) => {
        const meta = categoryMeta(s.category);
        const active = i === activeIndex;
        return (
          <Link
            key={s.id}
            id={`stream-option-${s.id}`}
            to={`/stream/${s.id}`}
            role="option"
            aria-selected={active}
            onPointerEnter={() => onActivate(i)}
            className={`grid min-h-[72px] grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-4 rounded-[18px] px-[18px] py-3 transition-[background-color,box-shadow] duration-150 sm:grid-cols-[14px_minmax(0,1fr)_auto_auto] ${
              active ? "bg-white shadow-[inset_0_0_0_2px_#0c0a14]" : ""
            }`}
          >
            <i className="size-3.5 rounded-full shadow-[inset_0_0_0_2px_#0c0a14]" style={{ background: meta.color }} />
            <span className="min-w-0">
              <b className="axis block truncate text-2xl leading-[1.1] [font-variation-settings:'wdth'_90,'wght'_650]">{s.title}</b>
              <span className="block truncate text-[15px] text-ink-soft">
                {meta.label}
                {myStreamId === s.id ? ", your channel" : ""}
              </span>
            </span>
            <span className="hidden text-right tabular-nums sm:block">
              <b className="axis text-[26px]">{s.viewerCount.toLocaleString()}</b>{" "}
              <span className="font-medium text-ink-soft">watching</span>
            </span>
            <span className="hidden min-w-[62px] text-right sm:block">
              {active && (
                <kbd className="inline-flex min-h-7 min-w-[30px] items-center justify-center rounded-lg border-2 border-b-4 border-ink bg-white px-2 text-[13px] font-bold">
                  Enter
                </kbd>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
