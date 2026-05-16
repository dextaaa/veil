"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section ref={ref} className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center relative"
      >
        <div
          className="absolute inset-0 rounded-4xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(209,42,94,0.1) 0%, transparent 70%)",
          }}
        />

        <span className="tag mb-6 inline-block">The invitation</span>

        <h2
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Stop swiping on faces.
          <br />
          <span className="text-gradient">Start meeting people.</span>
        </h2>

        <p className="text-lg text-[#8888aa] mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of people who got tired of shallow apps and decided to
          try the alternative.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/signup" className="btn-primary h-14 px-10 text-lg">
            Create your profile
            <ArrowRight size={18} />
          </Link>
        </div>

        <p className="text-xs text-[#444466]">
          Free to join. No credit card required. No dark patterns.
        </p>

        {/* Waitlist */}
        <div
          className="mt-16 rounded-2xl p-6"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h3 className="font-semibold text-white mb-1">
            Not ready? Join the waitlist.
          </h3>
          <p className="text-sm text-[#8888aa] mb-4">
            Get early access when we expand to your city.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 text-[#22c55e] text-sm font-medium"
            >
              <Check size={16} />
              You&apos;re on the list!
            </motion.div>
          ) : (
            <form
              onSubmit={handleWaitlist}
              className="flex gap-2 max-w-sm mx-auto"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field flex-1"
                required
              />
              <button
                type="submit"
                className="btn-primary h-11 px-5 text-sm flex-shrink-0"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
