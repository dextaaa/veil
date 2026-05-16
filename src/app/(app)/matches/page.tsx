import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MatchesClient from "@/components/matches/matches-client";
import type { Match } from "@/types";

function parseInterests(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default async function MatchesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const rawMatches = await prisma.match.findMany({
    where: { OR: [{ userAId: session.user.id }, { userBId: session.user.id }] },
    include: {
      userA: { include: { profile: { include: { photos: { orderBy: { order: "asc" } }, prompts: true } } } },
      userB: { include: { profile: { include: { photos: { orderBy: { order: "asc" } }, prompts: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const matches: Match[] = rawMatches.map((m) => {
    const isA = m.userAId === session.user.id;
    const otherUser = isA ? m.userB : m.userA;
    const p = otherUser.profile;

    return {
      id: m.id,
      userAId: m.userAId,
      userBId: m.userBId,
      createdAt: m.createdAt.toISOString(),
      otherProfile: p
        ? {
            id: p.id,
            userId: otherUser.id,
            name: p.name,
            age: p.age,
            gender: p.gender as any,
            bio: p.bio,
            location: p.location,
            photos: p.photos.map((ph) => ({ id: ph.id, url: ph.url, order: ph.order })),
            prompts: p.prompts.map((pr) => ({ id: pr.id, prompt: pr.prompt, answer: pr.answer, order: pr.order })),
            interests: parseInterests(p.interests),
            lookingFor: p.lookingFor as any,
            minAge: p.minAge,
            maxAge: p.maxAge,
          }
        : undefined,
      lastMessage: m.messages[0]
        ? {
            id: m.messages[0].id,
            matchId: m.id,
            senderId: m.messages[0].senderId,
            content: m.messages[0].content,
            read: m.messages[0].read,
            createdAt: m.messages[0].createdAt.toISOString(),
          }
        : null,
    };
  });

  return <MatchesClient matches={matches} currentUserId={session.user.id} />;
}
