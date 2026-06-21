import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
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
    const { artistId, instrument } = await request.json();

    const missionDoc = await adminDb.collection("missions").doc(id).get();
    if (!missionDoc.exists) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const mission = missionDoc.data()!;
    const slotsSnap = await adminDb.collection("missions").doc(id).collection("missionSlots").get();
    const slotCount = slotsSnap.size + 1;
    const musicianPool = mission.totalAmount * (mission.musiciansPct / 100);
    const payAmount = musicianPool / slotCount;

    const slotRef = await adminDb.collection("missions").doc(id).collection("missionSlots").add({
      artistId,
      instrument,
      payAmount,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    // Recalculate existing slots pay
    const batch = adminDb.batch();
    for (const slotDoc of slotsSnap.docs) {
      batch.update(slotDoc.ref, { payAmount });
    }
    await batch.commit();

    const newSlot = await slotRef.get();
    return NextResponse.json({ id: slotRef.id, ...newSlot.data() }, { status: 201 });
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
    const { slotId, status } = await request.json();

    const slotRef = adminDb.collection("missions").doc(id).collection("missionSlots").doc(slotId);
    const updateData: Record<string, any> = { status };
    if (status === "accepted") updateData.confirmedAt = new Date().toISOString();

    await slotRef.update(updateData);
    const updated = await slotRef.get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
