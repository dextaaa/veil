"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageCircle, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/discover", icon: Sparkles, label: "Discover" },
  { href: "/matches", icon: Heart, label: "Matches" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-50 mt-auto"
      style={{
        background: "rgba(7, 7, 12, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 relative py-2 px-4 flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(209, 42, 94, 0.1)" }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                />
              )}
              <Icon
                size={22}
                className={cn(
                  "transition-colors duration-200 relative z-10",
                  isActive ? "text-[#d12a5e]" : "text-[#444466]"
                )}
                fill={isActive ? "currentColor" : "none"}
              />
              <span
                className={cn(
                  "text-[10px] font-medium relative z-10 transition-colors duration-200",
                  isActive ? "text-[#d12a5e]" : "text-[#444466]"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
