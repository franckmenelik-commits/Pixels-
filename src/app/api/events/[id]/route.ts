import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const doc = await adminDb.collection("events").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Get related quote
    const quotesSnap = await adminDb.collection("quotes").where("eventId", "==", id).limit(1).get();
    const quote = quotesSnap.empty ? null : { id: quotesSnap.docs[0].id, ...quotesSnap.docs[0].data() };

    // Get related mission
    const missionsSnap = await adminDb.collection("missions").where("eventId", "==", id).limit(1).get();
    let mission = null;
    if (!missionsSnap.empty) {
      const missionDoc = missionsSnap.docs[0];
      const slotsSnap = await adminDb.collection("missions").doc(missionDoc.id).collection("missionSlots").get();
      const slots = slotsSnap.docs.map(s => ({ id: s.id, ...s.data() }));
      mission = { id: missionDoc.id, ...missionDoc.data(), slots };
    }

    return NextResponse.json({ id: doc.id, ...doc.data(), quote, mission });
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

    const { id } = await params;
    const body = await request.json();

    if (body.status && !["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden: only admin/operator can change status" }, { status: 403 });
    }

    await adminDb.collection("events").doc(id).update(body);
    const updated = await adminDb.collection("events").doc(id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
