import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const musicians = event.musiciansCount || 1;
    const duration = event.duration || 2;

    let perMusician: number;
    if (event.segment === "access") perMusician = 100;
    else if (event.segment === "standard") perMusician = 200;
    else perMusician = 300;

    const musiciansTotal = musicians * perMusician;
    const durationTotal = duration * 50;
    const transport = event.transportByOrg ? 0 : 120;
    const sound = event.hasSound ? 0 : 200;
    const amount = musiciansTotal + durationTotal + transport + sound;

    const breakdown = JSON.stringify({
      musicians: musiciansTotal,
      duration: durationTotal,
      transport,
      sound,
    });

    const quote = await prisma.quote.create({
      data: {
        eventId: id,
        amount,
        breakdown,
        status: "draft",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.event.update({ where: { id }, data: { status: "quote_sent" } });

    return NextResponse.json(quote, { status: 201 });
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
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const quote = await prisma.quote.findUnique({ where: { eventId: id } });
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    const updated = await prisma.quote.update({
      where: { id: quote.id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
