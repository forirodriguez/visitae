// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Lista de idiomas disponibles
const locales = ["es", "en"];
// Idioma por defecto
const defaultLocale = "es";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Excluir rutas de API para permitir que NextAuth funcione correctamente
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Verificar si la URL ya incluye un idioma
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Si no incluye un idioma, redirigir a la versión con el idioma predeterminado
  if (!pathnameHasLocale) {
    // Crear una nueva URL con el idioma predeterminado
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    // Conservar los parámetros de búsqueda
    newUrl.search = request.nextUrl.search;

    return NextResponse.redirect(newUrl);
  }

  // A partir de aquí, manejar la autenticación para rutas protegidas

  // Obtener el token de autenticación
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "tu-secreto-para-desarrollo",
  });

  // Extraer el locale actual de la URL
  const locale = pathname.split("/")[1];

  // Verificar si es una ruta protegida
  const isAdminRoute =
    pathname.includes(`/${locale}/account`) ||
    pathname.includes(`/${locale}/dashboard`);

  const isAuthRoute = pathname.includes(`/${locale}/login`);

  // Si es una ruta de admin y no hay token, redirigir a login
  if (isAdminRoute && !token) {
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Si es una ruta de auth y hay token, redirigir a dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return NextResponse.next();
}

// Aplicar el middleware a todas las rutas excepto estáticos
export const config = {
  matcher: [
    // Excluir archivos estáticos, incluir todo lo demás (incluidas las rutas de API)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
