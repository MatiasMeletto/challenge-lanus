"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al iniciar sesión");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
        const err = error as { message?: string };
        setError(err.message || "Error al iniciar sesión");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[414px] flex flex-col items-center relative pb-10">
        
        {/* App Logo */}
        <div className="flex flex-col items-center gap-3 mb-[76px] mt-10">
          <div className="w-12 h-12 bg-granate rounded-xl flex items-center justify-center">
            <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
          </div>
          <h1 className="text-granate text-[40px] leading-[60px] font-medium tracking-tight">
            GranaBank
          </h1>
          <p className="text-[#717E95] text-base font-normal text-center">
            Con cada compra, sumás orgullo granate
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-[28px]">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-text-main text-base font-medium ml-2">Email</label>
            <input
              type="email"
              required
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[54px] px-6 bg-white rounded-xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] text-sm outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-granate/50 transition-all"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-2">
            <label className="text-text-main text-base font-medium ml-2">Contraseña</label>
            <input
              type="password"
              required
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[54px] px-6 bg-white rounded-xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] text-sm outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-granate/50 transition-all"
            />
          </div>

          {/* Recordarme */}
          <div className="flex items-center gap-3 ml-2 mt-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded-[4px] border-gray-300 accent-granate cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-text-muted text-sm font-medium cursor-pointer">
              Recordarme
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          {/* Boton Ingresar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[60px] mt-[48px] bg-granate text-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] font-semibold text-base flex items-center justify-center hover:bg-[#631522] transition-colors disabled:opacity-70"
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
}