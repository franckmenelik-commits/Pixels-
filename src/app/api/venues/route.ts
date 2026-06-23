import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const city = request.nextUrl.searchParams.get("city");
    const type = request.nextUrl.searchParams.get("type");

    let query: any = adminDb.collection("venues");
    if (city) query = query.where("city", "==", city);
    if (type) query = query.where("type", "==", type);

    const snap = await query.get();
    const venues = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return NextResponse.json(venues);
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
    const venue = {
      name: body.name,
      type: body.type || "venue",
      address: body.address || "",
      city: body.city || "Montréal",
      capacity: body.capacity || null,
      equipment: body.equipment || [],
      contactName: body.contactName || "",
      contactEmail: body.contactEmail || "",
      contactPhone: body.contactPhone || "",
      notes: body.notes || "",
      rate: body.rate || null,
      photos: body.photos || [],
      createdAt: new Date().toISOString(),
      createdBy: session.user.id,
    };

    const ref = await adminDb.collection("venues").add(venue);
    return NextResponse.json({ id: ref.id, ...venue }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
