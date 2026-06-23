import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const missionId = request.nextUrl.searchParams.get("missionId");
    let query: any = adminDb.collection("transportChecklists");
    if (missionId) query = query.where("missionId", "==", missionId);

    const snap = await query.get();
    const checklists = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return NextResponse.json(checklists);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const checklist = {
      missionId: body.missionId,
      eventId: body.eventId || null,
      title: body.title || "Checklist transport",
      items: (body.items || []).map((item: any) => ({
        name: item.name,
        category: item.category || "general",
        checked: false,
        assignedTo: item.assignedTo || null,
      })),
      vehicleInfo: body.vehicleInfo || null,
      departureTime: body.departureTime || null,
      departureLocation: body.departureLocation || null,
      arrivalLocation: body.arrivalLocation || null,
      status: "pending",
      createdAt: new Date().toISOString(),
      createdBy: session.user.id,
    };

    const ref = await adminDb.collection("transportChecklists").add(checklist);
    return NextResponse.json({ id: ref.id, ...checklist }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
