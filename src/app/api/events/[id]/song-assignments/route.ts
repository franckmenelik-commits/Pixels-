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

    const { id: eventId } = await params;
    const snapshot = await adminDb
      .collection("eventSongAssignments")
      .where("eventId", "==", eventId)
      .get();

    const assignments = await Promise.all(
      snapshot.docs.map(async (doc: any) => {
        const data = doc.data();
        // Fetch song title
        const songDoc = await adminDb.collection("songs").doc(data.songId).get();
        const songTitle = songDoc.exists ? songDoc.data()!.title : "Unknown";
        return { id: doc.id, ...data, songTitle };
      })
    );

    return NextResponse.json(assignments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: eventId } = await params;
    const body = await request.json();
    const { songId, assignments, notes } = body;

    if (!songId || !assignments || !Array.isArray(assignments)) {
      return NextResponse.json({ error: "songId and assignments array are required" }, { status: 400 });
    }

    const ref = await adminDb.collection("eventSongAssignments").add({
      eventId,
      songId,
      assignments,
      notes: notes ?? null,
      createdAt: FieldValue.serverTimestamp(),
    });

    const doc = await ref.get();
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { assignmentId } = body;

    if (!assignmentId) {
      return NextResponse.json({ error: "assignmentId is required" }, { status: 400 });
    }

    const doc = await adminDb.collection("eventSongAssignments").doc(assignmentId).get();
    if (!doc.exists) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    await adminDb.collection("eventSongAssignments").doc(assignmentId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
