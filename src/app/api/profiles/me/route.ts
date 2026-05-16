import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      photos: { orderBy: { order: "asc" } },
      prompts: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const allowed = ["bio", "location", "minAge", "maxAge"];
    const updates: Record<string, unknown> = {};

    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: updates,
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("[PROFILES PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
