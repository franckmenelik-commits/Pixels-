import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let query = adminDb.collection("equipment") as any;
    if (type) query = query.where("type", "==", type);
    if (status) query = query.where("status", "==", status);

    const snapshot = await query.orderBy("createdAt", "desc").get();
    const equipment = [];
    for (const doc of snapshot.docs) {
      const loansSnap = await adminDb.collection("equipmentLoans").where("equipmentId", "==", doc.id).get();
      const loans = loansSnap.docs.map((l: any) => ({ id: l.id, ...l.data() }));
      equipment.push({ id: doc.id, ...doc.data(), loans });
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const ref = await adminDb.collection("equipment").add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
    });

    const doc = await ref.get();
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
