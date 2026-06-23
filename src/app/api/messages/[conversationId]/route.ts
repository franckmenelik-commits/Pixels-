import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { conversationId } = await params;
    const convDoc = await adminDb.collection("conversations").doc(conversationId).get();
    if (!convDoc.exists) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    const convData = convDoc.data()!;
    if (!convData.participants?.includes(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snap = await adminDb.collection("conversations").doc(conversationId)
      .collection("messages").orderBy("createdAt", "asc").limit(200).get();

    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
