import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = request.nextUrl.searchParams.get("role");
    let query: any = adminDb.collection("trainingModules").orderBy("order", "asc");
    if (role) query = query.where("targetRole", "==", role);

    const snap = await query.get();
    const modules = [];

    for (const doc of snap.docs) {
      const data = doc.data();
      const progressDoc = await adminDb.collection("trainingProgress")
        .doc(`${session.user.id}_${doc.id}`).get();

      modules.push({
        id: doc.id,
        ...data,
        progress: progressDoc.exists ? progressDoc.data() : { completed: false, completedSteps: 0 },
      });
    }

    return NextResponse.json(modules);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const module = {
      title: body.title,
      description: body.description || "",
      targetRole: body.targetRole || "musical_director",
      steps: (body.steps || []).map((s: any, i: number) => ({
        order: i + 1,
        title: s.title,
        content: s.content || "",
        type: s.type || "lesson",
        durationMinutes: s.durationMinutes || 30,
      })),
      order: body.order || 0,
      totalSteps: (body.steps || []).length,
      createdAt: new Date().toISOString(),
      createdBy: session.user.id,
    };

    const ref = await adminDb.collection("trainingModules").add(module);
    return NextResponse.json({ id: ref.id, ...module }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { moduleId, stepIndex } = await request.json();
    if (!moduleId) return NextResponse.json({ error: "moduleId required" }, { status: 400 });

    const progressId = `${session.user.id}_${moduleId}`;
    const moduleDoc = await adminDb.collection("trainingModules").doc(moduleId).get();
    if (!moduleDoc.exists) return NextResponse.json({ error: "Module not found" }, { status: 404 });

    const totalSteps = moduleDoc.data()!.totalSteps || 1;
    const completedSteps = (stepIndex || 0) + 1;

    await adminDb.collection("trainingProgress").doc(progressId).set({
      userId: session.user.id,
      moduleId,
      completedSteps,
      completed: completedSteps >= totalSteps,
      completedAt: completedSteps >= totalSteps ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ completedSteps, total: totalSteps, completed: completedSteps >= totalSteps });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
