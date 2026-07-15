import { useEffect, useRef, useState } from "react";
import { Room } from "livekit-client";
import { getLiveKitUrl, createLiveKitToken } from "../lib/livekit";

interface LiveKitCameraProps {
  roomName: string;
  identity: string;
}

export default function LiveKitCamera({ roomName, identity }: LiveKitCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const token = await createLiveKitToken(identity, roomName, true);
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        await room.connect(getLiveKitUrl(), token);
        await room.localParticipant.enableCameraAndMicrophone();

        const pub = room.localParticipant.videoTrackPublications.values().next().value;
        if (pub?.track && videoRef.current) {
          pub.track.attach(videoRef.current);
        }

        roomRef.current = room;
        if (!cancelled) setConnected(true);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to connect to LiveKit");
      }
    };

    start();

    return () => {
      cancelled = true;
      roomRef.current?.disconnect();
    };
  }, [roomName, identity]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />
      {!connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80">
          <p className="text-zinc-400 text-sm">Connecting to LiveKit...</p>
        </div>
      )}
    </>
  );
}
