import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseInterests(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const myProfile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
    if (!myProfile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

    const swipedIds = await prisma.swipe.findMany({
      where: { swiperId: session.user.id },
      select: { swipedId: true },
    });
    const excludeIds = [session.user.id, ...swipedIds.map((s) => s.swipedId)];

    const profiles = await prisma.profile.findMany({
      where: {
        userId: { notIn: excludeIds },
        gender: myProfile.lookingFor,
        lookingFor: myProfile.gender,
        isActive: true,
      },
      include: {
        photos: { orderBy: { order: "asc" } },
        prompts: { orderBy: { order: "asc" } },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    const serialized = profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      age: p.age,
      gender: p.gender,
      bio: p.bio,
      location: p.location,
      photos: p.photos.map((ph) => ({ id: ph.id, url: ph.url, order: ph.order })),
      prompts: p.prompts.map((pr) => ({ id: pr.id, prompt: pr.prompt, answer: pr.answer, order: pr.order })),
      interests: parseInterests(p.interests),
      lookingFor: p.lookingFor,
      minAge: p.minAge,
      maxAge: p.maxAge,
    }));

    return NextResponse.json({ profiles: serialized });
  } catch (err) {
    console.error("[DISCOVER]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
