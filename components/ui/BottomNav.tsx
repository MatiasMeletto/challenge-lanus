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

  return (
    <div className="fixed bottom-0 left-0 w-full h-[86px] bg-white rounded-t-[24px] shadow-[0px_-8px_30px_rgba(0,0,0,0.06)] flex items-center justify-around px-8 z-50 md:hidden">
      
      {/* Icono Home */}
      <Link href="/">
        <div className="p-2 flex items-center justify-center">
          <svg width="27" height="29" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" 
              fill={pathname === "/" ? "#7A1D2D" : "#000000"} 
            />
          </svg>
        </div>
      </Link>

      {/* Icono Movimientos (Document) */}
      <Link href="/movimientos">
        <div className="p-2 flex items-center justify-center">
          <svg width="27" height="31" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 14H16V16H8V14ZM8 18H13V20H8V18ZM8 10H16V12H8V10Z" 
              fill={pathname === "/movimientos" ? "#7A1D2D" : "#000000"} 
            />
          </svg>
        </div>
      </Link>

      {/* Icono Logout */}
      <button onClick={handleLogout} className="p-2 flex items-center justify-center">
        <svg width="33" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" 
            fill="#000000" 
          />
        </svg>
      </button>

    </div>
  );
}