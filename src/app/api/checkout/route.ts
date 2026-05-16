import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, TOKENS_PACKAGE } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: TOKENS_PACKAGE.label,
              description: TOKENS_PACKAGE.description,
            },
            unit_amount: TOKENS_PACKAGE.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/discover?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/discover`,
      metadata: {
        userId: session.user.id,
        tokens: String(TOKENS_PACKAGE.tokens),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error("[CHECKOUT]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
