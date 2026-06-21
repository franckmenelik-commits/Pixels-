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
    const snapshot = await adminDb
      .collection("rehearsalNotes")
      .where("instrumentPartId", "==", id)
      .orderBy("createdAt", "desc")
      .get();

    const notes = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(notes);
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

    const { id: instrumentPartId } = await params;
    const body = await request.json();
    const { barRange, note } = body;

    if (!barRange || !note) {
      return NextResponse.json({ error: "barRange and note are required" }, { status: 400 });
    }

    const ref = await adminDb.collection("rehearsalNotes").add({
      instrumentPartId,
      barRange,
      note,
      authorId: session.user.id,
      authorName: session.user.name,
      appliedToChart: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    const doc = await ref.get();
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
