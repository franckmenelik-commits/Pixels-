import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = adminDb.collection("songs") as any;
    if (genre) query = query.where("genre", "==", genre);
    if (status) query = query.where("status", "==", status);

    const snapshot = await query.orderBy("createdAt", "desc").get();
    let songs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const s = search.toLowerCase();
      songs = songs.filter(
        (song: any) =>
          song.title?.toLowerCase().includes(s) ||
          song.artist?.toLowerCase().includes(s)
      );
    }

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

    const body = await request.json();
    const { title, artist, originalKey, bpm, genre, durationSeconds, sourceUrl } = body;

    if (!title || !artist || !originalKey) {
      return NextResponse.json({ error: "title, artist, and originalKey are required" }, { status: 400 });
    }

    const ref = await adminDb.collection("songs").add({
      title,
      artist,
      originalKey,
      bpm: bpm ?? null,
      genre: genre ?? null,
      durationSeconds: durationSeconds ?? null,
      sourceUrl: sourceUrl ?? null,
      status: "draft",
      createdBy: session.user.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const doc = await ref.get();
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
