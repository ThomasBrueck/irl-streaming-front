import { useEffect, useRef, useState } from "react";
import { Room, type RemoteParticipant } from "livekit-client";
import { getLiveKitUrl, createLiveKitToken } from "../lib/livekit";

interface LiveKitPlayerProps {
  roomName: string;
  identity: string;
}

export default function LiveKitPlayer({ roomName, identity }: LiveKitPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [broadcasterName, setBroadcasterName] = useState("");

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const token = await createLiveKitToken(identity, roomName, false);
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        room.on("participantConnected", (p: RemoteParticipant) => {
          if (cancelled) return;
          setBroadcasterName(p.identity || "Broadcaster");

          p.trackPublications.forEach((pub) => {
            if (pub.kind === "video" && pub.track && videoRef.current) {
              pub.track.attach(videoRef.current);
            }
          });
        });

        room.on("trackSubscribed", (track) => {
          if (cancelled) return;
          if (track.kind === "video" && videoRef.current) {
            track.attach(videoRef.current);
          }
        });

        await room.connect(getLiveKitUrl(), token);
        roomRef.current = room;
        if (!cancelled) setConnected(true);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to connect");
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

  if (!connected) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-zinc-950 to-purple-600/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          </div>
          <p className="text-zinc-400 text-sm">Stream is live</p>
          <p className="text-zinc-600 text-xs mt-1">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      {broadcasterName && (
        <div className="absolute bottom-3 left-3 bg-zinc-900/80 text-zinc-200 text-xs px-2.5 py-1 rounded-md">
          {broadcasterName}
        </div>
      )}
    </>
  );
}
