import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const snap = await adminDb.collection("conversations")
      .where("participants", "array-contains", session.user.id)
      .orderBy("lastMessageAt", "desc")
      .limit(50)
      .get();

    const conversations = [];
    for (const doc of snap.docs) {
      const data = doc.data();
      const otherIds = (data.participants || []).filter((id: string) => id !== session.user.id);
      const others = [];
      for (const uid of otherIds) {
        const userDoc = await adminDb.collection("users").doc(uid).get();
        if (userDoc.exists) {
          const u = userDoc.data()!;
          others.push({ id: uid, name: u.name || u.displayName, photo: u.photoURL });
        }
      }
      conversations.push({ id: doc.id, ...data, otherParticipants: others });
    }

    return NextResponse.json(conversations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { recipientId, text } = await request.json();
    if (!recipientId || !text?.trim()) {
      return NextResponse.json({ error: "recipientId and text required" }, { status: 400 });
    }

    const participants = [session.user.id, recipientId].sort();
    const existingSnap = await adminDb.collection("conversations")
      .where("participants", "==", participants)
      .limit(1)
      .get();

    let conversationId: string;
    if (!existingSnap.empty) {
      conversationId = existingSnap.docs[0].id;
    } else {
      const ref = await adminDb.collection("conversations").add({
        participants,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        lastMessagePreview: text.trim().slice(0, 100),
      });
      conversationId = ref.id;
    }

    const message = {
      senderId: session.user.id,
      senderName: session.user.name || session.user.email,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    await adminDb.collection("conversations").doc(conversationId).collection("messages").add(message);
    await adminDb.collection("conversations").doc(conversationId).update({
      lastMessageAt: message.createdAt,
      lastMessagePreview: message.text.slice(0, 100),
    });

    return NextResponse.json({ conversationId, message }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
