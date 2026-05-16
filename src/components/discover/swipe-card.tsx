"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  PanInfo,
} from "framer-motion";
import { X, Heart, EyeOff, Eye, MapPin, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types";

interface SwipeCardProps {
  profile: Profile;
  tokens: number;
  isRevealed: boolean;
  onReveal: (targetUserId: string) => Promise<boolean>;
  onSwipe: (liked: boolean, matchProfile?: Profile, rateLimited?: boolean) => void;
}

export default function SwipeCard({
  profile,
  tokens,
  isRevealed,
  onReveal,
  onSwipe,
}: SwipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reveal modal states
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [localRevealed, setLocalRevealed] = useState(isRevealed);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);
  const cardOpacity = useTransform(x, [-150, 0, 150], [0.6, 1, 0.6]);

  const recordSwipe = async (liked: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swipedUserId: profile.userId, liked }),
      });
      const data = await res.json();
      if (res.status === 429) {
        onSwipe(false, undefined, true);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      onSwipe(liked, data.match ? profile : undefined);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) recordSwipe(true);
    else if (info.offset.x < -100) recordSwipe(false);
  };

  const handleRevealClick = () => {
    if (localRevealed) return;
    if (tokens >= 5) {
      setShowRevealConfirm(true);
    } else {
      setShowBuyTokens(true);
    }
  };

  const confirmReveal = async () => {
    setRevealing(true);
    const ok = await onReveal(profile.userId);
    setRevealing(false);
    setShowRevealConfirm(false);
    if (ok) {
      setLocalRevealed(true);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <motion.div
        exit={{ opacity: 0, scale: 0.85, y: -20, transition: { duration: 0.2 } }}
        className="relative select-none"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, opacity: cardOpacity }}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Drag indicators */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-5 left-5 z-20 pointer-events-none"
          >
            <div
              className="px-4 py-2 rounded-xl border-2 font-bold text-base rotate-[-12deg]"
              style={{ borderColor: "#22c55e", color: "#22c55e", background: "rgba(34,197,94,0.08)" }}
            >
              LIKE ♥
            </div>
          </motion.div>
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-5 right-5 z-20 pointer-events-none"
          >
            <div
              className="px-4 py-2 rounded-xl border-2 font-bold text-base rotate-[12deg]"
              style={{ borderColor: "#ef4444", color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
            >
              PASS ✕
            </div>
          </motion.div>

          {/* Card */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <PhotoArea
              profile={profile}
              revealed={localRevealed}
              tokens={tokens}
              onRevealClick={handleRevealClick}
            />

            {/* Bio content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {profile.name}
                    </span>
                    <span className="text-[#8888aa] text-base">{profile.age}</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-1 text-xs text-[#8888aa] mt-0.5">
                      <MapPin size={10} />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>

              <p
                className={`text-sm text-[#ccccdd] leading-relaxed mb-4 ${
                  expanded ? "" : "line-clamp-4"
                }`}
              >
                {profile.bio}
              </p>

              {profile.bio.length > 220 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-xs text-[#8888aa] mb-4 hover:text-white transition-colors"
                >
                  {expanded ? (
                    <><ChevronUp size={12} /> Show less</>
                  ) : (
                    <><ChevronDown size={12} /> Read more</>
                  )}
                </button>
              )}

              {profile.prompts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl p-3.5 mb-3"
                  style={{
                    background: "rgba(209,42,94,0.06)",
                    border: "1px solid rgba(209,42,94,0.12)",
                  }}
                >
                  <p className="text-[11px] font-semibold text-[#d12a5e] mb-1.5 uppercase tracking-wide">
                    {p.prompt}
                  </p>
                  <p className="text-sm text-[#ccccdd] leading-relaxed">{p.answer}</p>
                </div>
              ))}

              {profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="tag">{interest}</span>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => recordSwipe(false)}
                  disabled={submitting}
                  className="flex-1 h-13 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    background: "rgba(239,68,68,0.07)",
                    border: "1px solid rgba(239,68,68,0.18)",
                    color: "#f87171",
                    height: "52px",
                  }}
                >
                  <X size={18} />
                  Pass
                </button>
                <button
                  onClick={() => recordSwipe(true)}
                  disabled={submitting}
                  className="flex-1 h-13 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    flex: 2,
                    background: "linear-gradient(135deg, #d12a5e, #9b4fd4)",
                    boxShadow: "0 0 24px rgba(209,42,94,0.28)",
                    color: "white",
                    height: "52px",
                  }}
                >
                  <Heart size={18} />
                  Like
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Reveal confirm modal */}
      <AnimatePresence>
        {showRevealConfirm && (
          <RevealConfirmModal
            profile={profile}
            tokens={tokens}
            revealing={revealing}
            onConfirm={confirmReveal}
            onCancel={() => setShowRevealConfirm(false)}
          />
        )}
      </AnimatePresence>

      {/* Buy tokens modal */}
      <AnimatePresence>
        {showBuyTokens && (
          <BuyTokensModal
            tokens={tokens}
            onClose={() => setShowBuyTokens(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Photo area ───────────────────────────────────────────────────────────────

function PhotoArea({
  profile,
  revealed,
  tokens,
  onRevealClick,
}: {
  profile: Profile;
  revealed: boolean;
  tokens: number;
  onRevealClick: () => void;
}) {
  return (
    <div className="relative h-56 overflow-hidden">
      {profile.photos.length > 0 ? (
        <motion.img
          src={profile.photos[0].url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          animate={
            revealed
              ? { filter: "blur(0px) brightness(1) saturate(1)", scale: 1 }
              : { filter: "blur(28px) brightness(0.25) saturate(1.4)", scale: 1.15 }
          }
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #1a1a2e, #2d1b4e)" }}
        />
      )}

      {/* Overlay — hidden once revealed */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(8px)",
              }}
            >
              <EyeOff size={22} className="text-white opacity-80" />
            </div>

            {/* Reveal button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRevealClick();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{
                background: tokens >= 5
                  ? "linear-gradient(135deg, #d12a5e, #9b4fd4)"
                  : "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                border: tokens >= 5 ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: "white",
                boxShadow: tokens >= 5 ? "0 0 16px rgba(209,42,94,0.35)" : "none",
              }}
            >
              <Eye size={13} />
              {tokens >= 5 ? "Reveal photo · 5 tokens" : "Reveal photo"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Photo revealed" badge once unlocked */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3"
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold"
              style={{
                background: "rgba(7,7,12,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                color: "#aaaacc",
              }}
            >
              <Eye size={10} />
              Early reveal
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--surface))" }}
      />
    </div>
  );
}

// ─── Reveal confirm modal ─────────────────────────────────────────────────────

function RevealConfirmModal({
  profile,
  tokens,
  revealing,
  onConfirm,
  onCancel,
}: {
  profile: Profile;
  tokens: number;
  revealing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-24"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d12a5e22, #9b4fd422)", border: "1px solid rgba(209,42,94,0.2)" }}
          >
            <Eye size={24} className="text-[#d12a5e]" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white text-center mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Reveal {profile.name}&apos;s photo?
        </h3>
        <p className="text-sm text-[#8888aa] text-center mb-5 leading-relaxed">
          This costs <span className="text-white font-semibold">5 tokens</span>. You have{" "}
          <span className="text-[#f27098] font-semibold">{tokens} tokens</span> remaining.
        </p>

        {/* Token display */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl mb-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-sm text-[#8888aa]">After reveal</span>
          <span className="text-sm font-semibold text-white">{tokens - 5} tokens left</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-2xl text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8888aa",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={revealing}
            className="flex-1 h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #d12a5e, #9b4fd4)",
              color: "white",
            }}
          >
            {revealing ? <Loader2 size={16} className="animate-spin" /> : <>Spend 5 tokens</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Buy tokens modal ─────────────────────────────────────────────────────────

function BuyTokensModal({
  tokens,
  onClose,
}: {
  tokens: number;
  onClose: () => void;
}) {
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout");
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message);
      setPurchasing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-24"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -8px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header gradient band */}
        <div
          className="px-6 pt-6 pb-5 text-center"
          style={{ background: "linear-gradient(180deg, rgba(209,42,94,0.12) 0%, transparent 100%)" }}
        >
          <div className="text-3xl mb-2">⬡</div>
          <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Out of tokens
          </h3>
          <p className="text-sm text-[#8888aa] leading-relaxed">
            You have <span className="text-white font-semibold">{tokens} token{tokens !== 1 ? "s" : ""}</span> left.
            You need 5 to reveal a photo early.
          </p>
        </div>

        <div className="px-6 pb-6">
          {/* Package card */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(209,42,94,0.08), rgba(155,79,212,0.08))",
              border: "1px solid rgba(209,42,94,0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-bold text-lg">300 tokens</p>
                <p className="text-[#8888aa] text-xs mt-0.5">60 photo reveals</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">$20</p>
                <p className="text-[#8888aa] text-xs">one-time</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8888aa]">
              <span className="text-[#d12a5e]">✓</span> Never expires
              <span className="mx-2 opacity-30">·</span>
              <span className="text-[#d12a5e]">✓</span> 5 tokens per reveal
              <span className="mx-2 opacity-30">·</span>
              <span className="text-[#d12a5e]">✓</span> Match still free
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full h-13 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 mb-3"
            style={{
              background: "linear-gradient(135deg, #d12a5e, #9b4fd4)",
              boxShadow: "0 0 24px rgba(209,42,94,0.3)",
              color: "white",
              height: "52px",
            }}
          >
            {purchasing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>Buy 300 tokens · $20</>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-sm text-[#555577] py-2"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
