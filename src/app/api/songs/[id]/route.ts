import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const doc = await adminDb.collection("songs").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Song not found" }, { status: 404 });

    const [chartsSnap, partsSnap] = await Promise.all([
      adminDb.collection("chordCharts").where("songId", "==", id).get(),
      adminDb.collection("instrumentParts").where("songId", "==", id).get(),
    ]);

    const chordCharts = chartsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const instrumentParts = partsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      song: { id: doc.id, ...doc.data() },
      chordCharts,
      instrumentParts,
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

    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["title", "artist", "originalKey", "bpm", "genre", "status", "durationSeconds", "sourceUrl"];
    const updates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in body) updates[key] = body[key];
    }
    updates.updatedAt = FieldValue.serverTimestamp();

    await adminDb.collection("songs").doc(id).update(updates);
    const updated = await adminDb.collection("songs").doc(id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden: admin or operator only" }, { status: 403 });
    }

    const { id } = await params;

    // Delete associated data
    const [charts, parts] = await Promise.all([
      adminDb.collection("chordCharts").where("songId", "==", id).get(),
      adminDb.collection("instrumentParts").where("songId", "==", id).get(),
    ]);

    // Fetch rehearsal notes linked to instrument parts
    const partIds = parts.docs.map((d: any) => d.id);
    const noteSnapshots = await Promise.all(
      partIds.map((partId: string) =>
        adminDb.collection("rehearsalNotes").where("instrumentPartId", "==", partId).get()
      )
    );

    const batch = adminDb.batch();
    batch.delete(adminDb.collection("songs").doc(id));
    charts.docs.forEach((d: any) => batch.delete(d.ref));
    parts.docs.forEach((d: any) => batch.delete(d.ref));
    noteSnapshots.forEach((snap) => snap.docs.forEach((d: any) => batch.delete(d.ref)));
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
