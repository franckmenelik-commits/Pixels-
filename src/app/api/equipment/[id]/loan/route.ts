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

    const { id } = await params;
    const body = await request.json();
    const { borrowerId, dueDate } = body;

    const equipment = await prisma.equipment.findUnique({ where: { id } });
    if (!equipment) return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    if (equipment.status !== "available") {
      return NextResponse.json({ error: "Equipment not available" }, { status: 400 });
    }

    const loan = await prisma.equipmentLoan.create({
      data: {
        equipmentId: id,
        borrowerId,
        dueDate: new Date(dueDate),
        conditionOut: equipment.condition,
      },
    });

    await prisma.equipment.update({
      where: { id },
      data: { status: "reserved" },
    });

    return NextResponse.json(loan, { status: 201 });
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

    const activeLoan = await prisma.equipmentLoan.findFirst({
      where: { equipmentId: id, status: "active" },
    });
    if (!activeLoan) return NextResponse.json({ error: "No active loan found" }, { status: 404 });

    const loan = await prisma.equipmentLoan.update({
      where: { id: activeLoan.id },
      data: {
        returnDate: new Date(),
        conditionIn,
        status: "returned",
      },
    });

    const updateData: Record<string, unknown> = { status: "available" };
    if (conditionIn) updateData.condition = conditionIn;

    await prisma.equipment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(loan);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
