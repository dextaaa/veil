"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Heart, Eye, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Write your story",
    body: "Build a profile around your personality — a bio, prompts, interests. This is who you are, not what you look like. Photos are uploaded but hidden.",
    accent: "#d12a5e",
  },
  {
    icon: Heart,
    step: "02",
    title: "Swipe on substance",
    body: "You see bios, prompts, and interests. Photos are blurred. You're deciding based on how someone thinks, writes, and what they care about.",
    accent: "#b44fd4",
  },
  {
    icon: Eye,
    step: "03",
    title: "The reveal",
    body: "When you like someone's personality, their photos gradually unveil. There's a deliberate pause here — this moment of reveal is the whole point.",
    accent: "#7b63e8",
  },
  {
    icon: MessageCircle,
    step: "04",
    title: "Connect for real",
    body: "When both people like each other's bio and confirm after the reveal, it's a match. Now talk. You already have something real to start with.",
    accent: "#3b9ed4",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" ref={ref} className="py-24 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(155,79,212,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">How it works</span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The same goal.{" "}
            <span className="text-gradient">A different order.</span>
          </h2>
          <p className="text-lg text-[#8888aa] max-w-xl mx-auto">
            We didn't reinvent dating. We just put the emotional part first.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
              className="card p-6 relative overflow-hidden group hover:border-[rgba(255,255,255,0.12)] transition-colors"
            >
              <div
                className="absolute top-0 left-0 w-full h-0.5"
                style={{
                  background: `linear-gradient(90deg, ${step.accent}, transparent)`,
                }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${step.accent}18`, border: `1px solid ${step.accent}30` }}
                >
                  <step.icon size={18} style={{ color: step.accent }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold tracking-wider"
                      style={{ color: step.accent, opacity: 0.7 }}
                    >
                      STEP {step.step}
                    </span>
                  </div>
                  <h3
                    className="font-semibold text-white text-lg mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#8888aa] leading-relaxed">{step.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Reveal highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 rounded-3xl p-8 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(209,42,94,0.08) 0%, rgba(155,79,212,0.08) 100%)",
            border: "1px solid rgba(209,42,94,0.15)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(209,42,94,0.06) 0%, transparent 70%)",
            }}
          />
          <h3
            className="text-2xl font-bold mb-3 text-gradient relative z-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Reveal™ is the experience.
          </h3>
          <p className="text-[#aaaacc] max-w-xl mx-auto text-sm leading-relaxed relative z-10">
            When you click Like, photos don't just appear — they gradually come
            into focus. It's designed to feel like a real moment. A beat of
            anticipation. Because you've already invested something before you
            see anything.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
