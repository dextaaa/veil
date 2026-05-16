"use client";

import { create } from "zustand";
import type { Profile, Match, Message } from "@/types";

interface AppStore {
  currentProfileIndex: number;
  profiles: Profile[];
  matches: Match[];
  messages: Record<string, Message[]>;
  setProfiles: (profiles: Profile[]) => void;
  nextProfile: () => void;
  setMatches: (matches: Match[]) => void;
  addMessage: (matchId: string, message: Message) => void;
  setMessages: (matchId: string, messages: Message[]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentProfileIndex: 0,
  profiles: [],
  matches: [],
  messages: {},

  setProfiles: (profiles) => set({ profiles, currentProfileIndex: 0 }),

  nextProfile: () =>
    set((state) => ({
      currentProfileIndex: Math.min(
        state.currentProfileIndex + 1,
        state.profiles.length
      ),
    })),

  setMatches: (matches) => set({ matches }),

  addMessage: (matchId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [matchId]: [...(state.messages[matchId] || []), message],
      },
    })),

  setMessages: (matchId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [matchId]: messages },
    })),
}));
