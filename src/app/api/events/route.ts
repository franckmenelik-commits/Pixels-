import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { user } = session;
    let eventsRef = adminDb.collection("events") as any;

    if (user.role === "organizer") {
      eventsRef = eventsRef.where("organizerId", "==", user.id);
    } else if (user.role !== "admin" && user.role !== "operator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await eventsRef.orderBy("createdAt", "desc").get();
    const events = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "organizer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const eventData = {
      ...body,
      organizerId: session.user.id,
      dateStart: body.dateStart,
      dateEnd: body.dateEnd,
      status: "nouveau",
      createdAt: FieldValue.serverTimestamp(),
    };

    const ref = await adminDb.collection("events").add(eventData);
    const doc = await ref.get();

    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
