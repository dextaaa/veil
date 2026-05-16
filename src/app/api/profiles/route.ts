import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized — please sign in again" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const { gender, lookingFor, name, age, location, bio, prompts, interests, photos } = body;

    if (!gender || !lookingFor || !name || !age || !bio) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({ where: { userId } });
    if (existing) {
      // Profile already exists — just redirect, don't error
      return NextResponse.json({ profile: existing }, { status: 200 });
    }

    const cleanPhotos = Array.isArray(photos)
      ? (photos as string[]).filter((url) => typeof url === "string" && url.trim().length > 0)
      : [];

    const cleanPrompts = Array.isArray(prompts)
      ? (prompts as { prompt: string; answer: string }[]).filter(
          (p) => p?.answer?.trim().length > 0
        )
      : [];

    const profile = await prisma.profile.create({
      data: {
        userId,
        gender: String(gender),
        lookingFor: String(lookingFor),
        name: String(name).trim(),
        age: Number(age),
        location: location ? String(location).trim() || null : null,
        bio: String(bio).trim(),
        interests: JSON.stringify(Array.isArray(interests) ? interests : []),
        photos: {
          create: cleanPhotos.map((url, i) => ({ url: url.trim(), order: i })),
        },
        prompts: {
          create: cleanPrompts.map((p, i) => ({
            prompt: p.prompt,
            answer: p.answer.trim(),
            order: i,
          })),
        },
      },
      include: { photos: true, prompts: true },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (err: any) {
    console.error("[PROFILES POST]", err);
    const message =
      process.env.NODE_ENV === "development"
        ? (err?.message ?? String(err))
        : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
