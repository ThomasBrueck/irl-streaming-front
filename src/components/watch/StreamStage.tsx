import { useRef, useState } from "react";
import type { StreamResponse } from "../../types/stream";
import LiveKitCamera from "../LiveKitCamera";
import LiveKitPlayer from "../LiveKitPlayer";
import Icon from "../ui/Icon";
import SignalWave from "./SignalWave";
import { screenButton } from "./screenButton";

interface StreamStageProps {
  stream: StreamResponse;
  isOwner: boolean;
  displayName: string;
  hostName: string;
}

const pill = "absolute top-4 inline-flex min-h-9 items-center rounded-full px-3.5 text-sm font-bold";

/** The video in its studio frame, with the signal line behind it. */
export default function StreamStage({ stream, isOwner, displayName, hostName }: StreamStageProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(false);
  const live = stream.status === "LIVE";

  const toggleFullscreen = () => {
    const el = screenRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <div className="rounded-[28px] bg-white p-2 shadow-[0_0_0_2px_#0c0a14,0_28px_50px_-30px_rgba(12,10,20,.5)]">
      <div ref={screenRef} className="relative aspect-video overflow-hidden rounded-[20px] bg-ink">
        <SignalWave live={live} />

        {live &&
          (isOwner ? (
            <LiveKitCamera streamId={stream.id} displayName={displayName} />
          ) : (
            <LiveKitPlayer streamId={stream.id} displayName={displayName} hostName={hostName} muted={muted} />
          ))}

        {live ? (
          <>
            <span className={`${pill} left-4 gap-2 bg-white text-tally-text`}>
              <i className="size-[9px] rounded-full bg-tally [animation:landing-blink_1.4s_steps(2,start)_infinite]" />
              On air
            </span>
            <span className={`${pill} right-4 bg-paper tabular-nums`}>{stream.viewerCount.toLocaleString()} watching</span>
          </>
        ) : (
          <div className="absolute inset-0 grid place-content-center gap-2.5 p-6 text-center text-paper">
            <div className="axis text-[clamp(36px,5vw,72px)] uppercase">Offline</div>
            <p className="text-lg text-[#c9c6dc]">
              {isOwner ? "You are not streaming right now." : `${hostName} is not streaming right now. The chat is still open.`}
            </p>
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex gap-2">
          {live && !isOwner && (
            <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"} className={screenButton}>
              <Icon name={muted ? "volume-off" : "volume"} size={20} strokeWidth={2} />
            </button>
          )}
          <button type="button" onClick={toggleFullscreen} aria-label="Full screen" className={screenButton}>
            <Icon name="fullscreen" size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
