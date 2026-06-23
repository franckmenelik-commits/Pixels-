import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

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

    const slotsSnap = await adminDb.collection("missions").doc(id).collection("missionSlots").get();
    const unfilledSlots = slotsSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter((s: any) => !s.artistId);

    if (unfilledSlots.length === 0) {
      return NextResponse.json({ message: "All slots are filled", suggestions: [] });
    }

    const artistsSnap = await adminDb.collection("users")
      .where("role", "==", "artist")
      .where("status", "!=", "inactive")
      .get();

    const alreadyAssigned = new Set(
      slotsSnap.docs.map(d => d.data().artistId).filter(Boolean)
    );

    const suggestions = [];

    for (const slot of unfilledSlots) {
      const slotData = slot as any;
      const requiredInstrument = slotData.instrument?.toLowerCase() || "";
      const requiredGenre = slotData.genre?.toLowerCase() || "";

      const candidates = artistsSnap.docs
        .filter(d => !alreadyAssigned.has(d.id))
        .map(d => {
          const data = d.data();
          let score = 0;

          const instruments = (data.instruments || []).map((i: string) => i.toLowerCase());
          const genres = (data.genres || []).map((g: string) => g.toLowerCase());

          if (requiredInstrument && instruments.includes(requiredInstrument)) score += 50;
          if (requiredGenre && genres.includes(requiredGenre)) score += 30;
          if (data.completedMissions) score += Math.min(data.completedMissions * 2, 20);

          return { artistId: d.id, name: data.name || data.displayName, instruments, genres, score };
        })
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      suggestions.push({ slotId: slot.id, instrument: requiredInstrument, candidates });
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
