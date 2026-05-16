import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DAILY_LIMIT: Record<string, number> = { MALE: 50, FEMALE: 100 };

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  try {
    const { swipedUserId, liked } = await req.json();

    if (!swipedUserId) {
      return NextResponse.json({ error: "swipedUserId required" }, { status: 400 });
    }

    // Enforce daily swipe limit based on gender
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { gender: true },
    });

    if (profile) {
      const limit = DAILY_LIMIT[profile.gender] ?? 50;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const swipesToday = await prisma.swipe.count({
        where: { swiperId: userId, createdAt: { gte: startOfDay } },
      });

      if (swipesToday >= limit) {
        return NextResponse.json(
          { error: `Daily limit reached. ${profile.gender === "MALE" ? "Men" : "Women"} get ${limit} swipes per day. Come back tomorrow.` },
          { status: 429 }
        );
      }
    }

    // Upsert swipe
    await prisma.swipe.upsert({
      where: { swiperId_swipedId: { swiperId: userId, swipedId: swipedUserId } },
      create: { swiperId: userId, swipedId: swipedUserId, liked },
      update: { liked },
    });

    if (!liked) {
      return NextResponse.json({ match: false });
    }

    // Check for mutual like
    const mutualLike = await prisma.swipe.findFirst({
      where: { swiperId: swipedUserId, swipedId: userId, liked: true },
    });

    if (!mutualLike) {
      return NextResponse.json({ match: false });
    }

    // Create match (ensure consistent ordering to avoid duplicates)
    const [userAId, userBId] = [userId, swipedUserId].sort();

    const match = await prisma.match.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      create: { userAId, userBId },
      update: {},
    });

    return NextResponse.json({ match: true, matchId: match.id });
  } catch (err) {
    console.error("[SWIPES]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
