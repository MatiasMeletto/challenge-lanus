import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteSession, getSession } from "@/lib/session";

export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      await deleteSession();
      return NextResponse.json({ error: "Sesión expirada" }, { status: 401 });
    }

    const [cards, recentMovements] = await Promise.all([
      prisma.card.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.movement.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

    return NextResponse.json({ user, cards, recentMovements }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}