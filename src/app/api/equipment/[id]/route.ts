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
    const doc = await adminDb.collection("equipment").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Equipment not found" }, { status: 404 });

    const loansSnap = await adminDb.collection("equipmentLoans").where("equipmentId", "==", id).get();
    const loans = loansSnap.docs.map(l => ({ id: l.id, ...l.data() }));

    return NextResponse.json({ id: doc.id, ...doc.data(), loans });
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
    await adminDb.collection("equipment").doc(id).update(body);
    const updated = await adminDb.collection("equipment").doc(id).get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
