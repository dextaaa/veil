"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(209,42,94,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(155,79,212,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(209, 42, 94, 0.1)",
              border: "1px solid rgba(209, 42, 94, 0.25)",
              color: "#f27098",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#d12a5e] animate-pulse" />
            Now in early access
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Looks made dating{" "}
          <span
            className="relative inline-block"
            style={{
              color: "#888",
              textDecoration: "line-through",
              textDecorationColor: "rgba(209,42,94,0.7)",
            }}
          >
            shallow.
          </span>
          <br />
          <span className="text-gradient">We changed the order.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl text-[#8888aa] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          On Veil, you swipe on{" "}
          <span className="text-white font-medium">who someone is</span> before
          you see what they look like. Photos unlock only after you feel
          something.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/signup" className="btn-primary h-12 px-8 text-base">
            Start for free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="btn-ghost h-12 px-8 text-base"
          >
            I have an account
          </Link>
        </motion.div>

        {/* Visual demo card */}
        <motion.div
          variants={fadeUp}
          className="relative max-w-sm mx-auto"
        >
          <MockProfileCard />
        </motion.div>
      </motion.div>
    </section>
  );
}

function MockProfileCard() {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="relative rounded-3xl overflow-hidden text-left"
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Blurred photo placeholder */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a2a3e 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <EyeOff size={32} className="text-[#444466]" />
            <span className="text-xs text-[#444466] font-medium">
              Photo hidden
            </span>
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--surface))",
          }}
        />
      </div>

      {/* Bio content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-white text-lg">Maya, 25</span>
            <span className="text-[#8888aa] text-sm ml-2">Brooklyn, NY</span>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Eye size={18} className="text-[#d12a5e]" />
          </motion.div>
        </div>

        <p className="text-sm text-[#ccccdd] leading-relaxed mb-4">
          Documentary filmmaker who thinks everyone has a story worth telling. I
          ask too many questions and apologize for it too little.
        </p>

        <div
          className="rounded-xl p-3 mb-4"
          style={{
            background: "rgba(209, 42, 94, 0.06)",
            border: "1px solid rgba(209, 42, 94, 0.12)",
          }}
        >
          <p className="text-xs text-[#d12a5e] font-medium mb-1">
            My most controversial opinion…
          </p>
          <p className="text-sm text-[#ccccdd]">
            Jazz is objectively the most emotionally intelligent genre of music.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {["film", "photography", "jazz"].map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 h-11 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8888aa",
            }}
          >
            Pass
          </button>
          <button
            className="flex-1 h-11 rounded-xl text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #d12a5e, #9b4fd4)",
              boxShadow: "0 0 20px rgba(209,42,94,0.3)",
              color: "white",
            }}
          >
            Like ✨
          </button>
        </div>
      </div>
    </motion.div>
  );
}
