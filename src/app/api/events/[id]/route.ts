import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        quote: true,
        mission: { include: { slots: { include: { artist: true } } } },
        organizer: true,
      },
    });

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json(event);
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

    if (body.status && !["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden: only admin/operator can change status" }, { status: 403 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: body,
      include: { organizer: true, quote: true },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
