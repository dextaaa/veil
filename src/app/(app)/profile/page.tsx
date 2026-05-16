import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/profile/profile-client";

function parseInterests(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: {
          photos: { orderBy: { order: "asc" } },
          prompts: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!user?.profile) redirect("/onboarding");

  const profile = {
    id: user.profile.id,
    userId: user.id,
    name: user.profile.name,
    age: user.profile.age,
    gender: user.profile.gender as any,
    bio: user.profile.bio,
    location: user.profile.location,
    photos: user.profile.photos.map((p) => ({ id: p.id, url: p.url, order: p.order })),
    prompts: user.profile.prompts.map((p) => ({ id: p.id, prompt: p.prompt, answer: p.answer, order: p.order })),
    interests: parseInterests(user.profile.interests),
    lookingFor: user.profile.lookingFor as any,
    minAge: user.profile.minAge,
    maxAge: user.profile.maxAge,
  };

  return <ProfileClient profile={profile} email={user.email} />;
}
