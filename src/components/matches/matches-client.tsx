"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Heart } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { Match } from "@/types";

interface MatchesClientProps {
  matches: Match[];
  currentUserId: string;
}

export default function MatchesClient({ matches, currentUserId }: MatchesClientProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Matches
        </h1>
        <p className="text-sm text-[#8888aa]">
          {matches.length} connection{matches.length !== 1 ? "s" : ""} made on
          personality
        </p>
      </div>

      {matches.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="px-4 space-y-3 pb-8">
          {/* New matches (no messages yet) */}
          {matches.filter((m) => !m.lastMessage).length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-[#8888aa] uppercase tracking-wider mb-3 px-1">
                New matches
              </p>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {matches
                  .filter((m) => !m.lastMessage)
                  .map((match, i) => (
                    <NewMatchBubble key={match.id} match={match} index={i} />
                  ))}
              </div>
            </div>
          )}

          {/* Conversations */}
          {matches.filter((m) => m.lastMessage).length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#8888aa] uppercase tracking-wider mb-3 px-1">
                Conversations
              </p>
              <div className="space-y-2">
                {matches
                  .filter((m) => m.lastMessage)
                  .map((match, i) => (
                    <ConversationRow
                      key={match.id}
                      match={match}
                      index={i}
                      currentUserId={currentUserId}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewMatchBubble({ match, index }: { match: Match; index: number }) {
  const profile = match.otherProfile;
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        href={`/messages/${match.id}`}
        className="flex flex-col items-center gap-2 w-20 flex-shrink-0"
      >
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #d12a5e, #9b4fd4)",
              border: "2px solid rgba(209,42,94,0.4)",
            }}
          >
            {profile.photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photos[0].url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {profile.name[0]}
              </div>
            )}
          </div>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d12a5e, #9b4fd4)" }}
          >
            <Heart size={10} fill="white" className="text-white" />
          </div>
        </div>
        <span className="text-xs text-[#ccccdd] font-medium truncate w-full text-center">
          {profile.name}
        </span>
      </Link>
    </motion.div>
  );
}

function ConversationRow({
  match,
  index,
  currentUserId,
}: {
  match: Match;
  index: number;
  currentUserId: string;
}) {
  const profile = match.otherProfile;
  if (!profile || !match.lastMessage) return null;

  const isMyMessage = match.lastMessage.senderId === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        href={`/messages/${match.id}`}
        className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-[rgba(255,255,255,0.03)] active:scale-[0.99]"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #d12a5e, #9b4fd4)" }}
        >
          {profile.photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photos[0].url}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              {profile.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold text-white text-sm">{profile.name}</span>
            <span className="text-xs text-[#444466]">
              {formatTimeAgo(match.lastMessage.createdAt)}
            </span>
          </div>
          <p className="text-sm text-[#8888aa] truncate">
            {isMyMessage ? "You: " : ""}
            {match.lastMessage.content}
          </p>
        </div>

        <MessageCircle size={16} className="text-[#444466] flex-shrink-0" />
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{
          background: "rgba(209,42,94,0.08)",
          border: "1px solid rgba(209,42,94,0.15)",
        }}
      >
        <Heart size={32} className="text-[#d12a5e]" />
      </div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No matches yet
      </h3>
      <p className="text-sm text-[#8888aa] leading-relaxed max-w-xs">
        When someone likes your personality and you like theirs back, you&apos;ll
        meet here.
      </p>
      <Link href="/discover" className="btn-primary mt-6 h-11 px-6 text-sm">
        Go discover
      </Link>
    </motion.div>
  );
}
