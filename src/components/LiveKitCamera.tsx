import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import { getLiveKitToken } from "../api/streams";
import Icon from "./ui/Icon";
import { screenButton } from "./watch/screenButton";

interface LiveKitCameraProps {
  streamId: number;
  displayName: string;
}

/** Publishes the owner's camera and microphone and shows their own preview. */
export default function LiveKitCamera({ streamId, displayName }: LiveKitCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    const attachPreview = () => {
      const pub = room.localParticipant.getTrackPublication(Track.Source.Camera);
      if (pub?.track && videoRef.current) pub.track.attach(videoRef.current);
    };
    room.on(RoomEvent.LocalTrackPublished, attachPreview);

    (async () => {
      try {
        // The backend verifies ownership and only grants publish rights to the
        // actual channel owner. The client never sees a raw media secret.
        const { token, url } = await getLiveKitToken(streamId, displayName);
        // Don't join the room if this effect was already cleaned up (a second
        // connection with the same identity would kick the live one out).
        if (cancelled) return;
        await room.connect(url, token);
        if (cancelled) return;
        await room.localParticipant.setCameraEnabled(true);
        await room.localParticipant.setMicrophoneEnabled(true);
        if (cancelled) return;
        attachPreview();
        setConnected(true);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't start your camera");
      }
    })();

    return () => {
      cancelled = true;
      room.removeAllListeners();
      room.disconnect();
      roomRef.current = null;
    };
  }, [streamId, displayName, attempt]);

  const toggleMic = async () => {
    const next = !micOn;
    await roomRef.current?.localParticipant.setMicrophoneEnabled(next);
    setMicOn(next);
  };

  const toggleCam = async () => {
    const next = !camOn;
    await roomRef.current?.localParticipant.setCameraEnabled(next);
    setCamOn(next);
  };

  if (error) {
    return (
      <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 bg-ink p-6 text-center text-paper">
        <p className="max-w-sm text-lg">We couldn't start your camera. Allow camera and microphone access in your browser, then try again.</p>
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
      <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 size-full bg-ink object-contain [transform:scaleX(-1)] ${connected && camOn ? "" : "invisible"}`} />

      {!connected && (
        <div className="absolute inset-0 grid place-items-center bg-ink">
          <span className="size-9 rounded-full border-4 border-[#2f2850] border-t-[#b9a4ff] [animation:auth-spin_.8s_linear_infinite]" />
        </div>
      )}

      {connected && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            type="button"
            onClick={toggleMic}
            aria-pressed={!micOn}
            aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
            className={`${screenButton} ${micOn ? "" : "!bg-tally-text !text-white !border-tally-text"}`}
          >
            <Icon name={micOn ? "mic" : "mic-off"} size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={toggleCam}
            aria-pressed={!camOn}
            aria-label={camOn ? "Turn camera off" : "Turn camera on"}
            className={`${screenButton} ${camOn ? "" : "!bg-tally-text !text-white !border-tally-text"}`}
          >
            <Icon name="camera" size={20} strokeWidth={2} />
          </button>
        </div>
      )}
    </>
  );
}
