"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MovementItem from "@/components/ui/MovementItem";
import BottomNav from "@/components/ui/BottomNav";

type MovementType = "SUS" | "CASH_IN" | "CASH_OUT";
interface MovementData {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: MovementType;
}

export default function MovimientosPage() {
  const [movements, setMovements] = useState<MovementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchMovements = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/movements?q=${search}&filter=${filter}`);
        const data = await res.json();
        if (res.ok) {
          setMovements(data.movements);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchMovements();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, filter]);

  const filters = [
    { id: "todos", label: "Todos" },
    { id: "debito", label: "Debito Aut." },
    { id: "recibido", label: "Recibido" },
    { id: "enviado", label: "Enviado" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-[100px] md:pb-0 md:flex-row relative bg-background">
      {/* Contenedor mobile-first centralizado */}
      <div className="w-full max-w-[414px] mx-auto flex flex-col md:border-r md:border-black/5 md:min-h-screen">
        
        {/* Header */}
        <header className="px-6 pt-10 pb-4 flex items-center justify-between">
          <h1 className="text-text-main text-[20px] font-medium">Movimientos</h1>
        </header>

        {/* Buscador */}
        <section className="px-6 mb-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#AAAAAA"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Ingresa un nombre o servicio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[60px] pl-12 pr-4 bg-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] text-sm outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-granate/50 transition-all border-none"
            />
          </div>
        </section>

        {/* Filtros */}
        <section className="pl-6 mb-6">
          <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2 pr-6">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`h-[41px] px-5 rounded-2xl whitespace-nowrap text-sm font-medium transition-colors shadow-[0px_8px_30px_rgba(0,0,0,0.06)] shrink-0 ${
                  filter === f.id
                    ? "bg-granate text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Lista de Movimientos */}
        <section className="px-6 flex-1 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full h-[92px] bg-gray-100 animate-pulse rounded-2xl shrink-0"></div>
            ))
          ) : movements.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-10">No se encontraron movimientos.</p>
          ) : (
            movements.map((movement) => (
              <Link key={movement.id} href={`/movimientos/${movement.id}`}>
                <MovementItem
                  title={movement.title}
                  description={movement.description}
                  amount={movement.amount}
                  type={movement.type}
                />
              </Link>
            ))
          )}
        </section>

        <BottomNav />
      </div>

      {/* Panel lateral en Desktop */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50/50">
        <p className="text-text-muted text-sm font-medium">Historial de movimientos</p>
      </div>
    </div>
  );
}