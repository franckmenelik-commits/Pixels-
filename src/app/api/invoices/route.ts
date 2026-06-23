import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const eventId = request.nextUrl.searchParams.get("eventId");
    let query: any = adminDb.collection("invoices");
    if (eventId) query = query.where("eventId", "==", eventId);
    if (!["admin", "operator"].includes(session.user.role)) {
      query = query.where("createdBy", "==", session.user.id);
    }

    const snap = await query.get();
    const invoices = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator", "organizer"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const invoiceCount = (await adminDb.collection("invoices").count().get()).data().count;
    const invoiceNumber = `PIX-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, "0")}`;

    const items = (body.items || []).map((item: any) => ({
      description: item.description,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));

    const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
    const taxRate = 0.14975; // QST + GST
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const invoice = {
      invoiceNumber,
      eventId: body.eventId || null,
      contractId: body.contractId || null,
      clientName: body.clientName,
      clientEmail: body.clientEmail || "",
      clientAddress: body.clientAddress || "",
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      currency: "CAD",
      status: "draft",
      dueDate: body.dueDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
      createdBy: session.user.id,
    };

    const ref = await adminDb.collection("invoices").add(invoice);
    return NextResponse.json({ id: ref.id, ...invoice }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
