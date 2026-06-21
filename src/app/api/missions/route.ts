import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { user } = session;
    let missionsRef = adminDb.collection("missions") as any;

    if (["admin", "operator"].includes(user.role)) {
      // see all
    } else if (user.role === "director") {
      missionsRef = missionsRef.where("directorId", "==", user.id);
    } else if (user.role === "artist") {
      // For artists, we need to find missions where they have slots
      // This requires a different approach - query missionSlots
      const slotsSnap = await adminDb.collectionGroup("missionSlots").where("artistId", "==", user.id).get();
      const missionIds = [...new Set(slotsSnap.docs.map(d => d.ref.parent.parent?.id).filter(Boolean))];

      if (missionIds.length === 0) return NextResponse.json([]);

      const missions = [];
      for (const mId of missionIds) {
        const mDoc = await adminDb.collection("missions").doc(mId!).get();
        if (mDoc.exists) {
          const eventDoc = mDoc.data()?.eventId ? await adminDb.collection("events").doc(mDoc.data()!.eventId).get() : null;
          const slotsSnap2 = await adminDb.collection("missions").doc(mId!).collection("missionSlots").get();
          missions.push({
            id: mDoc.id,
            ...mDoc.data(),
            event: eventDoc?.exists ? { id: eventDoc.id, ...eventDoc.data() } : null,
            slots: slotsSnap2.docs.map(s => ({ id: s.id, ...s.data() })),
          });
        }
      }
      return NextResponse.json(missions);
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await missionsRef.orderBy("createdAt", "desc").get();
    const missions = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const eventDoc = data.eventId ? await adminDb.collection("events").doc(data.eventId).get() : null;
      const slotsSnap = await adminDb.collection("missions").doc(doc.id).collection("missionSlots").get();
      missions.push({
        id: doc.id,
        ...data,
        event: eventDoc?.exists ? { id: eventDoc.id, ...eventDoc.data() } : null,
        slots: slotsSnap.docs.map(s => ({ id: s.id, ...s.data() })),
      });
    }

    return NextResponse.json(missions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
