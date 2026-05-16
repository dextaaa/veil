"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Message, Profile } from "@/types";

interface ChatClientProps {
  matchId: string;
  currentUserId: string;
  otherProfile: Profile | null;
  initialMessages: Message[];
}

export default function ChatClient({
  matchId,
  currentUserId,
  otherProfile,
  initialMessages,
}: ChatClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 4s
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages/${matchId}`);
        const data = await res.json();
        if (data.messages && data.messages.length > messages.length) {
          setMessages(data.messages);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(poll);
  }, [matchId, messages.length]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);

    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      matchId,
      senderId: currentUserId,
      content: text,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`/api/messages/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? data.message : m))
      );
    } catch (err: any) {
      toast.error(err.message);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const name = otherProfile?.name ?? "Match";
  const photo = otherProfile?.photos[0]?.url;

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 64px)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 pt-12 flex-shrink-0"
        style={{
          background: "rgba(7,7,12,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(255,255,255,0.06)]"
        >
          <ArrowLeft size={18} className="text-[#8888aa]" />
        </button>

        <div
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #d12a5e, #9b4fd4)" }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
              {name[0]}
            </div>
          )}
        </div>

        <div>
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className="text-xs text-[#8888aa]">Matched on personality ✨</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-8"
          >
            <div className="text-4xl mb-3">👋</div>
            <p className="font-medium text-white mb-1">
              You matched with {name}
            </p>
            <p className="text-sm text-[#8888aa] max-w-xs leading-relaxed">
              You connected because of who they are, not how they look. That&apos;s
              already something. Say hi.
            </p>
          </motion.div>
        )}

        <div className="space-y-2 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((message, i) => {
              const isMe = message.senderId === currentUserId;
              const prevMsg = messages[i - 1];
              const showAvatar = !isMe && (
                !prevMsg || prevMsg.senderId !== message.senderId
              );

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div
                      className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mb-0.5"
                      style={{
                        background: showAvatar
                          ? "linear-gradient(135deg, #d12a5e, #9b4fd4)"
                          : "transparent",
                      }}
                    >
                      {showAvatar && photo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div
                    className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={
                      isMe
                        ? {
                            background: "linear-gradient(135deg, #d12a5e, #9b4fd4)",
                            color: "white",
                            borderBottomRightRadius: "6px",
                          }
                        : {
                            background: "var(--surface-raised)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "#ccccdd",
                            borderBottomLeftRadius: "6px",
                          }
                    }
                  >
                    {message.content}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 pb-6 flex-shrink-0 safe-bottom"
        style={{
          background: "rgba(7,7,12,0.85)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <form onSubmit={sendMessage} className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something real…"
            className="input-field flex-1"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #d12a5e, #9b4fd4)"
                : "rgba(255,255,255,0.04)",
              border: input.trim() ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <Send
                size={16}
                className={input.trim() ? "text-white" : "text-[#444466]"}
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
