"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Card, Movement } from "@prisma/client";
import BankCard from "@/components/ui/BankCard";
import MovementItem from "@/components/ui/MovementItem";
import BottomNav from "@/components/ui/BottomNav";

interface DashboardData {
  user: { name: string };
  cards: Card[];
  recentMovements: Movement[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Error al cargar los datos");
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const displayName = data?.user.name.replace(/^Usuario\s+/i, "") || "Granate";

  return (
    <div className="min-h-screen bg-background pb-[100px] md:pb-12 md:pl-64">
      <BottomNav />

      <div className="max-w-md mx-auto md:max-w-6xl px-6 pt-10 md:px-10 md:pt-12">
        {/* Header Superior */}
        <header className=" pb-6 md:pb-10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-text-muted text-sm font-medium">Hola</span>
            <h1 className="text-text-main text-[20px] md:text-2xl font-semibold leading-tight">
              {loading ? (
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                displayName
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/movimientos"
              aria-label="Buscar movimientos"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-[0px_8px_30px_rgba(0,0,0,0.06)] hover:bg-gray-50 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="#334154"
                />
              </svg>
            </Link>

            <button
              type="button"
              aria-label="Notificaciones"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-[0px_8px_30px_rgba(0,0,0,0.06)] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z"
                  fill="#334154"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Layout principal: 1 columna en mobile, 12 columnas en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Seccion de Tarjetas */}
          <section className="lg:col-span-5">
            <h2 className="hidden lg:block text-text-main text-[20px] font-medium mb-4">
              Mis tarjetas
            </h2>
            <div className="flex overflow-x-auto lg:flex-col gap-4 snap-x snap-mandatory hide-scrollbar pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
              {loading ? (
                <>
                  <div className="w-[310px] lg:w-full h-[220px] bg-gray-200 animate-pulse rounded-[24px] shrink-0"></div>
                  <div className="hidden lg:block w-full h-[220px] bg-gray-200 animate-pulse rounded-[24px] shrink-0"></div>
                </>
              ) : (
                data?.cards.map((card) => (
                  <div key={card.id} className="w-[310px] lg:w-full snap-center shrink-0">
                    <BankCard
                      balance={card.balance}
                      lastFour={card.lastFour}
                      expiry={card.expiry}
                      issuer={card.issuer}
                    />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Seccion de Ultimos Movimientos */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-text-main text-[20px] font-medium">Últimos movimientos</h2>
              <Link
                href="/movimientos"
                className="text-granate text-sm font-medium hover:underline flex items-center gap-1"
              >
                <span>Ver todos</span>
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full h-[92px] bg-gray-200/70 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm text-center py-6 bg-white rounded-2xl">{error}</p>
            ) : data?.recentMovements.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-6 bg-white rounded-2xl">
                No hay movimientos recientes.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {data?.recentMovements.map((movement) => (
                  <Link key={movement.id} href={`/movimientos/${movement.id}`}>
                    <MovementItem
                      title={movement.title}
                      description={movement.description}
                      amount={movement.amount}
                      type={movement.type as "SUS" | "CASH_IN" | "CASH_OUT"}
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}