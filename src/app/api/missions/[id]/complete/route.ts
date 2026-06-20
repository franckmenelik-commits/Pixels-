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
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { slots: { include: { artist: { include: { user: true } } } }, event: true },
    });
    if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const total = mission.totalAmount;
    const musicianPool = total * (mission.musiciansPct / 100);
    const logisticsAmount = total * (mission.logisticsPct / 100);
    const reserveAmount = total * (mission.reservePct / 100);
    const slotCount = mission.slots.length || 1;
    const perMusician = musicianPool / slotCount;

    const transactions = [];

    // Income transaction
    transactions.push({
      missionId: id,
      type: "income",
      amount: total,
      category: "event_payment",
      description: `Payment for event: ${mission.event.name}`,
      status: "completed",
    });

    // Musician payments
    for (const slot of mission.slots) {
      const artistName = slot.artist?.user?.name || "Unknown";
      transactions.push({
        missionId: id,
        type: "expense",
        amount: perMusician,
        category: "musician_payment",
        description: `Payment to ${artistName} (${slot.instrument})`,
        fromTo: slot.artist?.userId,
        status: "completed",
      });
    }

    // Logistics
    transactions.push({
      missionId: id,
      type: "expense",
      amount: logisticsAmount,
      category: "logistics",
      description: "Logistics costs",
      status: "completed",
    });

    // Reserve
    transactions.push({
      missionId: id,
      type: "expense",
      amount: reserveAmount,
      category: "reserve",
      description: "Reserve fund",
      status: "completed",
    });

    await prisma.transaction.createMany({ data: transactions });
    await prisma.mission.update({ where: { id }, data: { status: "completed" } });
    await prisma.event.update({ where: { id: mission.eventId }, data: { status: "paid" } });

    return NextResponse.json({ success: true, transactionsCreated: transactions.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
