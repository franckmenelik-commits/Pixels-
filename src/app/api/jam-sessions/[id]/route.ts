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
    const doc = await adminDb.collection("jamSessions").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Jam session not found" }, { status: 404 });

    return NextResponse.json({ id: doc.id, ...doc.data() });
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
    await adminDb.collection("jamSessions").doc(id).update(body);
    const updated = await adminDb.collection("jamSessions").doc(id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
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
    const body = await request.json();
    const { action } = body;

    const doc = await adminDb.collection("jamSessions").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Jam session not found" }, { status: 404 });

    const jamSession = doc.data()!;
    const participants: string[] = JSON.parse(jamSession.participants || "[]");

    if (action === "join") {
      if (participants.includes(session.user.id)) {
        return NextResponse.json({ error: "Already joined" }, { status: 400 });
      }
      if (participants.length >= jamSession.capacity) {
        return NextResponse.json({ error: "Session is full" }, { status: 400 });
      }
      participants.push(session.user.id);
    } else if (action === "leave") {
      const idx = participants.indexOf(session.user.id);
      if (idx === -1) {
        return NextResponse.json({ error: "Not a participant" }, { status: 400 });
      }
      participants.splice(idx, 1);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await adminDb.collection("jamSessions").doc(id).update({ participants: JSON.stringify(participants) });
    const updated = await adminDb.collection("jamSessions").doc(id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
