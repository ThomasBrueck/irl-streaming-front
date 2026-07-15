import { useState } from "react";
import type { StreamResponse } from "../types/stream";
import LiveKitCamera from "./LiveKitCamera";
import LiveKitPlayer from "./LiveKitPlayer";

interface StreamVideoProps {
  stream: StreamResponse;
  isOwner: boolean;
  userId: string;
  username: string;
  viewerId: string;
  cameraId: string;
  onToggleStatus: () => void;
}

export default function StreamVideo({ stream, isOwner, userId: _userId, username: _username, viewerId, cameraId, onToggleStatus }: StreamVideoProps) {
  const [useLiveKit, setUseLiveKit] = useState(isOwner && stream.status === "LIVE");

  const isLive = stream.status === "LIVE";
  const roomName = `stream_${stream.id}`;

  const handleGoLive = () => {
    setUseLiveKit(true);
    onToggleStatus();
  };

  const handleStop = () => {
    setUseLiveKit(false);
    onToggleStatus();
  };

  return (
    <div className="relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
      {/* video area */}
      <div className="aspect-video bg-zinc-950 relative overflow-hidden">
        {isOwner && useLiveKit ? (
          <LiveKitCamera
            roomName={roomName}
            identity={cameraId}
          />
        ) : !isOwner && isLive ? (
          <LiveKitPlayer
            roomName={roomName}
            identity={viewerId}
          />
        ) : isLive ? (
          /* owner stopped camera but stream is marked live */
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-zinc-950 to-purple-600/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              </div>
              <p className="text-zinc-400 text-sm">Stream is live</p>
              <p className="text-zinc-600 text-xs mt-1">Camera not broadcasting</p>
            </div>
          </div>
        ) : (
          /* offline */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm">Stream offline</p>
            </div>
          </div>
        )}

        {/* live badge */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        )}

        {/* viewer count */}
        {isLive && (
          <div className="absolute top-3 right-3 bg-zinc-900/80 text-zinc-300 text-xs px-2.5 py-1 rounded-md">
            {stream.viewerCount} viewer{stream.viewerCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* stream info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-white truncate">{stream.title}</h2>
            {stream.description && (
              <p className="text-zinc-400 text-sm mt-1">{stream.description}</p>
            )}
          </div>
          {isOwner && (
            <button
              onClick={useLiveKit ? handleStop : handleGoLive}
              className={`shrink-0 px-5 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
                useLiveKit
                  ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                  : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
              }`}
            >
              {useLiveKit ? "End stream" : "Go live"}
            </button>
          )}
        </div>

        {useLiveKit && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Broadcasting via LiveKit
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
