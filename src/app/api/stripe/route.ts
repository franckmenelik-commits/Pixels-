import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action } = await request.json();

    if (action === "create-connect-account") {
      const userDoc = await adminDb.collection("users").doc(session.user.id).get();
      if (!userDoc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const connectAccount = {
        userId: session.user.id,
        stripeAccountId: null,
        status: "pending",
        onboardingUrl: null,
        createdAt: new Date().toISOString(),
      };

      if (!process.env.STRIPE_SECRET_KEY) {
        await adminDb.collection("stripeAccounts").doc(session.user.id).set(connectAccount);
        return NextResponse.json({
          ...connectAccount,
          message: "Stripe Connect account placeholder created. Configure STRIPE_SECRET_KEY to enable live onboarding.",
        }, { status: 201 });
      }

      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const account = await stripe.accounts.create({
        type: "express",
        country: "CA",
        email: session.user.email,
        capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://pixels-montreal.com"}/profile?stripe=refresh`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://pixels-montreal.com"}/profile?stripe=success`,
        type: "account_onboarding",
      });

      connectAccount.stripeAccountId = account.id;
      connectAccount.status = "onboarding";
      connectAccount.onboardingUrl = accountLink.url;

      await adminDb.collection("stripeAccounts").doc(session.user.id).set(connectAccount);
      return NextResponse.json(connectAccount, { status: 201 });
    }

    if (action === "create-payment-intent") {
      const { amount, eventId, description } = await request.json();
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
      }

      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "cad",
        description: description || `Pixels event payment`,
        metadata: { eventId, userId: session.user.id },
      });

      return NextResponse.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doc = await adminDb.collection("stripeAccounts").doc(session.user.id).get();
    if (!doc.exists) return NextResponse.json({ connected: false });

    return NextResponse.json({ connected: true, ...doc.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
