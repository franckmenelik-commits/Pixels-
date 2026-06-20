import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { user } = session;
    let where = {};

    if (["admin", "operator"].includes(user.role)) {
      // see all
    } else if (user.role === "director") {
      where = { directorId: user.id };
    } else if (user.role === "artist") {
      const artist = await prisma.artist.findUnique({ where: { userId: user.id } });
      if (!artist) return NextResponse.json({ error: "Artist not found" }, { status: 404 });
      where = { slots: { some: { artistId: artist.id } } };
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const missions = await prisma.mission.findMany({
      where,
      include: { event: true, slots: { include: { artist: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(missions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
