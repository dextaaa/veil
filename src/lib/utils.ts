import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const PROMPTS = [
  "A hill I'll die on…",
  "My most controversial opinion…",
  "A perfect Sunday looks like…",
  "Something I'll never shut up about…",
  "The way to my heart is…",
  "I'm weirdly passionate about…",
  "Green flag I look for…",
  "My love language is…",
  "A non-negotiable for me…",
  "I get irrationally excited about…",
  "The best decision I ever made…",
  "What most people don't know about me…",
];
