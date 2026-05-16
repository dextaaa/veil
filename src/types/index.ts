export type Gender = "MALE" | "FEMALE";

export interface Photo {
  id: string;
  url: string;
  order: number;
}

export interface PromptAnswer {
  id: string;
  prompt: string;
  answer: string;
  order: number;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: Gender;
  bio: string;
  location: string | null;
  photos: Photo[];
  prompts: PromptAnswer[];
  interests: string[];
  lookingFor: Gender;
  minAge: number;
  maxAge: number;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: string;
  otherProfile?: Profile;
  lastMessage?: Message | null;
  unreadCount?: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export type SwipeState = "bio" | "revealing" | "revealed" | "confirmed";
