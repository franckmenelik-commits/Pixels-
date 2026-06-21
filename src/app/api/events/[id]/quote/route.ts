import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const eventDoc = await adminDb.collection("events").doc(id).get();
    if (!eventDoc.exists) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const event = eventDoc.data()!;
    const musicians = event.musiciansCount || 1;
    const duration = event.duration || 2;

    let perMusician: number;
    if (event.segment === "access") perMusician = 100;
    else if (event.segment === "standard") perMusician = 200;
    else perMusician = 300;

    const musiciansTotal = musicians * perMusician;
    const durationTotal = duration * 50;
    const transport = event.transportByOrg ? 0 : 120;
    const sound = event.hasSound ? 0 : 200;
    const amount = musiciansTotal + durationTotal + transport + sound;

    const breakdown = JSON.stringify({ musicians: musiciansTotal, duration: durationTotal, transport, sound });

    const quoteData = {
      eventId: id,
      amount,
      breakdown,
      status: "draft",
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: FieldValue.serverTimestamp(),
    };

    const ref = await adminDb.collection("quotes").add(quoteData);
    await adminDb.collection("events").doc(id).update({ status: "quote_sent" });

    return NextResponse.json({ id: ref.id, ...quoteData }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const quotesSnap = await adminDb.collection("quotes").where("eventId", "==", id).limit(1).get();
    if (quotesSnap.empty) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    const quoteDoc = quotesSnap.docs[0];
    await quoteDoc.ref.update(body);
    const updated = await quoteDoc.ref.get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
