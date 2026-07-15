import { useState, useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";

interface ChatMessage {
  streamId: string;
  userId: string;
  username: string;
  content: string;
}

interface ChatProps {
  streamId: number;
  userId: string;
  username: string;
}

export default function Chat({ streamId, userId, username }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://localhost:5173/ws/chat`,
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/stream/${streamId}`, (msg: IMessage) => {
          const parsed: ChatMessage = JSON.parse(msg.body);
          setMessages((prev) => [...prev, parsed]);
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [streamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !clientRef.current?.connected) return;

    const message: ChatMessage = {
      streamId: String(streamId),
      userId,
      username,
      content: input.trim(),
    };

    clientRef.current.publish({
      destination: `/app/chat/${streamId}`,
      body: JSON.stringify(message),
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-xl border border-zinc-800">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-sm font-medium text-white">Stream chat</span>
        <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5" style={{ maxHeight: "400px" }}>
        {messages.length === 0 && (
          <p className="text-zinc-600 text-sm text-center pt-8">No messages yet</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">
            <span className="font-medium text-zinc-300 mr-2">{msg.username}</span>
            <span className="text-zinc-400">{msg.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <form onSubmit={sendMessage} className="border-t border-zinc-800 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
