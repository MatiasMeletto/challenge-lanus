"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/ui/BottomNav";

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
  const [copied, setCopied] = useState(false);

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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleCopyId = () => {
    if (!movement) return;
    navigator.clipboard.writeText(movement.id.slice(-8).toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-[100px] md:pb-12 md:pl-64 flex items-center justify-center">
        <BottomNav />
        <div className="w-10 h-10 border-4 border-granate/20 border-t-granate rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movement) {
    return (
      <div className="min-h-screen bg-background pb-[100px] md:pb-12 md:pl-64 flex flex-col items-center justify-center gap-4 px-6">
        <BottomNav />
        <p className="text-red-500 font-medium">{error || "Ocurrió un error"}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-granate text-white rounded-xl font-medium shadow-sm hover:bg-[#631522] transition-colors cursor-pointer"
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

  const typeLabel = isSus
    ? "Débito automático / Suscripción"
    : isCashIn
    ? "Transferencia recibida"
    : "Transferencia enviada";

  return (
    <div className="min-h-screen bg-background pb-[100px] md:pb-12 md:pl-64">
      <BottomNav />

      <div className="max-w-md mx-auto md:max-w-2xl px-6 pt-10 md:px-10 md:pt-12">
        {/* Header con boton Back */}
        <header className="pb-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Volver"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-[0px_8px_30px_rgba(0,0,0,0.06)] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#334154" />
            </svg>
          </button>
          <h1 className="text-text-main text-[20px] md:text-2xl font-medium">
            Detalle del movimiento
          </h1>
        </header>

        {/* Tarjeta de Comprobante */}
        <main className="bg-white rounded-[24px] shadow-[0px_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8 flex flex-col items-center">
          {/* Ícono grande */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
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
            className={`text-3xl sm:text-4xl font-semibold mb-1 tracking-tight ${
              isSus ? "text-sus" : isCashIn ? "text-cash-in" : "text-cash-out"
            }`}
          >
            ${movement.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-text-main text-lg font-medium text-center">
            {movement.title}
          </span>
          <span className="text-text-muted text-sm font-normal text-center mb-6">
            {movement.description}
          </span>

          {/* Detalles de la operación */}
          <div className="w-full flex flex-col gap-4 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm font-normal">Estado</span>
              <span className="text-emerald-700 text-xs font-medium bg-emerald-50 px-3 py-1 rounded-full">
                Completado
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm font-normal">Tipo de operación</span>
              <span className="text-text-secondary text-sm font-medium">{typeLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm font-normal">Fecha y hora</span>
              <span className="text-text-secondary text-sm font-medium">{date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm font-normal">Código de operación</span>
              <span className="text-text-secondary text-sm font-mono font-medium uppercase">
                #{movement.id.slice(-8)}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="w-full mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex-1 h-[54px] bg-gray-100 text-text-main rounded-2xl font-medium text-sm flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {copied ? "¡Código copiado!" : "Copiar código"}
            </button>
            <Link
              href="/movimientos"
              className="flex-1 h-[54px] bg-granate text-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] font-medium text-sm flex items-center justify-center hover:bg-[#631522] transition-colors"
            >
              Ver todos los movimientos
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}