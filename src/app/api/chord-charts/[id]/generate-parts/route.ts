import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";
import { transposeForInstrument } from "@/lib/music/transposition";
import { InstrumentType } from "@/lib/music/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: chordChartId } = await params;

    const chartDoc = await adminDb.collection("chordCharts").doc(chordChartId).get();
    if (!chartDoc.exists) return NextResponse.json({ error: "Chord chart not found" }, { status: 404 });

    const chart = chartDoc.data()!;
    const songDoc = await adminDb.collection("songs").doc(chart.songId).get();
    if (!songDoc.exists) return NextResponse.json({ error: "Song not found" }, { status: 404 });

    const song = songDoc.data()!;
    const body = await request.json();
    const { instruments } = body as { instruments: InstrumentType[] };

    if (!instruments || !Array.isArray(instruments) || instruments.length === 0) {
      return NextResponse.json({ error: "instruments array is required" }, { status: 400 });
    }

    const partIds: string[] = [];

    for (const instrument of instruments) {
      const { sections: transposedSections, transposedKey } = transposeForInstrument(
        chart.sections,
        instrument,
        song.originalKey
      );

      // Check if part already exists
      const existing = await adminDb
        .collection("instrumentParts")
        .where("chordChartId", "==", chordChartId)
        .where("instrument", "==", instrument)
        .get();

      if (!existing.empty) {
        const existingDoc = existing.docs[0];
        await existingDoc.ref.update({
          transposedSections,
          transposedKey,
          updatedAt: FieldValue.serverTimestamp(),
        });
        partIds.push(existingDoc.id);
      } else {
        const ref = await adminDb.collection("instrumentParts").add({
          chordChartId,
          songId: chart.songId,
          instrument,
          transposedSections,
          transposedKey,
          notationType: "chords_only",
          pdfUrl: null,
          manualOverrideUrl: null,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        partIds.push(ref.id);
      }
    }

    return NextResponse.json({ partIds }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
