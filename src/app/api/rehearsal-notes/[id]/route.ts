import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const doc = await adminDb.collection("rehearsalNotes").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Rehearsal note not found" }, { status: 404 });

    const updates: Record<string, any> = {};
    if (typeof body.appliedToChart === "boolean") {
      updates.appliedToChart = body.appliedToChart;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await adminDb.collection("rehearsalNotes").doc(id).update(updates);
    const updated = await adminDb.collection("rehearsalNotes").doc(id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
