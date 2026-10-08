import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getStreamById, getStreams, updateStreamStatus, updateStream } from "../api/streams";
import { getUserById } from "../api/users";
import type { StreamResponse } from "../types/stream";
import { categoryMeta } from "../lib/categories";
import { initials } from "../lib/identity";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StreamStage from "../components/watch/StreamStage";
import EditChannelDialog, { type EditValues } from "../components/watch/EditChannelDialog";
import Chat from "../components/Chat";
import Icon from "../components/ui/Icon";

const REFRESH_MS = 10000;
const outlineButton =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border-2 border-ink px-[22px] text-base font-bold transition-[scale,background-color,color] duration-200 hover:bg-ink hover:text-paper active:scale-[.96] disabled:cursor-wait disabled:opacity-60";

export default function StreamView() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const { show } = useToast();
  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [others, setOthers] = useState<StreamResponse[]>([]);
  const [hostName, setHostName] = useState("");
  const [problem, setProblem] = useState<"missing" | "failed" | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [toggling, setToggling] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number>(0);

  const userId = user?.id;
  const username = user?.username || "anonymous";
  const isOwner = stream && userId ? String(stream.userId) === userId : false;
  const live = stream?.status === "LIVE";

  // This route is keyed by :id (see StreamViewRoute in App.tsx), so a fresh
  // mount, and fresh state, is guaranteed whenever the stream changes.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getStreamById(Number(id))
      .then(async (s) => {
        const [all, host] = await Promise.all([
          getStreams().catch(() => [] as StreamResponse[]),
          String(s.userId) === userId ? Promise.resolve(null) : getUserById(s.userId).catch(() => null),
        ]);
        if (cancelled) return;
        setStream(s);
        setOthers(all);
        setHostName(host ? host.displayName || host.username : "");
      })
      .catch((err) => {
        if (!cancelled) setProblem(isAxiosError(err) && err.response?.status === 404 ? "missing" : "failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, userId, attempt]);

  // Keep viewer count, status and the "Also on air" list fresh while watching.
  useEffect(() => {
    if (!id) return;
    const timer = window.setInterval(() => {
      Promise.all([getStreamById(Number(id)), getStreams()])
        .then(([s, all]) => {
          setStream(s);
          setOthers(all);
        })
        .catch(() => undefined);
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [id]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const toggleStatus = async () => {
    if (!stream) return;
    setToggling(true);
    try {
      const next = stream.status === "LIVE" ? "OFFLINE" : "LIVE";
      setStream(await updateStreamStatus(stream.id, next));
      show(next === "LIVE" ? "You're live!" : "Stream ended.", "success");
    } catch {
      show("Couldn't update your channel.", "error");
    } finally {
      setToggling(false);
    }
  };

  const saveEdit = async (v: EditValues) => {
    if (!stream) return;
    setSaving(true);
    try {
      setStream(await updateStream(stream.id, { title: v.title, description: v.description || undefined, category: v.category }));
      setEditing(false);
      show("Channel updated.", "success");
    } catch {
      show("Couldn't save your changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const closeEdit = useCallback(() => setEditing(false), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      show("Couldn't copy the link.", "error");
    }
  };

  const header = (
    <DashboardHeader username={username} onLogout={logout} onAir={isOwner && live} showBack />
  );

  if (loading) {
    return (
      <div className="landing min-h-screen">
        {header}
        <div className="mx-auto flex max-w-[1520px] flex-col gap-10 px-[clamp(20px,3vw,48px)] pb-20 pt-4 lg:flex-row" aria-busy="true" aria-label="Loading stream">
          <div className="min-w-0 lg:flex-1">
            <div className="aspect-video animate-shimmer rounded-[28px] bg-[linear-gradient(90deg,#e6e7f1_0,#f6f7fb_50%,#e6e7f1_100%)] bg-[length:200%_100%]" />
            <div className="mt-8 h-24 w-3/4 animate-shimmer rounded-3xl bg-[linear-gradient(90deg,#e6e7f1_0,#f6f7fb_50%,#e6e7f1_100%)] bg-[length:200%_100%]" />
          </div>
          <div className="mx-auto h-[560px] w-full max-w-[760px] animate-shimmer lg:mx-0 lg:w-[420px] lg:max-w-none lg:flex-none rounded-[28px] bg-[linear-gradient(90deg,#e6e7f1_0,#f6f7fb_50%,#e6e7f1_100%)] bg-[length:200%_100%]" />
        </div>
      </div>
    );
  }

  if (problem || !stream) {
    const missing = problem !== "failed";
    return (
      <div className="landing min-h-screen">
        {header}
        <main className="mx-auto max-w-[900px] px-[clamp(20px,3vw,48px)] py-16">
          <h1 className="axis auth-rise text-[clamp(48px,8vw,112px)] uppercase">{missing ? "Stream not found." : "Couldn't load it."}</h1>
          <p className="mb-7 mt-4 max-w-[480px] text-xl text-ink-soft">
            {missing ? "This channel may not exist, or the link is wrong." : "Something went wrong while loading this stream."}
          </p>
          <div className="flex flex-wrap gap-3">
            {!missing && (
              <button
                type="button"
                onClick={() => {
                  setProblem(null);
                  setLoading(true);
                  setAttempt((n) => n + 1);
                }}
                className="inline-flex min-h-[52px] items-center rounded-full border-2 border-ink bg-ink px-[26px] text-[17px] font-bold text-paper transition-[scale,background-color] duration-200 hover:bg-[#2a2540] active:scale-[.96]"
              >
                Try again
              </button>
            )}
            <Link to="/dashboard" className={`${outlineButton} min-h-[52px] px-[26px] text-[17px]`}>
              Back to streams
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const meta = categoryMeta(stream.category);
  const host = isOwner ? username : hostName || `Channel ${stream.userId}`;
  const alsoOnAir = others
    .filter((s) => s.id !== stream.id && s.status === "LIVE")
    .sort((a, b) => b.viewerCount - a.viewerCount)
    .slice(0, 3);

  return (
    <div className="landing min-h-screen overflow-x-clip">
      {header}

      <div className="mx-auto flex max-w-[1520px] flex-col gap-10 px-[clamp(20px,3vw,48px)] pb-[90px] pt-4 lg:flex-row lg:items-start">
        <main className="min-w-0 lg:flex-1">
          <div className="auth-rise">
            <StreamStage stream={stream} isOwner={isOwner} displayName={username} hostName={host} />
          </div>

          <section className="px-1.5 pt-8">
            <h1 className="axis auth-rise text-[clamp(40px,5.4vw,84px)] uppercase [animation-delay:.08s] [overflow-wrap:anywhere]">{stream.title}</h1>

            <div className="mt-[22px] flex flex-wrap items-center gap-x-5 gap-y-3.5">
              <div className="flex items-center gap-3">
                <span className="axis grid size-11 place-items-center rounded-full border-2 border-ink bg-[#c4b5fd] text-xl uppercase [font-variation-settings:'wdth'_110,'wght'_900]">
                  {initials(host).charAt(0)}
                </span>
                <b className="text-lg">{host}</b>
              </div>
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-[15px] font-bold shadow-[inset_0_0_0_2px_#0c0a14]">
                <i className="size-[11px] rounded-full shadow-[inset_0_0_0_2px_#0c0a14]" style={{ background: meta.color }} />
                {meta.label}
              </span>
              {live && (
                <span className="text-[17px] tabular-nums text-ink-soft">
                  <b className="axis mr-1.5 text-[28px] text-ink">{stream.viewerCount.toLocaleString()}</b>
                  {stream.viewerCount === 1 ? "person watching" : "people watching"}
                </span>
              )}

              <div className="flex flex-wrap gap-2.5 sm:ml-auto">
                <button type="button" onClick={copyLink} className={outlineButton}>
                  <Icon name="link" size={18} strokeWidth={2.2} />
                  {copied ? "Link copied" : "Copy link"}
                </button>
                {isOwner && (
                  <>
                    <button type="button" onClick={() => setEditing(true)} className={outlineButton}>
                      <Icon name="edit" size={18} strokeWidth={2.2} />
                      Edit channel
                    </button>
                    <button
                      type="button"
                      onClick={toggleStatus}
                      disabled={toggling}
                      className={
                        live
                          ? outlineButton
                          : "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border-2 border-tally-text bg-tally-text px-[22px] text-base font-bold text-white transition-[scale,background-color] duration-200 hover:bg-[#a8162f] active:scale-[.96] disabled:cursor-wait disabled:opacity-60"
                      }
                    >
                      {toggling && <span className="size-[18px] rounded-full border-[3px] border-current/30 border-t-current [animation:auth-spin_.7s_linear_infinite]" />}
                      {live ? "End stream" : "Go live"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {stream.description && <p className="mt-[22px] max-w-[640px] text-[19px] text-ink-soft [overflow-wrap:anywhere]">{stream.description}</p>}
          </section>

          {alsoOnAir.length > 0 && (
            <section className="pt-11" aria-label="More live streams">
              <h2 className="axis mb-4 text-[30px] uppercase">Also on air</h2>
              <div className="flex max-w-[760px] flex-col gap-2.5">
                {alsoOnAir.map((s) => {
                  const m = categoryMeta(s.category);
                  return (
                    <Link
                      key={s.id}
                      to={`/stream/${s.id}`}
                      className="flex min-h-16 items-center gap-3 rounded-full px-[18px] py-2.5 shadow-[inset_0_0_0_2px_#0c0a14] transition-[background-color,scale] duration-200 hover:bg-white active:scale-[.98]"
                    >
                      <i className="size-3.5 shrink-0 rounded-full shadow-[inset_0_0_0_2px_#0c0a14]" style={{ background: m.color }} />
                      <span className="min-w-0 flex-1">
                        <b className="axis block truncate text-[22px] [font-variation-settings:'wdth'_90,'wght'_650]">{s.title}</b>
                        <span className="text-sm text-ink-soft">{m.label}</span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        <b className="axis text-2xl">{s.viewerCount.toLocaleString()}</b> <span className="text-ink-soft">watching</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        <aside className="auth-rise mx-auto w-full max-w-[760px] [animation-delay:.14s] lg:sticky lg:top-4 lg:mx-0 lg:w-[420px] lg:max-w-none lg:flex-none">
          <Chat streamId={stream.id} userId={userId || "0"} />
        </aside>
      </div>

      {editing && <EditChannelDialog stream={stream} saving={saving} onSave={saveEdit} onClose={closeEdit} />}
    </div>
  );
}
