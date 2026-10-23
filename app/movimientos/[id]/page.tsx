"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type MovementType = "SUS" | "CASH_IN" | "CASH_OUT";

interface MovementDetail {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: MovementType;
  createdAt: string;
}

export default function MovementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [movement, setMovement] = useState<MovementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/movements/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Movimiento no encontrado");
          throw new Error("Error al cargar el detalle");
        }
        const data = await res.json();
        setMovement(data.movement);
      } catch (error) {
        const err = error as { message?: string };
        setError(err.message || "Ocurrió un error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-granate/20 border-t-granate rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movement) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background gap-4">
        <p className="text-red-500 font-medium">{error || "Ocurrió un error"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-granate text-white rounded-xl font-medium shadow-sm hover:bg-[#631522] transition-colors"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  const isSus = movement.type === "SUS";
  const isCashIn = movement.type === "CASH_IN";
  const isCashOut = movement.type === "CASH_OUT";

  const date = new Date(movement.createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col min-h-screen pb-[100px] md:pb-0 md:flex-row relative bg-background">
      {/* Contenedor centralizado */}
      <div className="w-full max-w-[414px] mx-auto flex flex-col md:border-r md:border-black/5 md:min-h-screen bg-white shadow-xl">
        
        {/* Header con boton Back */}
        <header className="px-6 pt-10 pb-4 flex items-center border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors -ml-2 mr-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#334154"/>
            </svg>
          </button>
          <h1 className="text-text-main text-[20px] font-medium">Comprobante</h1>
        </header>

        {/* Tarjeta de Recibo */}
        <main className="p-6 flex flex-col flex-1">
          <div className="flex flex-col items-center bg-gray-50/50 p-8 rounded-[24px] border border-gray-100/50">
            {/* Ícono grande */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
                isSus ? "bg-sus-bg" : isCashIn ? "bg-cash-in-bg" : "bg-cash-out-bg"
              }`}
            >
              {isSus && (
                <svg width="24" height="26" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 5H5.5V15H12.5V5Z" fill="currentColor" className="text-sus" />
                  <path d="M2 2V18H16V2H2ZM14 16H4V4H14V16Z" fill="currentColor" className="text-sus" />
                </svg>
              )}
              {isCashIn && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18L6 10H10V4H14V10H18L12 18Z" fill="currentColor" className="text-cash-in" />
                </svg>
              )}
              {isCashOut && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                  <path d="M12 18L6 10H10V4H14V10H18L12 18Z" fill="currentColor" className="text-cash-out" />
                </svg>
              )}
            </div>

            {/* Monto principal */}
            <span
              className={`text-4xl font-semibold mb-2 tracking-tight ${
                isSus ? "text-sus" : isCashIn ? "text-cash-in" : "text-cash-out"
              }`}
            >
              ${movement.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-text-main text-lg font-medium text-center">
              {movement.title}
            </span>
            <span className="text-text-muted text-sm font-normal text-center mb-8">
              {movement.description}
            </span>

            {/* Detalles de la operación */}
            <div className="w-full flex flex-col gap-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm font-medium">Estado</span>
                <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-md">
                  Completado
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm font-medium">Fecha</span>
                <span className="text-text-main text-sm font-medium">{date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm font-medium">ID de Operación</span>
                <span className="text-text-main text-sm font-medium uppercase font-mono">
                  {movement.id.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <button className="w-full h-[54px] bg-gray-100 text-text-main rounded-xl shadow-sm font-medium text-sm flex items-center justify-center hover:bg-gray-200 transition-colors">
              Compartir comprobante
            </button>
            <Link
              href="/"
              className="w-full h-[54px] bg-granate text-white rounded-xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] font-medium text-sm flex items-center justify-center hover:bg-[#631522] transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
        </main>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50/50">
        <p className="text-text-muted text-sm font-medium">Detalle de Operación</p>
      </div>
    </div>
  );
}