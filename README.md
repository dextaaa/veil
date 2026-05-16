# Veil — Personality first. Looks second.

A dating app that fundamentally changes the order of attraction. Users swipe on bios before photos are revealed.

## The Mechanic

1. You see someone's **bio, prompts, interests** — photos are blurred
2. You **Like** their personality
3. Photos **gradually reveal** (the blur lifts over ~1 second)
4. You decide: **"Still interested?"** or pass
5. If both people confirm → **Match** → Chat unlocks

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (dark theme)
- **Prisma** + **PostgreSQL** (or Supabase)
- **NextAuth v4** (Credentials provider)
- **Framer Motion** (animations, blur reveal)
- **Zustand** (client state)
- **Sonner** (toasts)

## Setup

### 1. Clone and install

```bash
cd veil
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/veil"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Setup database

```bash
# Push schema to DB
npm run db:push

# Seed with demo users
npm run db:seed
```

### 4. Run dev server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Demo Accounts

After seeding, these accounts are available (password: `password123`):

| Email | Name | Looking for |
|-------|------|-------------|
| alex@demo.com | Alex, 27 | Women |
| maya@demo.com | Maya, 25 | Men |
| jordan@demo.com | Jordan, 29 | Women |
| priya@demo.com | Priya, 26 | Men |
| sam@demo.com | Sam, 31 | Women |
| zoe@demo.com | Zoe, 24 | Men |

Use **alex@demo.com** + **maya@demo.com** to test the full match flow — sign in as each in separate windows.

## Architecture

```
src/
├── app/
│   ├── (auth)/          → Login, Signup
│   ├── (onboarding)/    → 6-step profile creation
│   ├── (app)/           → Discover, Matches, Messages, Profile
│   └── api/             → REST API routes
├── components/
│   ├── discover/        → SwipeCard (the core mechanic)
│   ├── chat/            → Messaging UI
│   ├── matches/         → Match list
│   ├── profile/         → Profile view/edit
│   ├── landing/         → Marketing pages
│   └── shared/          → Nav, Auth provider
├── lib/                 → Prisma, auth config, utils
├── store/               → Zustand app state
└── types/               → TypeScript interfaces
```

## Key Design Decisions

**The blur reveal** uses a Framer Motion animate on `backdropFilter: blur()` — browser-native, GPU-accelerated, silky smooth. The 1-second transition is intentional: long enough to feel like a moment, short enough not to frustrate.

**Two-confirmation flow**: After liking, photos reveal. Then a second prompt: "Still interested?" This removes the snap judgment that plagues other apps, and makes the user feel like their like was *about the person*, not just what they see.

**No hot-or-not swiping**: Cards are not draggable by default until you've read the bio. The drag gesture is available but secondary to the explicit buttons.

## Roadmap

- [ ] Supabase file upload for photos
- [ ] Real-time chat (Pusher / Supabase Realtime)
- [ ] Push notifications
- [ ] Profile boost system (premium)
- [ ] Prompt analytics ("most liked answers")
- [ ] Shareable profile cards
- [ ] Campus ambassador program

## Deployment (Vercel + Supabase)

1. Create Supabase project, get connection string
2. Push to GitHub
3. Import to Vercel
4. Set env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
5. Deploy

```bash
npm run build  # verifies no type errors
```
