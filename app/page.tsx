"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BankCard from "@/components/ui/BankCard";
import MovementItem from "@/components/ui/MovementItem";
import BottomNav from "@/components/ui/BottomNav";
import { Card, Movement } from "@prisma/client";
import { MovementType } from "@/components/ui/MovementItem";

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
      } catch (error) {
        const err = error as { message?: string };
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-[100px] md:pb-0 md:flex-row relative">
      {/* Contenedor mobile-first centralizado */}
      <div className="w-full max-w-[414px] mx-auto flex flex-col md:border-r md:border-black/5 md:min-h-screen">
        
        {/* Header Superior */}
        <header className="px-6 pt-10 pb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-text-muted text-sm font-medium">Hola</span>
            <h1 className="text-text-main text-[20px] font-semibold leading-tight">
              {loading ? <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mt-1"></div> : data?.user.name}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Lupa redirige a Movimientos */}
            <Link href="/movimientos" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#334154"/>
              </svg>
            </Link>
            {/* Campana */}
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="#334154"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Carrusel de Tarjetas */}
        <section className="px-6 mb-8">
          <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar pb-4 -mx-6 px-6">
            {loading ? (
              <div className="w-[310px] h-[220px] bg-gray-200 animate-pulse rounded-[24px] shrink-0"></div>
            ) : data?.cards.map((card) => (
              <div key={card.id} className="w-[310px] snap-center shrink-0">
                <BankCard
                  balance={card.balance}
                  lastFour={card.lastFour}
                  expiry={card.expiry}
                  issuer={card.issuer}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Ultimos Movimientos */}
        <section className="px-6 flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-text-main text-[20px] font-medium">Últimos movimientos</h2>
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-[92px] bg-gray-100 animate-pulse rounded-2xl"></div>
            ))
          ) : error ? (
            <p className="text-red-500 text-sm text-center py-4">{error}</p>
          ) : data?.recentMovements.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-4">No hay movimientos recientes.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {data?.recentMovements.map((movement) => (
                <Link key={movement.id} href={`/movimientos/${movement.id}`}>
                  <MovementItem
                    title={movement.title}
                    description={movement.description}
                    amount={movement.amount}
                    type={movement.type as MovementType}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Componente NavBar inferior */}
        <BottomNav />
      </div>
      
      {/* Panel lateral en Desktop */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50/50">
        <p className="text-text-muted text-sm font-medium flex flex-col items-center gap-2">
          <span>Versión Desktop</span>
          <span className="text-xs font-normal">Navegá desde el panel izquierdo</span>
        </p>
      </div>

    </div>
  );
}