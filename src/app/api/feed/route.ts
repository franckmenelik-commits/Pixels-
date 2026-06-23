import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const snap = await adminDb.collection("feed")
      .orderBy("createdAt", "desc")
      .limit(Math.min(limit, 50))
      .get();

    const posts = [];
    for (const doc of snap.docs) {
      const data = doc.data();
      let author = null;
      if (data.authorId) {
        const userDoc = await adminDb.collection("users").doc(data.authorId).get();
        if (userDoc.exists) {
          const u = userDoc.data()!;
          author = { id: userDoc.id, name: u.name || u.displayName, photo: u.photoURL };
        }
      }
      posts.push({ id: doc.id, ...data, author });
    }

    return NextResponse.json(posts);
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
    if (!body.content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

    const post = {
      type: body.type || "post",
      content: body.content.trim(),
      mediaUrls: body.mediaUrls || [],
      authorId: session.user.id,
      authorName: session.user.name || session.user.email,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection("feed").add(post);
    return NextResponse.json({ id: ref.id, ...post }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
