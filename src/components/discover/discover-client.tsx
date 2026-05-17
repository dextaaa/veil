"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwipeCard from "./swipe-card";
import type { Profile } from "@/types";
import { Sparkles, Moon, Coins } from "lucide-react";
import Link from "next/link";

interface DiscoverClientProps {
  userId: string;
}

export default function DiscoverClient({ userId }: DiscoverClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  // Token state
  const [tokens, setTokens] = useState(0);
  const [revealedUserIds, setRevealedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch("/api/discover").then((r) => r.json()),
      fetch("/api/tokens").then((r) => r.json()),
    ]).then(([discoverData, tokenData]) => {
      setProfiles(discoverData.profiles || []);
      setTokens(tokenData.tokens ?? 0);
      setRevealedUserIds(new Set(tokenData.revealedUserIds ?? []));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSwipe = (liked: boolean, matchProfile?: Profile, rateLimited?: boolean) => {
    if (rateLimited) {
      setLimitReached(true);
      return;
    }
    if (liked && matchProfile) {
      setMatchedProfile(matchProfile);
    }
    setCurrentIndex((i) => i + 1);
  };

  const handleReveal = useCallback(async (targetUserId: string): Promise<boolean> => {
    const res = await fetch("/api/tokens/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    });
    const data = await res.json();
    if (!res.ok) return false;
    setTokens(data.tokens);
    setRevealedUserIds((prev) => new Set([...prev, targetUserId]));
    return true;
  }, []);

  const currentProfile = profiles[currentIndex];
  const hasMore = currentIndex < profiles.length;
  const remaining = profiles.length - currentIndex;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-4 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <h1
          className="text-2xl font-bold text-gradient"
          style={{ fontFamily: "var(--font-display)" }}
        >
          veil
        </h1>
        <div className="flex items-center gap-3">
          {/* Token balance */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: tokens > 0 ? "rgba(209,42,94,0.10)" : "rgba(255,255,255,0.04)",
              border: tokens > 0 ? "1px solid rgba(209,42,94,0.25)" : "1px solid rgba(255,255,255,0.08)",
              color: tokens > 0 ? "#f27098" : "#555577",
            }}
          >
            <span style={{ fontSize: "11px" }}>⬡</span>
            {tokens} tokens
          </div>
          {hasMore && (
            <div className="flex items-center gap-1.5 text-xs text-[#444466]">
              <Sparkles size={12} className="text-[#d12a5e]" />
              {remaining} left
            </div>
          )}
        </div>
      </div>

      {/* Hint bar */}
      <div
        className="px-5 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p className="text-[11px] text-[#444466] text-center">
          Photos unlock on match · or spend 5 tokens to peek early
        </p>
      </div>

      {/* Main area */}
      <div className="flex-1 flex items-start justify-center px-4 pt-4">
        {loading ? (
          <LoadingState />
        ) : limitReached ? (
          <LimitState />
        ) : !hasMore || profiles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full max-w-sm">
            <AnimatePresence mode="popLayout">
              {currentProfile && (
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  tokens={tokens}
                  isRevealed={revealedUserIds.has(currentProfile.userId)}
                  onReveal={handleReveal}
                  onSwipe={handleSwipe}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Match reveal modal */}
      <AnimatePresence>
        {matchedProfile && (
          <MatchRevealModal
            profile={matchedProfile}
            onClose={() => setMatchedProfile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-12 h-12 rounded-full"
        style={{ background: "linear-gradient(135deg, #d12a5e, #9b4fd4)" }}
      />
      <p className="text-[#8888aa] text-sm">Finding people…</p>
    </div>
  );
}

function LimitState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: "rgba(209,42,94,0.08)", border: "1px solid rgba(209,42,94,0.15)" }}
      >
        <Moon size={32} className="text-[#d12a5e]" />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
        That&apos;s your limit for today
      </h3>
      <p className="text-sm text-[#8888aa] max-w-xs mx-auto leading-relaxed mb-6">
        Slow down, think about what you read today. Come back tomorrow.
      </p>
      <Link href="/matches" className="btn-primary h-11 px-6 text-sm">
        See my matches
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: "rgba(209,42,94,0.08)", border: "1px solid rgba(209,42,94,0.15)" }}
      >
        <Sparkles size={32} className="text-[#d12a5e]" />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
        You&apos;ve seen everyone
      </h3>
      <p className="text-sm text-[#8888aa] max-w-xs mx-auto leading-relaxed mb-6">
        Check back soon as new people join. Your matches are waiting.
      </p>
      <Link href="/matches" className="btn-primary h-11 px-6 text-sm">
        View my matches
      </Link>
    </motion.div>
  );
}

function MatchRevealModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);

  const photo = profile.photos[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)" }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl overflow-hidden max-w-sm w-full relative"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(209,42,94,0.25)",
          boxShadow: "0 0 80px rgba(209,42,94,0.18)",
        }}
      >
        {photo && (
          <div className="relative h-72 overflow-hidden">
            <img src={photo} alt={profile.name} className="w-full h-full object-cover" />
            <motion.div
              className="absolute inset-0"
              animate={
                revealed
                  ? { backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", opacity: 0 }
                  : { backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", opacity: 1 }
              }
              transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                background: "rgba(7,7,12,0.5)",
              }}
            />
            <AnimatePresence>
              {!revealed && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-4xl"
                  >
                    ✨
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, var(--surface))" }}
            />
          </div>
        )}

        <div className="p-6 text-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="text-xs font-semibold tracking-widest text-[#d12a5e] uppercase mb-2">
              It&apos;s a match
            </p>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
              You and {profile.name}
            </h2>
            <p className="text-sm text-[#8888aa] mb-6 leading-relaxed">
              You liked each other&apos;s personality.
              {revealed ? " Now you can see each other." : ""}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-2xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#8888aa",
                }}
              >
                Keep swiping
              </button>
              <Link
                href="/matches"
                className="flex-1 h-11 rounded-2xl text-sm font-semibold flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #d12a5e, #9b4fd4)", color: "white" }}
                onClick={onClose}
              >
                Say hello →
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
