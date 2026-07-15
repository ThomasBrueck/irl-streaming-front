import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStreamById, updateStreamStatus } from "../api/streams";
import type { StreamResponse } from "../types/stream";
import StreamVideo from "../components/StreamVideo";
import Chat from "../components/Chat";

export default function StreamView() {
  const { id } = useParams<{ id: string }>();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = token
    ? (() => { try { return JSON.parse(atob(token.split(".")[1])).sub as string; } catch { return ""; } })()
    : "";

  const username = token
    ? (() => { try { return JSON.parse(atob(token.split(".")[1])).username as string; } catch { return ""; } })()
    : "";

  const isOwner = stream ? String(stream.userId) === userId : false;

  useEffect(() => {
    if (!id) return;
    getStreamById(Number(id))
      .then(setStream)
      .catch(() => setError("Stream not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStatus = async () => {
    if (!stream) return;
    try {
      const newStatus = stream.status === "LIVE" ? "OFFLINE" : "LIVE";
      const updated = await updateStreamStatus(stream.id, newStatus);
      setStream(updated);
    } catch {
      setError("Failed to update stream status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading stream...</p>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">{error || "Stream not found"}</p>
          <Link to="/dashboard" className="text-blue-400 text-sm mt-3 inline-block hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
            &larr; Dashboard
          </Link>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StreamVideo
              stream={stream}
              isOwner={isOwner}
              userId={userId || "0"}
              username={username || "anonymous"}
              onToggleStatus={toggleStatus}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="h-full" style={{ minHeight: "500px" }}>
              <Chat
                streamId={stream.id}
                userId={userId || "0"}
                username={username || "anonymous"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
