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

    const { id } = await params;
    const quotesSnap = await adminDb.collection("quotes").where("eventId", "==", id).limit(1).get();
    if (quotesSnap.empty) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    const quoteDoc = quotesSnap.docs[0];
    const quoteData = quoteDoc.data();

    await quoteDoc.ref.update({ status: "accepted", signedAt: new Date().toISOString() });
    await adminDb.collection("events").doc(id).update({ status: "accepted" });

    const missionRef = await adminDb.collection("missions").add({
      eventId: id,
      totalAmount: quoteData.amount,
      status: "forming",
      musiciansPct: 60,
      logisticsPct: 25,
      reservePct: 15,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: missionRef.id, eventId: id, status: "forming" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
