import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/", "/movimientos"];
const publicRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith("/movimientos/")
  );
  const isPublicRoute = publicRoutes.includes(path);

  const token = request.cookies.get("session")?.value;
  const session = token ? await decrypt(token) : null;

  if (isProtectedRoute && !session?.userId) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (token) response.cookies.delete("session");
    return response;
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};