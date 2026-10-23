import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  filter: z.enum(["todos", "debito", "recibido", "enviado"]).optional().default("todos"),
});

export async function GET(request: Request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      q: searchParams.get("q") ?? undefined,
      filter: searchParams.get("filter") ?? undefined,
    });

    const query = parsed.success ? parsed.data.q : "";
    const filter = parsed.success ? parsed.data.filter : "todos";

    const typeMap: Record<string, string | undefined> = {
      todos: undefined,
      debito: "SUS",
      recibido: "CASH_IN",
      enviado: "CASH_OUT",
    };
    const typeFilter = typeMap[filter];

    const movements = await prisma.movement.findMany({
      where: {
        userId,
        title: { contains: query, mode: "insensitive" },
        ...(typeFilter ? { type: typeFilter } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ movements }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}