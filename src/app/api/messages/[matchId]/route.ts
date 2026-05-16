import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { matchId: string };
}

export async function GET(_req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: params.matchId,
        OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { matchId: params.matchId },
      orderBy: { createdAt: "asc" },
    });

    const serialized = messages.map((m) => ({
      id: m.id,
      matchId: m.matchId,
      senderId: m.senderId,
      content: m.content,
      read: m.read,
      createdAt: m.createdAt.toISOString(),
    }));

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        matchId: params.matchId,
        senderId: { not: session.user.id },
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ messages: serialized });
  } catch (err) {
    console.error("[MESSAGES GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 });
    }

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: params.matchId,
        OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        matchId: params.matchId,
        senderId: session.user.id,
        content: content.trim(),
      },
    });

    return NextResponse.json({
      message: {
        id: message.id,
        matchId: message.matchId,
        senderId: message.senderId,
        content: message.content,
        read: message.read,
        createdAt: message.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[MESSAGES POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
