import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Must use raw body — do not JSON.parse before passing to constructEvent
export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[STRIPE WEBHOOK] signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const userId = session.metadata?.userId as string | undefined;
    const tokens = parseInt(session.metadata?.tokens ?? "0", 10);

    if (!userId || !tokens) {
      console.error("[STRIPE WEBHOOK] missing userId or tokens in metadata", session.metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { tokens: { increment: tokens } },
    });

    console.log(`[STRIPE WEBHOOK] +${tokens} tokens credited to user ${userId}`);
  }

  return NextResponse.json({ received: true });
}
