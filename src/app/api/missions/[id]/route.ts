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
    const doc = await adminDb.collection("missions").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const data = doc.data()!;
    const eventDoc = data.eventId ? await adminDb.collection("events").doc(data.eventId).get() : null;
    const slotsSnap = await adminDb.collection("missions").doc(id).collection("missionSlots").get();

    const slots = [];
    for (const slotDoc of slotsSnap.docs) {
      const slotData = slotDoc.data();
      let artist = null;
      if (slotData.artistId) {
        const userDoc = await adminDb.collection("users").doc(slotData.artistId).get();
        if (userDoc.exists) artist = { id: userDoc.id, ...userDoc.data() };
      }
      slots.push({ id: slotDoc.id, ...slotData, artist });
    }

    const transSnap = await adminDb.collection("transactions").where("missionId", "==", id).get();
    const transactions = transSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      id: doc.id,
      ...data,
      event: eventDoc?.exists ? { id: eventDoc.id, ...eventDoc.data() } : null,
      slots,
      transactions,
    });
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

    await adminDb.collection("missions").doc(id).update(body);
    const updated = await adminDb.collection("missions").doc(id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
