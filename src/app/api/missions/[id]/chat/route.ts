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
    const missionDoc = await adminDb.collection("missions").doc(id).get();
    if (!missionDoc.exists) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const snap = await adminDb.collection("missions").doc(id).collection("chat")
      .orderBy("createdAt", "asc").limit(100).get();

    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(messages);
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

    const { id } = await params;
    const missionDoc = await adminDb.collection("missions").doc(id).get();
    if (!missionDoc.exists) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const { text } = await request.json();
    if (!text?.trim()) return NextResponse.json({ error: "Message text required" }, { status: 400 });

    const message = {
      text: text.trim(),
      senderId: session.user.uid,
      senderName: session.user.name || session.user.email,
      senderRole: session.user.role,
      createdAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection("missions").doc(id).collection("chat").add(message);
    return NextResponse.json({ id: ref.id, ...message }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
