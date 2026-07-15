import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStreams, createStream, updateStreamStatus } from "../api/streams";
import type { StreamResponse } from "../types/stream";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [streams, setStreams] = useState<StreamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getStreams()
      .then(setStreams)
      .catch(() => setError("Failed to load streams"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const stream = await createStream({ title, description: description || undefined });
      setStreams((prev) => [stream, ...prev]);
      setShowCreate(false);
      setTitle("");
      setDescription("");
    } catch {
      setError("Failed to create stream");
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (stream: StreamResponse) => {
    try {
      const newStatus = stream.status === "LIVE" ? "OFFLINE" : "LIVE";
      const updated = await updateStreamStatus(stream.id, newStatus);
      setStreams((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      setError("Failed to update stream status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">IRL Streaming</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Start Stream
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
            <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <form onSubmit={handleCreate} className="bg-zinc-900 rounded-xl p-6 w-full max-w-md mx-4 border border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">Create a stream</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My awesome stream"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                    Description <span className="text-zinc-500">(optional)</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="What's this stream about?"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creating ? "Creating..." : "Go live"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-zinc-500 text-lg">No streams yet</p>
              <p className="text-zinc-600 mt-1">Click "Start Stream" to go live</p>
            </div>
          ) : (
            streams.map((stream) => (
              <Link
                key={stream.id}
                to={`/stream/${stream.id}`}
                className="block rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                  {stream.status === "LIVE" ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-400 text-sm font-medium">LIVE</span>
                    </div>
                  ) : (
                    <span className="text-zinc-600 text-sm">Offline</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate">{stream.title}</h3>
                  {stream.description && (
                    <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{stream.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-zinc-500">
                      {stream.viewerCount} viewer{stream.viewerCount !== 1 ? "s" : ""}
                    </span>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleStatus(stream);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        stream.status === "LIVE"
                          ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                      }`}
                    >
                      {stream.status === "LIVE" ? "Stop" : "Start"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
