import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allSnap = await adminDb.collection("transactions").where("status", "==", "completed").get();

    let totalRevenue = 0;
    let totalPaidToMusicians = 0;
    let totalLogistics = 0;
    let totalReserve = 0;
    const monthlyMap: Record<string, number> = {};

    for (const doc of allSnap.docs) {
      const t = doc.data();
      if (t.type === "income") {
        totalRevenue += t.amount;
        const date = t.date?.toDate ? t.date.toDate() : new Date(t.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + t.amount;
      }
      if (t.category === "musician_payment") totalPaidToMusicians += t.amount;
      if (t.category === "logistics") totalLogistics += t.amount;
      if (t.category === "reserve") totalReserve += t.amount;
    }

    const recentSnap = await adminDb.collection("transactions").orderBy("date", "desc").limit(20).get();
    const recentTransactions = [];
    for (const doc of recentSnap.docs) {
      const data = doc.data();
      let mission = null;
      if (data.missionId) {
        const mDoc = await adminDb.collection("missions").doc(data.missionId).get();
        if (mDoc.exists) {
          const mData = mDoc.data()!;
          let event = null;
          if (mData.eventId) {
            const eDoc = await adminDb.collection("events").doc(mData.eventId).get();
            if (eDoc.exists) event = { id: eDoc.id, ...eDoc.data() };
          }
          mission = { id: mDoc.id, ...mData, event };
        }
      }
      recentTransactions.push({ id: doc.id, ...data, mission });
    }

    const monthlyRevenue = Object.entries(monthlyMap).sort().map(([month, amount]) => ({ month, amount }));

    return NextResponse.json({
      totalRevenue,
      totalPaidToMusicians,
      totalLogistics,
      totalReserve,
      recentTransactions,
      monthlyRevenue,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
