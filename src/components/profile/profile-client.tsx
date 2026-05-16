"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { MapPin, Edit2, LogOut, Eye, Camera } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types";

interface ProfileClientProps {
  profile: Profile;
  email: string;
}

export default function ProfileClient({ profile, email }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);
  const [saving, setSaving] = useState(false);

  const saveBio = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Profile
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 text-sm text-[#8888aa] hover:text-[#ef4444] transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      <div className="px-5 space-y-4">
        {/* Profile card preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Photo */}
          <div className="relative h-48">
            {profile.photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photos[0].url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1a1a2e, #2d1b4e)" }}
              >
                <Camera size={28} className="text-[#444466]" />
              </div>
            )}
            <div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{ background: "linear-gradient(to bottom, transparent, var(--surface))" }}
            />
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{profile.name}</span>
                  <span className="text-[#8888aa]">{profile.age}</span>
                </div>
                {profile.location && (
                  <div className="flex items-center gap-1 text-xs text-[#8888aa] mt-0.5">
                    <MapPin size={10} />
                    {profile.location}
                  </div>
                )}
              </div>
              <span className="text-xs text-[#444466]">{email}</span>
            </div>

            {/* Bio — editable */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#8888aa] uppercase tracking-wider">
                  Bio
                </span>
                <button
                  onClick={() => (isEditing ? saveBio() : setIsEditing(true))}
                  disabled={saving}
                  className="flex items-center gap-1 text-xs text-[#d12a5e] hover:underline transition-colors"
                >
                  <Edit2 size={10} />
                  {isEditing ? (saving ? "Saving…" : "Save") : "Edit"}
                </button>
              </div>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  className="input-field resize-none text-sm"
                  rows={5}
                  autoFocus
                />
              ) : (
                <p className="text-sm text-[#ccccdd] leading-relaxed">{bio}</p>
              )}
            </div>

            {/* Prompts */}
            {profile.prompts.map((p) => (
              <div
                key={p.id}
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

            {/* Interests */}
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.interests.map((interest) => (
                  <span key={interest} className="tag">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* How others see your profile */}
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "rgba(209,42,94,0.06)",
            border: "1px solid rgba(209,42,94,0.12)",
          }}
        >
          <Eye size={18} className="text-[#d12a5e] flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Others see your bio first</p>
            <p className="text-xs text-[#8888aa]">
              Your photos stay hidden until someone likes your personality.
            </p>
          </div>
        </div>

        {/* Photo count */}
        <div className="card p-4">
          <p className="text-sm font-medium text-white mb-2">
            Photos ({profile.photos.length})
          </p>
          {profile.photos.length === 0 ? (
            <p className="text-xs text-[#8888aa]">No photos added yet.</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {profile.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
