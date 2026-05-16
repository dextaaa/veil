import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REVEAL_COST = 5;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  try {
    const { targetUserId } = await req.json();
    if (!targetUserId) return NextResponse.json({ error: "targetUserId required" }, { status: 400 });

    // Already revealed — free re-fetch
    const existing = await prisma.photoReveal.findUnique({
      where: { userId_revealedUserId: { userId, revealedUserId: targetUserId } },
    });
    if (existing) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { tokens: true } });
      return NextResponse.json({ tokens: user?.tokens ?? 0 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { tokens: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.tokens < REVEAL_COST) {
      return NextResponse.json({ error: "Not enough tokens" }, { status: 402 });
    }

    const [updated] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { tokens: { decrement: REVEAL_COST } },
        select: { tokens: true },
      }),
      prisma.photoReveal.create({
        data: { userId, revealedUserId: targetUserId },
      }),
    ]);

    return NextResponse.json({ tokens: updated.tokens });
  } catch (err) {
    console.error("[TOKENS REVEAL]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
