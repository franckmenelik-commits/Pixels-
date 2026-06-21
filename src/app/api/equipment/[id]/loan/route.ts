import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { borrowerId, dueDate } = body;

    const eqDoc = await adminDb.collection("equipment").doc(id).get();
    if (!eqDoc.exists) return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    const equipment = eqDoc.data()!;
    if (equipment.status !== "available") {
      return NextResponse.json({ error: "Equipment not available" }, { status: 400 });
    }

    const loanRef = await adminDb.collection("equipmentLoans").add({
      equipmentId: id,
      borrowerId,
      dueDate,
      conditionOut: equipment.condition,
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    });

    await adminDb.collection("equipment").doc(id).update({ status: "reserved" });

    const loan = await loanRef.get();
    return NextResponse.json({ id: loanRef.id, ...loan.data() }, { status: 201 });
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
    const { conditionIn } = body;

    const loansSnap = await adminDb.collection("equipmentLoans")
      .where("equipmentId", "==", id)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (loansSnap.empty) return NextResponse.json({ error: "No active loan found" }, { status: 404 });

    const loanDoc = loansSnap.docs[0];
    await loanDoc.ref.update({
      returnDate: new Date().toISOString(),
      conditionIn,
      status: "returned",
    });

    const updateData: Record<string, any> = { status: "available" };
    if (conditionIn) updateData.condition = conditionIn;
    await adminDb.collection("equipment").doc(id).update(updateData);

    const updated = await loanDoc.ref.get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
