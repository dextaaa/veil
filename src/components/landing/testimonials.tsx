"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote:
      "I actually read her whole bio before I even thought about what she looked like. When the photos revealed... I was already into her. That never happens on other apps.",
    name: "Marcus, 28",
    detail: "Met his girlfriend after 3 weeks on Veil",
  },
  {
    quote:
      "The reveal moment is legitimately one of the most exciting things I've experienced on a dating app. You feel like you earned it.",
    name: "Sophie, 26",
    detail: "Early access user",
  },
  {
    quote:
      "I stopped dreading dating apps. The conversations on Veil are different from the first message — we already know we have something in common.",
    name: "Dev, 30",
    detail: "Found a long-term relationship",
  },
  {
    quote:
      "I was burned out from Hinge and Tinder. Veil felt like coming up for air. I actually felt human again.",
    name: "Alyssa, 24",
    detail: "4-month Veil user",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="tag mb-4 inline-block">What people say</span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Real{" "}
            <span className="text-gradient">connections.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="card p-6"
            >
              <p className="text-[#ccccdd] leading-relaxed mb-5 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, #d12a5e, #9b4fd4)",
                    color: "white",
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-[#8888aa]">{t.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
