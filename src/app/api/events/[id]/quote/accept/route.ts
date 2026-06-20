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

    const { id } = await params;
    const quote = await prisma.quote.findUnique({ where: { eventId: id } });
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    await prisma.quote.update({
      where: { id: quote.id },
      data: { status: "accepted", signedAt: new Date() },
    });

    await prisma.event.update({ where: { id }, data: { status: "accepted" } });

    const mission = await prisma.mission.create({
      data: {
        eventId: id,
        totalAmount: quote.amount,
        status: "forming",
      },
    });

    return NextResponse.json(mission, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
