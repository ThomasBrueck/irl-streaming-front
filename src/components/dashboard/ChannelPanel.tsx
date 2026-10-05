import { useState } from "react";
import { Link } from "react-router-dom";
import type { StreamResponse } from "../../types/stream";
import { CATEGORIES, type StreamCategory } from "../../lib/categories";

export interface ChannelValues {
  title: string;
  description: string;
  category: StreamCategory;
}

interface ChannelPanelProps {
  /** Your channel, or null if you have not set one up yet. */
  channel: StreamResponse | null;
  busy: boolean;
  onCreate: (values: ChannelValues) => void;
  onGoLive: (values: ChannelValues) => void;
  onEnd: () => void;
}

const field =
  "block w-full min-h-[52px] rounded-[14px] bg-white px-4 text-base shadow-[inset_0_0_0_2px_#0c0a14] transition-shadow duration-200 placeholder:text-ink-faint focus:outline-none focus:shadow-[inset_0_0_0_3px_#5b2fe0]";

/** Everything about your own channel in one place: set it up, go live, end. */
export default function ChannelPanel({ channel, busy, onCreate, onGoLive, onEnd }: ChannelPanelProps) {
  const [title, setTitle] = useState(channel?.title ?? "");
  const [description, setDescription] = useState(channel?.description ?? "");
  const [category, setCategory] = useState<StreamCategory>(channel?.category ?? "JUST_CHATTING");
  const isLive = channel?.status === "LIVE";
  const values: ChannelValues = { title: title.trim(), description: description.trim(), category };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title || busy) return;
    if (channel) onGoLive(values);
    else onCreate(values);
  };

  return (
    <div className="rounded-[28px] bg-white p-2 shadow-[0_0_0_2px_#0c0a14,0_28px_50px_-30px_rgba(12,10,20,.5)]">
      <div className="rounded-[20px] bg-paper p-6">
        <h2 className="axis mb-[18px] text-[30px] uppercase">Your channel</h2>

        {isLive && channel ? (
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-tally-text">
              <i className="size-[9px] rounded-full bg-tally [animation:landing-blink_1.4s_steps(2,start)_infinite]" />
              You are on air
            </span>
            <div className="axis my-3.5 text-[96px] tabular-nums">{channel.viewerCount.toLocaleString()}</div>
            <div className="mb-1.5 text-ink-soft">people watching right now</div>
            <div className="mb-[22px] font-bold">{channel.title}</div>
            <div className="flex flex-col gap-3">
              <Link
                to={`/stream/${channel.id}`}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-ink bg-ink px-[26px] text-[17px] font-bold text-paper transition-[scale,background-color] duration-200 hover:bg-[#2a2540] active:scale-[.96]"
              >
                Open my channel
              </Link>
              <button
                type="button"
                disabled={busy}
                onClick={onEnd}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-ink px-[26px] text-[17px] font-bold transition-[scale,background-color,color] duration-200 hover:bg-ink hover:text-paper active:scale-[.96] disabled:cursor-wait disabled:opacity-60"
              >
                End stream
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            {channel && <p className="mb-4 text-ink-soft">You are offline. Change the details if you like, then go live.</p>}
            <label htmlFor="channel-title" className="mb-2 block text-[15px] font-bold">
              {channel ? "Title for this stream" : "Title"}
            </label>
            <input
              id="channel-title"
              className={field}
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you streaming?"
            />
            {!channel && (
              <>
                <label htmlFor="channel-description" className="mb-2 mt-4 block text-[15px] font-bold">
                  Description (optional)
                </label>
                <textarea
                  id="channel-description"
                  className={`${field} min-h-[88px] resize-none py-3`}
                  maxLength={500}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people what to expect"
                />
              </>
            )}
            <div className="mb-2 mt-4 text-[15px] font-bold">Category</div>
            <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={category === c.value}
                  onClick={() => setCategory(c.value)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[15px] font-bold shadow-[inset_0_0_0_2px_#0c0a14] transition-[scale,background-color,color] duration-200 active:scale-[.96] ${
                    category === c.value ? "bg-ink text-paper" : "hover:bg-white"
                  }`}
                >
                  <i className="size-2.5 rounded-full shadow-[inset_0_0_0_2px_#0c0a14]" style={{ background: c.color }} />
                  {c.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={busy || !values.title}
              className={`mt-[22px] inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full border-2 px-[26px] text-[17px] font-bold transition-[scale,background-color] duration-200 active:scale-[.96] disabled:cursor-not-allowed disabled:opacity-50 ${
                channel ? "border-tally-text bg-tally-text text-white hover:bg-[#a8162f]" : "border-ink bg-ink text-paper hover:bg-[#2a2540]"
              }`}
            >
              {busy && <span className="size-[18px] rounded-full border-[3px] border-white/30 border-t-white [animation:auth-spin_.7s_linear_infinite]" />}
              {channel ? "Go live" : "Set up your channel"}
            </button>
            {channel && (
              <Link to={`/stream/${channel.id}`} className="mt-3 block text-center font-medium text-ink-soft underline decoration-2 underline-offset-4 hover:text-ink">
                Open my channel without going live
              </Link>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
