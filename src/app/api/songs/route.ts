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
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");

    let query = adminDb.collection("songs") as any;
    if (genre) query = query.where("genre", "==", genre);
    if (difficulty) query = query.where("difficulty", "==", difficulty);

    const snapshot = await query.orderBy("createdAt", "desc").get();
    let songs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const s = search.toLowerCase();
      songs = songs.filter((song: any) =>
        song.title?.toLowerCase().includes(s) || song.artistOrig?.toLowerCase().includes(s)
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
    if (!["admin", "operator", "director"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const ref = await adminDb.collection("songs").add({
      ...body,
      createdBy: session.user.id,
      createdAt: FieldValue.serverTimestamp(),
    });

    const doc = await ref.get();
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
