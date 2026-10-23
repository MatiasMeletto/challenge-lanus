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
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchMovements = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/movements?q=${encodeURIComponent(search)}&filter=${encodeURIComponent(filter)}`
        );
        if (!res.ok) throw new Error("No se pudieron cargar los movimientos");
        const data = await res.json();
        setMovements(data.movements);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado");
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
    <div className="min-h-screen bg-background pb-[100px] md:pb-12 md:pl-64">
      <BottomNav />

      <div className="max-w-md mx-auto md:max-w-6xl px-6 pt-10 md:px-10 md:pt-12">
        {/* Header */}
        <header className="pb-6 md:pb-8 flex items-center justify-between">
          <h1 className="text-text-main text-[20px] md:text-2xl font-medium">Movimientos</h1>
        </header>

        {/* Controles: Buscador y Filtros */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
          {/* Buscador */}
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="#AAAAAA"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Ingresa un nombre o servicio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[60px] pl-12 pr-10 bg-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] text-xs sm:text-sm font-medium outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-granate/50 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute inset-y-0 right-4 flex items-center text-text-muted hover:text-text-main cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex overflow-x-auto gap-2.5 hide-scrollbar pb-2 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`h-[41px] px-5 rounded-2xl whitespace-nowrap text-sm font-medium transition-colors shadow-[0px_8px_30px_rgba(0,0,0,0.06)] shrink-0 cursor-pointer ${
                  filter === f.id
                    ? "bg-granate text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Movimientos */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full h-[92px] bg-gray-200/70 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-[0px_8px_30px_rgba(0,0,0,0.06)]">
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </div>
        ) : movements.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0px_8px_30px_rgba(0,0,0,0.06)]">
            <p className="text-text-secondary text-base font-medium mb-1">
              No se encontraron movimientos
            </p>
            <p className="text-text-muted text-xs">
              Probá buscando con otro nombre o cambiando el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {movements.map((movement) => (
              <Link key={movement.id} href={`/movimientos/${movement.id}`}>
                <MovementItem
                  title={movement.title}
                  description={movement.description}
                  amount={movement.amount}
                  type={movement.type}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}