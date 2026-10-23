import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const userId = await getSession();
    if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const filter = searchParams.get("filter") || "todos";

    let typeFilter = undefined;
    if (filter === "debito") typeFilter = "SUS";
    if (filter === "recibido") typeFilter = "CASH_IN";
    if (filter === "enviado") typeFilter = "CASH_OUT";

    const movements = await prisma.movement.findMany({
      where: {
        userId,
        title: { contains: query, mode: 'insensitive' },
        ...(typeFilter ? { type: typeFilter } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ movements }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string; status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}