import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (genre) where.genre = genre;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { artistOrig: { contains: search } },
      ];
    }

    const songs = await prisma.song.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator", "director"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const song = await prisma.song.create({
      data: {
        ...body,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
