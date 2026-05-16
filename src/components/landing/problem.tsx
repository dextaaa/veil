"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "57%", label: "of users feel exhausted by photo-first swiping within 3 months" },
  { value: "3s", label: "average time spent on a profile before swiping — less than a blink" },
  { value: "1 in 4", label: "people say they've matched with someone they later had zero in common with" },
];

const problems = [
  {
    emoji: "👁️",
    title: "Appearance became the entire selection system",
    body: "Modern apps optimized for engagement metrics, not compatibility. The result: you're choosing a life partner the same way you'd pick a thumbnail.",
  },
  {
    emoji: "😶‍🌫️",
    title: "Shallow matches create emotional debt",
    body: "When attraction is purely visual, conversations collapse fast. You're not tired of dating — you're tired of starting from nothing every time.",
  },
  {
    emoji: "🔁",
    title: "The loop is designed to keep you swiping, not finding",
    body: "Every swipe keeps you engaged with the platform. Apps profit from your loneliness, not from your connection. That's a conflict of interest.",
  },
];

export default function Problem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why" ref={ref} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">The problem</span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Dating apps weren't built for{" "}
            <span className="text-gradient">you.</span>
          </h2>
          <p className="text-lg text-[#8888aa] max-w-2xl mx-auto">
            They were built for engagement. There's a difference.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="card p-6 text-center"
            >
              <div
                className="text-4xl font-bold mb-2 text-gradient"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </div>
              <p className="text-sm text-[#8888aa] leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Problems */}
        <div className="space-y-4">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="card p-6 flex gap-5 items-start"
            >
              <span className="text-3xl flex-shrink-0">{p.emoji}</span>
              <div>
                <h3 className="font-semibold text-white mb-1.5">{p.title}</h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
