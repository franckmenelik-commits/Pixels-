import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allTransactions = await prisma.transaction.findMany({
      where: { status: "completed" },
    });

    let totalRevenue = 0;
    let totalPaidToMusicians = 0;
    let totalLogistics = 0;
    let totalReserve = 0;
    const monthlyMap: Record<string, number> = {};

    for (const t of allTransactions) {
      if (t.type === "income") {
        totalRevenue += t.amount;
        const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + t.amount;
      }
      if (t.category === "musician_payment") totalPaidToMusicians += t.amount;
      if (t.category === "logistics") totalLogistics += t.amount;
      if (t.category === "reserve") totalReserve += t.amount;
    }

    const recentTransactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: 20,
      include: { mission: { include: { event: true } } },
    });

    const monthlyRevenue = Object.entries(monthlyMap)
      .sort()
      .map(([month, amount]) => ({ month, amount }));

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
