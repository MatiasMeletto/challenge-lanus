"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isHome = pathname === "/";
  const isMovimientos = pathname.startsWith("/movimientos");

  return (
    <>
      {/* Barra inferior Mobile (< 768px) */}
      <nav className="fixed bottom-0 left-0 w-full h-[86px] bg-white rounded-t-[24px] shadow-[0px_-8px_30px_rgba(0,0,0,0.06)] flex items-center justify-around px-8 z-50 md:hidden">
        <Link href="/" className="p-2 flex items-center justify-center" aria-label="Inicio">
          <svg width="27" height="29" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z"
              fill={isHome ? "#7A1D2D" : "#000000"}
            />
          </svg>
        </Link>

        <Link href="/movimientos" className="p-2 flex items-center justify-center" aria-label="Movimientos">
          <svg width="27" height="31" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 14H16V16H8V14ZM8 18H13V20H8V18ZM8 10H16V12H8V10Z"
              fill={isMovimientos ? "#7A1D2D" : "#000000"}
            />
          </svg>
        </Link>

        <button onClick={handleLogout} className="p-2 flex items-center justify-center cursor-pointer" aria-label="Cerrar sesión">
          <svg width="33" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
              fill="#000000"
            />
          </svg>
        </button>
      </nav>

      {/* Sidebar lateral Desktop (>= 768px) */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 bg-white shadow-[8px_0px_30px_rgba(0,0,0,0.04)] px-6 py-8 justify-between z-40">
        <div className="flex flex-col gap-10">
          <Link href="/" className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-granate rounded-xl flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 bg-white/20 rounded-sm"></div>
            </div>
            <span className="text-granate text-2xl font-medium tracking-tight">GranaBank</span>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-colors ${
                isHome
                  ? "bg-granate text-white shadow-[0px_8px_30px_rgba(0,0,0,0.06)]"
                  : "text-text-secondary hover:bg-gray-100"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" fill="currentColor" />
              </svg>
              <span>Inicio</span>
            </Link>

            <Link
              href="/movimientos"
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-colors ${
                isMovimientos
                  ? "bg-granate text-white shadow-[0px_8px_30px_rgba(0,0,0,0.06)]"
                  : "text-text-secondary hover:bg-gray-100"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 14H16V16H8V14ZM8 18H13V20H8V18ZM8 10H16V12H8V10Z"
                  fill="currentColor"
                />
              </svg>
              <span>Movimientos</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-granate transition-colors cursor-pointer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
              fill="currentColor"
            />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </aside>
    </>
  );
}