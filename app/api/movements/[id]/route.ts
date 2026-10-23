import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSession();
    if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    const movement = await prisma.movement.findFirst({
      where: { id, userId },
    });

    if (!movement) {
      return NextResponse.json({ error: "Movimiento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ movement }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string; status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}