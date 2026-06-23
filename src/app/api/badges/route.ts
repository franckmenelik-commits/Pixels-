import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

const BADGE_DEFINITIONS = [
  { id: "first_mission", name: "Première Mission", description: "Compléter sa première mission", icon: "🎵", threshold: 1, field: "completedMissions" },
  { id: "five_missions", name: "Musicien Confirmé", description: "Compléter 5 missions", icon: "🎸", threshold: 5, field: "completedMissions" },
  { id: "ten_missions", name: "Vétéran", description: "Compléter 10 missions", icon: "🏆", threshold: 10, field: "completedMissions" },
  { id: "first_jam", name: "Jammeur", description: "Participer à une jam session", icon: "🎤", threshold: 1, field: "jamSessionsAttended" },
  { id: "five_jams", name: "Jam Master", description: "Participer à 5 jam sessions", icon: "🎹", threshold: 5, field: "jamSessionsAttended" },
  { id: "profile_complete", name: "Profil Complet", description: "Remplir tous les champs du profil", icon: "✨", threshold: 1, field: "profileComplete" },
  { id: "top_rated", name: "Top Rated", description: "Obtenir une note moyenne de 4.5+", icon: "⭐", threshold: 1, field: "topRated" },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = request.nextUrl.searchParams.get("userId") || session.user.id as string;
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userData = userDoc.data()!;
    const earnedSnap = await adminDb.collection("users").doc(userId).collection("badges").get();
    const earnedIds = new Set(earnedSnap.docs.map(d => d.id));

    const badges = BADGE_DEFINITIONS.map(b => ({
      ...b,
      earned: earnedIds.has(b.id),
      earnedAt: earnedSnap.docs.find(d => d.id === b.id)?.data()?.earnedAt || null,
      progress: Math.min((userData[b.field] || 0) / b.threshold, 1),
    }));

    const level = badges.filter(b => b.earned).length;
    const titles = ["Débutant", "Apprenti", "Musicien", "Artiste", "Virtuose", "Maestro", "Légende"];
    const title = titles[Math.min(level, titles.length - 1)];

    return NextResponse.json({ badges, level, title, totalBadges: BADGE_DEFINITIONS.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = await request.json();
    const targetId = userId || session.user.id;
    const userDoc = await adminDb.collection("users").doc(targetId).get();
    if (!userDoc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userData = userDoc.data()!;
    const newBadges: string[] = [];

    for (const badge of BADGE_DEFINITIONS) {
      const value = userData[badge.field] || 0;
      if (value >= badge.threshold) {
        const existing = await adminDb.collection("users").doc(targetId).collection("badges").doc(badge.id).get();
        if (!existing.exists) {
          await adminDb.collection("users").doc(targetId).collection("badges").doc(badge.id).set({
            earnedAt: new Date().toISOString(),
            badgeName: badge.name,
          });
          newBadges.push(badge.id);
        }
      }
    }

    return NextResponse.json({ newBadges, checked: BADGE_DEFINITIONS.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
