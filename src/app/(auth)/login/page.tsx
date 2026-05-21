"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) throw new Error("Invalid email or password");

      const res = await fetch("/api/profiles/me");
      const data = await res.json();

      if (data.profile) {
        window.location.href = "/discover";
      } else {
        window.location.href = "/onboarding";
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: "alex@demo.com",
        password: "password123",
        redirect: false,
      });
      if (result?.error) throw new Error("Demo login failed — run db:seed first");
      window.location.href = "/discover";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome back
        </h1>
        <p className="text-[#8888aa] text-sm">Sign in to continue your story</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#aaaacc] mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#aaaacc] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444466] hover:text-[#8888aa] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full h-12"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="relative my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
        <span className="text-xs text-[#444466]">or</span>
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
      </div>

      <button
        onClick={handleDemo}
        disabled={loading}
        className="btn-ghost w-full h-11 text-sm"
      >
        Sign in as demo user (alex@demo.com)
      </button>

      <p className="text-center text-sm text-[#8888aa] mt-6">
        No account?{" "}
        <Link href="/signup" className="text-[#d12a5e] hover:underline font-medium">
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
