import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const snap = await adminDb.collection("cities").orderBy("name", "asc").get();
    const cities = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (cities.length === 0) {
      return NextResponse.json([
        { id: "montreal", name: "Montréal", active: true, timezone: "America/Toronto", currency: "CAD" },
      ]);
    }

    return NextResponse.json(cities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const city = {
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      active: body.active ?? true,
      timezone: body.timezone || "America/Toronto",
      currency: body.currency || "CAD",
      contactEmail: body.contactEmail || "",
      description: body.description || "",
      createdAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection("cities").add(city);
    return NextResponse.json({ id: ref.id, ...city }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
