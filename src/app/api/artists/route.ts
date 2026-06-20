import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const instrument = searchParams.get("instrument");
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (instrument) where.instruments = { contains: instrument };
    if (genre) where.genres = { contains: genre };
    if (status) where.status = status;

    const artists = await prisma.artist.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    return NextResponse.json(artists);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
