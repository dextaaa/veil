import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
      },
      include: {
        userA: {
          include: { profile: { include: { photos: { orderBy: { order: "asc" } } } } },
        },
        userB: {
          include: { profile: { include: { photos: { orderBy: { order: "asc" } } } } },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ matches });
  } catch (err) {
    console.error("[MATCHES]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
