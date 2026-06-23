import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subscription, deviceName } = await request.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Push subscription required" }, { status: 400 });
    }

    await adminDb.collection("pushSubscriptions").doc(session.user.id).set({
      userId: session.user.id,
      subscription,
      deviceName: deviceName || "Unknown device",
      enabled: true,
      preferences: {
        missions: true,
        messages: true,
        events: true,
        jamSessions: true,
        badges: true,
      },
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await adminDb.collection("pushSubscriptions").doc(session.user.id).update({ enabled: false });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doc = await adminDb.collection("pushSubscriptions").doc(session.user.id).get();
    if (!doc.exists) return NextResponse.json({ subscribed: false });

    return NextResponse.json({ subscribed: true, ...doc.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
