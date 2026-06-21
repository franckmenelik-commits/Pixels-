import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const instrument = searchParams.get("instrument");
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");

    let query = adminDb.collection("users").where("artistProfile", "==", true) as any;
    if (status) query = query.where("status", "==", status);

    const snapshot = await query.get();
    let artists = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Client-side filtering for contains-like queries
    if (instrument) {
      artists = artists.filter((a: any) => {
        const instruments = a.instruments;
        if (Array.isArray(instruments)) return instruments.some((i: any) => typeof i === 'string' ? i.includes(instrument) : i.name?.includes(instrument));
        if (typeof instruments === 'string') return instruments.includes(instrument);
        return false;
      });
    }
    if (genre) {
      artists = artists.filter((a: any) => {
        const genres = a.genres;
        if (Array.isArray(genres)) return genres.includes(genre);
        if (typeof genres === 'string') return genres.includes(genre);
        return false;
      });
    }

    return NextResponse.json(artists);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
