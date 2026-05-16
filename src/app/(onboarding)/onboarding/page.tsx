"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, X, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { PROMPTS } from "@/lib/utils";
import type { Gender } from "@/types";

type Step = "gender" | "basics" | "bio" | "prompts" | "photos" | "preview";

interface FormData {
  gender: Gender | null;
  lookingFor: Gender | null;
  name: string;
  age: string;
  location: string;
  bio: string;
  prompts: { prompt: string; answer: string }[];
  interests: string[];
  photos: string[];
}

const INTEREST_OPTIONS = [
  "hiking", "travel", "cooking", "music", "reading", "film",
  "art", "photography", "yoga", "running", "gaming", "coffee",
  "wine", "dance", "surfing", "cycling", "climbing", "writing",
  "philosophy", "startups", "design", "science", "poetry", "theater",
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const STEPS: Step[] = ["gender", "basics", "bio", "prompts", "photos", "preview"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("gender");
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    gender: null,
    lookingFor: null,
    name: "",
    age: "",
    location: "",
    bio: "",
    prompts: [
      { prompt: PROMPTS[0], answer: "" },
      { prompt: PROMPTS[2], answer: "" },
    ],
    interests: [],
    photos: [""],
  });

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setDirection(1);
      setStep(STEPS[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setDirection(-1);
      setStep(STEPS[prevIndex]);
    }
  };

  const canAdvance = () => {
    switch (step) {
      case "gender":
        return form.gender && form.lookingFor;
      case "basics":
        return form.name.trim() && Number(form.age) >= 18 && Number(form.age) <= 80;
      case "bio":
        return form.bio.trim().length >= 50;
      case "prompts":
        return form.prompts.some((p) => p.answer.trim().length > 10);
      case "photos":
        return form.photos.some((p) => p.trim().length > 0);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          photos: form.photos.filter((p) => p.trim()),
          prompts: form.prompts.filter((p) => p.answer.trim()),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create profile");
      }

      router.push("/discover");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goBack}
          disabled={stepIndex === 0}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-0"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <span
          className="text-xl font-bold text-gradient"
          style={{ fontFamily: "var(--font-display)" }}
        >
          veil
        </span>
        <span className="text-xs text-[#444466]">
          {stepIndex + 1} of {STEPS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #d12a5e, #9b4fd4)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {step === "gender" && (
              <GenderStep form={form} setForm={setForm} />
            )}
            {step === "basics" && (
              <BasicsStep form={form} setForm={setForm} />
            )}
            {step === "bio" && (
              <BioStep form={form} setForm={setForm} />
            )}
            {step === "prompts" && (
              <PromptsStep form={form} setForm={setForm} />
            )}
            {step === "photos" && (
              <PhotosStep form={form} setForm={setForm} />
            )}
            {step === "preview" && (
              <PreviewStep form={form} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {step === "preview" ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full h-12"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Start meeting people
                <ArrowRight size={16} />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!canAdvance()}
            className="btn-primary w-full h-12 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function GenderStep({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  return (
    <div>
      <h2
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        First things first
      </h2>
      <p className="text-[#8888aa] text-sm mb-5">
        We keep this simple. Two options only.
      </p>

      {/* Warning */}
      <div
        className="rounded-xl p-4 mb-8"
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
        }}
      >
        <p className="text-sm font-bold text-[#f87171] leading-snug">
          Be honest. Select your actual biological sex.
        </p>
        <p className="text-xs text-[#f87171] opacity-80 mt-1 leading-relaxed">
          Users who select the sex opposite to their actual sex will be permanently banned.
        </p>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-[#aaaacc] mb-3">I am</p>
        <div className="grid grid-cols-2 gap-3">
          {(["MALE", "FEMALE"] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => setForm({ ...form, gender: g })}
              className="h-14 rounded-xl font-medium text-sm transition-all"
              style={{
                background: form.gender === g
                  ? "linear-gradient(135deg, #d12a5e, #9b4fd4)"
                  : "rgba(255,255,255,0.04)",
                border: form.gender === g
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.08)",
                color: form.gender === g ? "white" : "#8888aa",
                boxShadow: form.gender === g ? "0 0 20px rgba(209,42,94,0.2)" : "none",
              }}
            >
              {g === "MALE" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[#aaaacc] mb-3">I&apos;m looking for a</p>
        <div className="grid grid-cols-2 gap-3">
          {(["MALE", "FEMALE"] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => setForm({ ...form, lookingFor: g })}
              className="h-14 rounded-xl font-medium text-sm transition-all"
              style={{
                background: form.lookingFor === g
                  ? "linear-gradient(135deg, #d12a5e, #9b4fd4)"
                  : "rgba(255,255,255,0.04)",
                border: form.lookingFor === g
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.08)",
                color: form.lookingFor === g ? "white" : "#8888aa",
                boxShadow: form.lookingFor === g ? "0 0 20px rgba(209,42,94,0.2)" : "none",
              }}
            >
              {g === "MALE" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BasicsStep({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const [newInterest, setNewInterest] = useState("");

  const toggleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : f.interests.length < 8
        ? [...f.interests, interest]
        : f.interests,
    }));
  };

  return (
    <div className="overflow-y-auto h-full no-scrollbar pb-4">
      <h2
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        The basics
      </h2>
      <p className="text-[#8888aa] text-sm mb-6">
        What should people know about you at a glance?
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#aaaacc] mb-1.5">
            Name
          </label>
          <input
            type="text"
            placeholder="What people call you"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#aaaacc] mb-1.5">
              Age
            </label>
            <input
              type="number"
              placeholder="Your age"
              min="18"
              max="80"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#aaaacc] mb-1.5">
              City
            </label>
            <input
              type="text"
              placeholder="Where you are"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#aaaacc] mb-1.5">
            Interests{" "}
            <span className="text-[#444466] font-normal">
              (pick up to 8)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className="tag cursor-pointer transition-all"
                style={
                  form.interests.includes(interest)
                    ? {
                        background: "rgba(209,42,94,0.12)",
                        border: "1px solid rgba(209,42,94,0.3)",
                        color: "#f27098",
                      }
                    : {}
                }
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BioStep({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const charCount = form.bio.length;
  const minChars = 50;
  const maxChars = 500;

  return (
    <div>
      <h2
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Your story
      </h2>
      <p className="text-[#8888aa] text-sm mb-6">
        This is the first thing people read. Make it honest, specific, and you.
        This is your only first impression here.
      </p>

      <div className="relative">
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, maxChars) })}
          placeholder="Write like you'd introduce yourself to someone interesting at a dinner party. Not on a resume. You can be honest about what you're looking for, what you're figuring out, or what makes you weird in a good way."
          className="input-field resize-none"
          rows={8}
          style={{ lineHeight: "1.6" }}
        />
        <div
          className={`absolute bottom-3 right-3 text-xs ${
            charCount < minChars ? "text-[#ef4444]" : "text-[#444466]"
          }`}
        >
          {charCount < minChars
            ? `${minChars - charCount} more to go`
            : `${charCount} / ${maxChars}`}
        </div>
      </div>

      {charCount < minChars && charCount > 0 && (
        <p className="text-xs text-[#ef4444] mt-2">
          Give people more to work with — at least {minChars} characters.
        </p>
      )}
    </div>
  );
}

