import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getStreams, getMyStream, createStream, updateStream, updateStreamStatus } from "../api/streams";
import type { StreamResponse } from "../types/stream";
import { CATEGORIES, categoryMeta, type StreamCategory } from "../lib/categories";
import { matchesSearch } from "../lib/dashboard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StreamResults from "../components/dashboard/StreamResults";
import ChannelPanel, { type ChannelValues } from "../components/dashboard/ChannelPanel";
import Icon from "../components/ui/Icon";

const REFRESH_MS = 15000;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = user?.id;
  const username = user?.username || "you";

  const [streams, setStreams] = useState<StreamResponse[]>([]);
  const [myStream, setMyStream] = useState<StreamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState<StreamCategory | "ALL">("ALL");
  const [active, setActive] = useState(0);

  useEffect(() => {
    Promise.all([getStreams(), userId ? getMyStream(userId) : Promise.resolve(null)])
      .then(([all, mine]) => {
        setStreams(all);
        setMyStream(mine);
      })
      .catch(() => show("Couldn't load streams.", "error"))
      .finally(() => setLoading(false));
  }, [userId, show]);

  // Keep the list fresh while the page is open: new streams and viewer counts.
  useEffect(() => {
    const id = window.setInterval(() => {
      getStreams()
        .then(setStreams)
        .catch(() => undefined);
    }, REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  // Your own channel, as the server last reported it (the list refreshes it).
  const channel = useMemo(() => streams.find((s) => s.id === myStream?.id) ?? myStream, [streams, myStream]);
  const onAir = channel?.status === "LIVE";

  const matching = useMemo(
    () => streams.filter((s) => (category === "ALL" || s.category === category) && matchesSearch(s, search)),
    [streams, category, search]
  );
  const live = useMemo(() => matching.filter((s) => s.status === "LIVE").sort((a, b) => b.viewerCount - a.viewerCount), [matching]);
  const offline = useMemo(() => matching.filter((s) => s.status !== "LIVE"), [matching]);
  const liveAll = useMemo(() => streams.filter((s) => s.status === "LIVE"), [streams]);
  const activeIndex = Math.min(active, Math.max(0, live.length - 1));
  const hasFilters = category !== "ALL" || search.trim() !== "";

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, live.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter" && live[activeIndex]) {
      e.preventDefault();
      navigate(`/stream/${live[activeIndex].id}`);
    } else if (e.key === "Escape") {
      setSearch("");
    }
  };

  const createChannel = async (v: ChannelValues) => {
    setBusy(true);
    try {
      const stream = await createStream({ title: v.title, description: v.description || undefined, category: v.category });
      setMyStream(stream);
      setStreams((prev) => [stream, ...prev]);
      show("Your channel is ready!", "success");
      navigate(`/stream/${stream.id}`);
    } catch {
      show("Couldn't create your channel.", "error");
    } finally {
      setBusy(false);
    }
  };

  const goLive = async (v: ChannelValues) => {
    if (!channel) return;
    setBusy(true);
    try {
      let current = channel;
      if (v.title !== channel.title || v.category !== channel.category) {
        current = await updateStream(channel.id, { title: v.title, description: channel.description ?? undefined, category: v.category });
      }
      const updated = await updateStreamStatus(current.id, "LIVE");
      setMyStream(updated);
      setStreams((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      show("You're live!", "success");
      navigate(`/stream/${updated.id}`);
    } catch {
      show("Couldn't update your channel.", "error");
    } finally {
      setBusy(false);
    }
  };

  const endStream = async () => {
    if (!channel) return;
    setBusy(true);
    try {
      const updated = await updateStreamStatus(channel.id, "OFFLINE");
      setMyStream(updated);
      setStreams((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      show("Stream ended.", "success");
    } catch {
      show("Couldn't update your channel.", "error");
    } finally {
      setBusy(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("ALL");
  };

  const chips: { value: StreamCategory | "ALL"; label: string; color: string; count: number }[] = [
    { value: "ALL", label: "All", color: "#ffffff", count: liveAll.length },
    ...CATEGORIES.map((c) => ({ value: c.value, label: c.label, color: c.color, count: liveAll.filter((s) => s.category === c.value).length })),
  ];

  return (
    <div className="landing min-h-screen overflow-x-clip">
      <DashboardHeader username={username} onLogout={logout} onAir={onAir} />

      <div className="mx-auto flex max-w-[1440px] flex-wrap items-start gap-12 px-[clamp(20px,3vw,48px)] pb-[90px] pt-6">
        <main className="min-w-0 flex-[1_1_640px]">
          <h1 className="axis auth-rise mb-7 text-[clamp(64px,9vw,136px)] uppercase">Where to?</h1>

          <div className="auth-rise relative [animation-delay:.1s]">
            <label htmlFor="stream-search" className="sr-only">
              Search streams by title or category
            </label>
            <Icon name="search" size={26} strokeWidth={2} className="pointer-events-none absolute left-[22px] top-[25px] text-ink" />
            <input
              id="stream-search"
              type="search"
              role="combobox"
              aria-expanded={live.length > 0}
              aria-controls="stream-results"
              aria-autocomplete="list"
              aria-activedescendant={live[activeIndex] ? `stream-option-${live[activeIndex].id}` : undefined}
              autoComplete="off"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search by title or category"
              className="block min-h-[76px] w-full rounded-3xl bg-white pl-[58px] pr-5 text-lg font-medium sm:pl-[62px] sm:pr-6 sm:text-2xl shadow-[inset_0_0_0_2px_#0c0a14,0_20px_40px_-26px_rgba(12,10,20,.5)] transition-shadow duration-200 placeholder:font-normal placeholder:text-ink-faint focus:outline-none focus:shadow-[inset_0_0_0_3px_#5b2fe0,0_0_0_5px_rgba(91,47,224,.2),0_20px_40px_-26px_rgba(12,10,20,.5)]"
            />
          </div>

          <div role="group" aria-label="Categories" className="auth-rise mb-[22px] mt-[18px] flex flex-wrap gap-2 [animation-delay:.16s]">
            {chips.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={category === c.value}
                onClick={() => {
                  setCategory(c.value);
                  setActive(0);
                }}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-bold shadow-[inset_0_0_0_2px_#0c0a14] transition-[scale,background-color,color] duration-200 active:scale-[.96] ${
                  category === c.value ? "bg-ink text-paper" : "hover:bg-white"
                }`}
              >
                <i className="size-[11px] rounded-full shadow-[inset_0_0_0_2px_#0c0a14]" style={{ background: c.color }} />
                {c.label} <span className="font-medium opacity-70">{c.count}</span>
              </button>
            ))}
          </div>

          <p aria-live="polite" className="mb-3 min-h-[26px] text-[15px] font-medium text-ink-soft">
            {loading ? "" : `${live.length} ${live.length === 1 ? "stream is" : "streams are"} live here.`}
          </p>

          {loading ? (
            <div aria-busy="true" aria-label="Loading streams">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-1.5 h-[72px] animate-shimmer rounded-[18px] bg-[linear-gradient(90deg,#e6e7f1_0,#f6f7fb_50%,#e6e7f1_100%)] bg-[length:200%_100%]" />
              ))}
            </div>
          ) : live.length === 0 ? (
            <div className="px-1 py-8">
              <div className="axis text-[clamp(32px,4vw,52px)] uppercase">
                {streams.length === 0 ? "Nobody is live yet." : hasFilters ? "Nothing matches that." : "Nobody is live right now."}
              </div>
              <p className="mb-[22px] mt-3.5 max-w-[480px] text-[19px] text-ink-soft">
                {hasFilters
                  ? "Try another word or category, or clear the search."
                  : "Streams show up here the moment someone goes live. Be the first."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-ink bg-ink px-[26px] text-[17px] font-bold text-paper transition-[scale,background-color] duration-200 hover:bg-[#2a2540] active:scale-[.96]"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <StreamResults streams={live} activeIndex={activeIndex} onActivate={setActive} myStreamId={channel?.id} />
          )}

          {!loading && offline.length > 0 && (
            <div className="mt-[22px] px-[18px] text-[15px] text-ink-soft">
              <p className="m-0 mb-1.5">Offline right now:</p>
              <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
                {offline.slice(0, 8).map((s) => (
                  <li key={s.id}>
                    <Link to={`/stream/${s.id}`} className="underline decoration-1 underline-offset-4 hover:text-ink">
                      {s.title}
                    </Link>
                    <span className="text-ink-faint"> ({categoryMeta(s.category).label})</span>
                  </li>
                ))}
                {offline.length > 8 && <li>and {offline.length - 8} more</li>}
              </ul>
            </div>
          )}

          {live.length > 0 && (
            <p className="mt-[26px] hidden px-[18px] text-[15px] text-ink-soft sm:block">
              <kbd className="rounded-lg border-2 border-b-4 border-ink bg-white px-2 text-[13px] font-bold">Up</kbd>{" "}
              <kbd className="rounded-lg border-2 border-b-4 border-ink bg-white px-2 text-[13px] font-bold">Down</kbd> to move,{" "}
              <kbd className="rounded-lg border-2 border-b-4 border-ink bg-white px-2 text-[13px] font-bold">Enter</kbd> to watch.
            </p>
          )}
        </main>

        <aside className="min-w-[min(100%,320px)] flex-[0_1_400px] lg:sticky lg:top-6">
          {!loading && (
            <ChannelPanel
              key={channel ? `${channel.id}-${channel.status}` : "new"}
              channel={channel}
              busy={busy}
              onCreate={createChannel}
              onGoLive={goLive}
              onEnd={endStream}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
