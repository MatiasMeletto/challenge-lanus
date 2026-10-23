import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const cards = await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const recentMovements = await prisma.movement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 4, 
    });

    return NextResponse.json({ user, cards, recentMovements }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string; status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}