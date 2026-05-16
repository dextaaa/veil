"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(7, 7, 12, 0.7)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-gradient">veil</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-sm text-[#8888aa] hover:text-white transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#why"
            className="text-sm text-[#8888aa] hover:text-white transition-colors"
          >
            Why Veil
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[#8888aa] hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm h-9 px-5"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
