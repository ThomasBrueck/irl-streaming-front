import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import { getLiveKitToken } from "../api/streams";
import { screenButton } from "./watch/screenButton";

interface LiveKitPlayerProps {
  streamId: number;
  displayName: string;
  hostName: string;
  muted: boolean;
}

/** Plays a live stream for a viewer: the host's picture and sound. */
export default function LiveKitPlayer({ streamId, displayName, hostName, muted }: LiveKitPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roomRef = useRef<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (cancelled) return;
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
        setHasVideo(true);
      } else if (track.kind === Track.Kind.Audio && audioRef.current) {
        track.attach(audioRef.current);
      }
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      if (cancelled) return;
      track.detach();
      if (track.kind === Track.Kind.Video) setHasVideo(false);
    });
    room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      if (!cancelled) setSoundBlocked(!room.canPlaybackAudio);
    });
    room.on(RoomEvent.Disconnected, () => {
      if (!cancelled) setConnected(false);
    });

    getLiveKitToken(streamId, displayName)
      .then(async ({ token, url }) => {
        // Don't join the room if this effect was already cleaned up (a second
        // connection with the same identity would kick the live one out).
        if (cancelled) return;
        await room.connect(url, token);
      })
      .then(() => {
        if (cancelled) return;
        setConnected(true);
        setSoundBlocked(!room.canPlaybackAudio);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't connect");
      });

    return () => {
      cancelled = true;
      room.removeAllListeners();
      room.disconnect();
      roomRef.current = null;
    };
  }, [streamId, displayName, attempt]);

  const enableSound = () => {
    roomRef.current?.startAudio().then(() => setSoundBlocked(false), () => undefined);
  };

  if (error) {
    return (
      <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 bg-ink p-6 text-center text-paper">
        <p className="max-w-sm text-lg">We couldn't connect to the stream. Check your connection and try again.</p>
        <button
          type="button"
          onClick={() => {
            setError("");
            setAttempt((n) => n + 1);
          }}
          className="inline-flex min-h-12 items-center rounded-full border-2 border-paper px-6 font-bold transition-[scale,background-color,color] duration-200 hover:bg-paper hover:text-ink active:scale-[.96]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <video ref={videoRef} autoPlay playsInline className={`absolute inset-0 size-full bg-ink object-contain ${hasVideo ? "" : "invisible"}`} />
      <audio ref={audioRef} autoPlay muted={muted} />

      {!connected && (
        <div className="absolute inset-0 grid place-items-center bg-ink">
          <span className="size-9 rounded-full border-4 border-[#2f2850] border-t-[#b9a4ff] [animation:auth-spin_.8s_linear_infinite]" />
        </div>
      )}

      {connected && !hasVideo && (
        <div className="absolute inset-0 grid place-content-center gap-2 p-6 text-center text-paper">
          <div className="axis text-[clamp(28px,4vw,56px)] uppercase">Almost there</div>
          <p className="text-lg text-[#c9c6dc]">Waiting for {hostName} to turn on the camera.</p>
        </div>
      )}

      {connected && soundBlocked && !muted && (
        <button
          type="button"
          onClick={enableSound}
          className={`${screenButton} absolute bottom-4 left-4 w-auto px-5 text-[15px] font-bold`}
        >
          Turn on sound
        </button>
      )}
    </>
  );
}