function PromptsStep({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const updatePrompt = (index: number, key: "prompt" | "answer", value: string) => {
    setForm((f) => ({
      ...f,
      prompts: f.prompts.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    }));
  };

  const addPrompt = () => {
    if (form.prompts.length < 4) {
      setForm((f) => ({
        ...f,
        prompts: [...f.prompts, { prompt: PROMPTS[f.prompts.length], answer: "" }],
      }));
    }
  };

  return (
    <div className="overflow-y-auto h-full no-scrollbar pb-4">
      <h2
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Tell your story
      </h2>
      <p className="text-[#8888aa] text-sm mb-6">
        Prompts let people see how you think. Answer honestly. The weirder, the
        better.
      </p>

      <div className="space-y-5">
        {form.prompts.map((p, i) => (
          <div key={i} className="card p-4">
            <select
              value={p.prompt}
              onChange={(e) => updatePrompt(i, "prompt", e.target.value)}
              className="w-full text-xs font-medium mb-3 bg-transparent text-[#d12a5e] outline-none cursor-pointer"
            >
              {PROMPTS.map((prompt) => (
                <option
                  key={prompt}
                  value={prompt}
                  style={{ background: "#16162a", color: "#f0f0f8" }}
                >
                  {prompt}
                </option>
              ))}
            </select>
            <textarea
              value={p.answer}
              onChange={(e) => updatePrompt(i, "answer", e.target.value.slice(0, 300))}
              placeholder="Your honest answer..."
              rows={3}
              className="w-full bg-transparent text-sm text-[#ccccdd] outline-none resize-none placeholder:text-[#444466]"
              style={{ lineHeight: "1.6" }}
            />
          </div>
        ))}

        {form.prompts.length < 4 && (
          <button
            onClick={addPrompt}
            className="btn-ghost w-full h-11 text-sm"
          >
            <Plus size={16} />
            Add another prompt
          </button>
        )}
      </div>
    </div>
  );
}

function PhotosStep({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const updatePhoto = (index: number, url: string) => {
    setForm((f) => ({
      ...f,
      photos: f.photos.map((p, i) => (i === index ? url : p)),
    }));
  };

  const addPhotoSlot = () => {
    if (form.photos.length < 6) {
      setForm((f) => ({ ...f, photos: [...f.photos, ""] }));
    }
  };

  const removePhoto = (index: number) => {
    setForm((f) => ({
      ...f,
      photos: f.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="overflow-y-auto h-full no-scrollbar pb-4">
      <h2
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Add your photos
      </h2>
      <p className="text-[#8888aa] text-sm mb-2">
        These stay hidden until someone likes your bio. Paste image URLs for now
        — Supabase file upload coming soon.
      </p>
      <p className="text-xs text-[#444466] mb-6">
        Tip: Use unsplash.com, upload somewhere, or use your social profile photo URL.
      </p>

      <div className="space-y-3">
        {form.photos.map((photo, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div
              className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden"
              style={{
                background: photo ? "transparent" : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={18} className="text-[#444466]" />
                </div>
              )}
            </div>
            <input
              type="url"
              placeholder={`Photo ${i + 1} URL`}
              value={photo}
              onChange={(e) => updatePhoto(i, e.target.value)}
              className="input-field flex-1"
            />
            {form.photos.length > 1 && (
              <button
                onClick={() => removePhoto(i)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#444466] hover:text-[#ef4444] transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {form.photos.length < 6 && (
          <button onClick={addPhotoSlot} className="btn-ghost w-full h-11 text-sm">
            <Plus size={16} />
            Add photo
          </button>
        )}
      </div>
    </div>
  );
}

function PreviewStep({ form }: { form: FormData }) {
  return (
    <div className="overflow-y-auto h-full no-scrollbar pb-4">
      <h2
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Looking good.
      </h2>
      <p className="text-[#8888aa] text-sm mb-6">
        Here&apos;s what others will see first — before your photos.
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Photo preview — blurred */}
        <div
          className="h-32 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1a1a2e, #2d1b4e)",
          }}
        >
          <div className="text-center">
            <Camera size={24} className="text-[#444466] mx-auto mb-1" />
            <p className="text-xs text-[#444466]">
              {form.photos.filter((p) => p).length} photo
              {form.photos.filter((p) => p).length !== 1 ? "s" : ""} hidden until liked
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-semibold text-xl text-white">{form.name || "Your name"}</span>
            <span className="text-[#8888aa]">{form.age || "??"}</span>
            {form.location && (
              <span className="text-[#8888aa] text-sm">{form.location}</span>
            )}
          </div>

          <p className="text-sm text-[#ccccdd] leading-relaxed mb-4">
            {form.bio || "Your bio will appear here."}
          </p>

          {form.prompts
            .filter((p) => p.answer.trim())
            .map((p, i) => (
              <div
                key={i}
                className="rounded-xl p-3 mb-3"
                style={{
                  background: "rgba(209,42,94,0.06)",
                  border: "1px solid rgba(209,42,94,0.12)",
                }}
              >
                <p className="text-xs text-[#d12a5e] font-medium mb-1">{p.prompt}</p>
                <p className="text-sm text-[#ccccdd]">{p.answer}</p>
              </div>
            ))}

          {form.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.interests.map((interest) => (
                <span key={interest} className="tag">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
