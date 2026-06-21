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
    const missionDoc = await adminDb.collection("missions").doc(id).get();
    if (!missionDoc.exists) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const mission = missionDoc.data()!;
    const eventDoc = await adminDb.collection("events").doc(mission.eventId).get();
    const eventName = eventDoc.exists ? eventDoc.data()!.name : "Unknown";

    const slotsSnap = await adminDb.collection("missions").doc(id).collection("missionSlots").get();

    const total = mission.totalAmount;
    const musicianPool = total * (mission.musiciansPct / 100);
    const logisticsAmount = total * (mission.logisticsPct / 100);
    const reserveAmount = total * (mission.reservePct / 100);
    const slotCount = slotsSnap.size || 1;
    const perMusician = musicianPool / slotCount;

    const batch = adminDb.batch();

    // Income transaction
    const incomeRef = adminDb.collection("transactions").doc();
    batch.set(incomeRef, {
      missionId: id,
      type: "income",
      amount: total,
      category: "event_payment",
      description: `Payment for event: ${eventName}`,
      status: "completed",
      date: FieldValue.serverTimestamp(),
    });

    // Musician payments
    for (const slot of slotsSnap.docs) {
      const slotData = slot.data();
      let artistName = "Unknown";
      if (slotData.artistId) {
        const userDoc = await adminDb.collection("users").doc(slotData.artistId).get();
        if (userDoc.exists) artistName = userDoc.data()!.name || "Unknown";
      }

      const expRef = adminDb.collection("transactions").doc();
      batch.set(expRef, {
        missionId: id,
        type: "expense",
        amount: perMusician,
        category: "musician_payment",
        description: `Payment to ${artistName} (${slotData.instrument})`,
        fromTo: slotData.artistId,
        status: "completed",
        date: FieldValue.serverTimestamp(),
      });
    }

    // Logistics
    const logRef = adminDb.collection("transactions").doc();
    batch.set(logRef, {
      missionId: id,
      type: "expense",
      amount: logisticsAmount,
      category: "logistics",
      description: "Logistics costs",
      status: "completed",
      date: FieldValue.serverTimestamp(),
    });

    // Reserve
    const resRef = adminDb.collection("transactions").doc();
    batch.set(resRef, {
      missionId: id,
      type: "expense",
      amount: reserveAmount,
      category: "reserve",
      description: "Reserve fund",
      status: "completed",
      date: FieldValue.serverTimestamp(),
    });

    // Update mission and event status
    batch.update(adminDb.collection("missions").doc(id), { status: "completed" });
    batch.update(adminDb.collection("events").doc(mission.eventId), { status: "paid" });

    await batch.commit();

    return NextResponse.json({ success: true, transactionsCreated: slotsSnap.size + 3 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
