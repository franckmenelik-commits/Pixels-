import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { user } = session;
    let where = {};

    if (user.role === "organizer") {
      const organizer = await prisma.organizer.findUnique({ where: { userId: user.id } });
      if (!organizer) return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
      where = { organizerId: organizer.id };
    } else if (user.role !== "admin" && user.role !== "operator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const events = await prisma.event.findMany({
      where,
      include: { organizer: true, quote: true },
      orderBy: { createdAt: "desc" },
    });

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

    const organizer = await prisma.organizer.findUnique({ where: { userId: session.user.id } });
    if (!organizer) return NextResponse.json({ error: "Organizer profile not found" }, { status: 404 });

    const body = await request.json();
    const event = await prisma.event.create({
      data: {
        ...body,
        organizerId: organizer.id,
        dateStart: new Date(body.dateStart),
        dateEnd: new Date(body.dateEnd),
      },
      include: { organizer: true },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
