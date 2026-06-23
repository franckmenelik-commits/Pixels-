import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const category = request.nextUrl.searchParams.get("category");
    let query: any = adminDb.collection("wiki").orderBy("updatedAt", "desc");
    if (category) query = query.where("category", "==", category);

    const snap = await query.get();
    const articles = snap.docs.map((d: any) => ({
      id: d.id,
      ...d.data(),
      content: undefined,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const slug = body.title.trim().toLowerCase()
      .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ç]/g, "c")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const article = {
      title: body.title.trim(),
      slug,
      content: body.content.trim(),
      category: body.category || "general",
      tags: body.tags || [],
      authorId: session.user.id,
      authorName: session.user.name || session.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection("wiki").add(article);
    return NextResponse.json({ id: ref.id, ...article }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
