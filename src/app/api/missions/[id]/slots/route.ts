import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
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
    const { artistId, instrument } = await request.json();

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { slots: true },
    });
    if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const slotCount = mission.slots.length + 1;
    const payAmount = (mission.totalAmount * (mission.musiciansPct / 100)) / slotCount;

    const slot = await prisma.missionSlot.create({
      data: { missionId: id, artistId, instrument, payAmount },
      include: { artist: true },
    });

    // Recalculate existing slots pay
    const musicianPool = mission.totalAmount * (mission.musiciansPct / 100);
    await prisma.missionSlot.updateMany({
      where: { missionId: id },
      data: { payAmount: musicianPool / slotCount },
    });

    return NextResponse.json(slot, { status: 201 });
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

    const { slotId, status } = await request.json();

    const slot = await prisma.missionSlot.update({
      where: { id: slotId },
      data: {
        status,
        confirmedAt: status === "accepted" ? new Date() : undefined,
      },
    });

    return NextResponse.json(slot);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
