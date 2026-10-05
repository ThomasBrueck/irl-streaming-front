import { useState, useEffect, useRef, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { getChatHistory, type ChatMessageDto } from "../api/chat";
import { hashString } from "../lib/identity";
import { useReducedMotion } from "../hooks/useReducedMotion";
import Icon from "./ui/Icon";

interface ChatProps {
  streamId: number;
  userId: string;
  username: string;
}

const MAX_LENGTH = 300;
const QUICK_REACTIONS = ["🔥", "😂", "❤️", "👏", "🎉"];
// Readable on white.
const NAME_COLORS = ["#5b2fe0", "#c81e3a", "#0f766e", "#b45309", "#1d4ed8", "#9d174d"];

export default function Chat({ streamId, userId, username }: ChatProps) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [showReactions, setShowReactions] = useState(false);

  const clientRef = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Mirrors `pinnedToBottom` for the socket callback below, which is set up once
  // and would otherwise close over a stale value.
  const pinnedRef = useRef(true);

  useEffect(() => {
    let cancelled = false;
    getChatHistory(streamId)
      .then((history) => {
        if (!cancelled) setMessages(history);
      })
      .catch(() => {
        /* history is a nice-to-have, chat still works live without it */
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [streamId]);

  useEffect(() => {
    pinnedRef.current = pinnedToBottom;
  }, [pinnedToBottom]);

  useEffect(() => {
    const scheme = window.location.protocol === "https:" ? "wss" : "ws";
    const client = new Client({
      brokerURL: `${scheme}://${window.location.host}/ws/chat`,
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/stream/${streamId}`, (msg: IMessage) => {
          const parsed: ChatMessageDto = JSON.parse(msg.body);
          setMessages((prev) => [...prev, parsed]);
          if (!pinnedRef.current) setNewCount((n) => n + 1);
        });
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      void client.deactivate();
      clientRef.current = null;
    };
  }, [streamId]);

  const scrollToEnd = useCallback(
    (smooth: boolean) => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduced ? "smooth" : "auto" });
    },
    [reduced]
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setPinnedToBottom(nearBottom);
    if (nearBottom) setNewCount(0);
  }, []);

  useEffect(() => {
    if (pinnedToBottom) scrollToEnd(true);
  }, [messages, pinnedToBottom, loadingHistory, scrollToEnd]);

  const jumpToEnd = () => {
    scrollToEnd(true);
    setPinnedToBottom(true);
    setNewCount(0);
  };

  const publish = (content: string) => {
    if (!content.trim() || !clientRef.current?.connected) return;
    const message: ChatMessageDto = {
      streamId: String(streamId),
      userId,
      username,
      content: content.trim().slice(0, MAX_LENGTH),
    };
    clientRef.current.publish({ destination: `/app/chat/${streamId}`, body: JSON.stringify(message) });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !input.trim()) return;
    publish(input);
    setInput("");
    setPinnedToBottom(true);
  };

  return (
    <div className="flex h-[min(78vh,760px)] min-h-[520px] flex-col rounded-[28px] bg-white p-2 shadow-[0_0_0_2px_#0c0a14,0_28px_50px_-30px_rgba(12,10,20,.5)]">
      <div className="flex items-center justify-between px-3.5 pb-2.5 pt-3">
        <h2 className="axis text-[28px] uppercase">Chat</h2>
        <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft">
          <i className={`size-[9px] rounded-full ${connected ? "bg-[#0f9d6e]" : "bg-tally"}`} />
          {connected ? "Connected" : "Reconnecting"}
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          className="h-full overflow-y-auto overscroll-contain px-1.5 pb-2.5"
        >
          {loadingHistory && (
            <div className="flex justify-center py-6">
              <span className="size-5 rounded-full border-2 border-ink-line border-t-ink [animation:auth-spin_.8s_linear_infinite]" />
            </div>
          )}

          {!loadingHistory && messages.length === 0 && (
            <p className="px-2.5 py-4 text-ink-soft">No messages yet. Say hello!</p>
          )}

          {messages.map((msg, i) => {
            const mine = msg.userId === userId;
            return (
              <p
                key={`${msg.createdAt ?? ""}-${i}`}
                className={`rounded-[14px] px-2.5 py-1.5 leading-[1.4] [overflow-wrap:anywhere] hover:bg-paper ${mine ? "bg-paper shadow-[inset_0_0_0_2px_#0c0a14]" : ""}`}
              >
                <b className="mr-1.5" style={{ color: mine ? "#0c0a14" : NAME_COLORS[hashString(msg.username) % NAME_COLORS.length] }}>
                  {msg.username}
                </b>
                {msg.content}
              </p>
            );
          })}
        </div>

        {!pinnedToBottom && newCount > 0 && (
          <button
            type="button"
            onClick={jumpToEnd}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-ink px-4 py-1.5 text-sm font-bold text-paper shadow-lg transition-[scale] duration-200 active:scale-[.96]"
          >
            {newCount} new {newCount === 1 ? "message" : "messages"}
          </button>
        )}
      </div>

      <form onSubmit={sendMessage} className="relative flex gap-2 pt-2">
        {showReactions && (
          <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-full bg-white p-1.5 shadow-[inset_0_0_0_2px_#0c0a14,0_16px_30px_-18px_rgba(12,10,20,.5)]">
            {QUICK_REACTIONS.map((r) => (
              <button
                key={r}
                type="button"
                disabled={!connected}
                aria-label={`Send ${r}`}
                onClick={() => {
                  publish(r);
                  setShowReactions(false);
                }}
                className="grid size-11 place-items-center rounded-full text-xl transition-[scale,background-color] duration-150 hover:bg-paper active:scale-90 disabled:opacity-40"
              >
                {r}
              </button>
            ))}
          </div>
        )}
        <label htmlFor="chat-input" className="sr-only">
          Write a message
        </label>
        <input
          id="chat-input"
          value={input}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something"
          className="min-h-[52px] min-w-0 flex-1 rounded-full bg-white px-[18px] text-base shadow-[inset_0_0_0_2px_#0c0a14] transition-shadow duration-200 placeholder:text-ink-faint focus:outline-none focus:shadow-[inset_0_0_0_3px_#5b2fe0]"
        />
        <button
          type="button"
          onClick={() => setShowReactions((v) => !v)}
          aria-label="Reactions"
          aria-expanded={showReactions}
          className="grid size-[52px] shrink-0 place-items-center rounded-full border-2 border-ink transition-[scale,background-color] duration-200 hover:bg-paper active:scale-[.94]"
        >
          <Icon name="star" size={22} strokeWidth={2} />
        </button>
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          aria-label="Send message"
          className="grid size-[52px] shrink-0 place-items-center rounded-full border-2 border-ink bg-ink text-paper transition-[scale,opacity] duration-200 active:scale-[.94] disabled:opacity-40"
        >
          <Icon name="send" size={22} strokeWidth={2.2} />
        </button>
      </form>
    </div>
  );
}
