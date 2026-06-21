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
    const snapshot = await adminDb.collection("chordCharts").where("songId", "==", id).get();
    const charts = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(charts);
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

    const { id: songId } = await params;

    // Check song exists and authorization
    const songDoc = await adminDb.collection("songs").doc(songId).get();
    if (!songDoc.exists) return NextResponse.json({ error: "Song not found" }, { status: 404 });

    const song = songDoc.data()!;
    const allowedRoles = ["admin", "operator", "director"];
    if (!allowedRoles.includes(session.user.role) && song.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { key, sections, source } = body;

    if (!key || !sections) {
      return NextResponse.json({ error: "key and sections are required" }, { status: 400 });
    }

    const ref = await adminDb.collection("chordCharts").add({
      songId,
      key,
      sections,
      source: source ?? "manual",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Update song status if draft
    if (song.status === "draft") {
      await adminDb.collection("songs").doc(songId).update({
        status: "chord_detected",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    const doc = await ref.get();
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
