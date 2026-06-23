import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const snap = await adminDb.collection("wiki").where("slug", "==", slug).limit(1).get();

    if (snap.empty) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    const doc = snap.docs[0];
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await params;
    const snap = await adminDb.collection("wiki").where("slug", "==", slug).limit(1).get();
    if (snap.empty) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    const body = await request.json();
    const updates = { ...body, updatedAt: new Date().toISOString() };

    await adminDb.collection("wiki").doc(snap.docs[0].id).update(updates);
    const updated = await adminDb.collection("wiki").doc(snap.docs[0].id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
