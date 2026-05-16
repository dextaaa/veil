import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import ChatClient from "@/components/chat/chat-client";

interface PageProps {
  params: { id: string };
}

function parseInterests(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default async function MessagePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const match = await prisma.match.findFirst({
    where: {
      id: params.id,
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
    include: {
      userA: { include: { profile: { include: { photos: { orderBy: { order: "asc" } } } } } },
      userB: { include: { profile: { include: { photos: { orderBy: { order: "asc" } } } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!match) notFound();

  const isA = match.userAId === session.user.id;
  const otherUser = isA ? match.userB : match.userA;
  const p = otherUser.profile;

  return (
    <ChatClient
      matchId={match.id}
      currentUserId={session.user.id}
      otherProfile={
        p
          ? {
              id: p.id,
              userId: otherUser.id,
              name: p.name,
              age: p.age,
              gender: p.gender as any,
              bio: p.bio,
              location: p.location,
              photos: p.photos.map((ph) => ({ id: ph.id, url: ph.url, order: ph.order })),
              prompts: [],
              interests: parseInterests(p.interests),
              lookingFor: p.lookingFor as any,
              minAge: p.minAge,
              maxAge: p.maxAge,
            }
          : null
      }
      initialMessages={match.messages.map((m) => ({
        id: m.id,
        matchId: m.matchId,
        senderId: m.senderId,
        content: m.content,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
