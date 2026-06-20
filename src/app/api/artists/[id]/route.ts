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
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    if (!artist) return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    return NextResponse.json(artist);
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

    const artist = await prisma.artist.update({
      where: { id },
      data: body,
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    return NextResponse.json(artist);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
