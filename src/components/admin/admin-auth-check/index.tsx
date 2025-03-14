//src/components/admin/admin-auth-check/index.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "es";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // En desarrollo, puedes establecer esto en true para saltarte la autenticación
    const isDevelopment = process.env.NODE_ENV === "development";

    // Comprobar si el usuario está autenticado
    const authStatus = localStorage.getItem("isAuthenticated") === "true";

    // Para desarrollo, podemos permitir bypass
    if (isDevelopment) {
      setIsAuthenticated(true);
      if (!authStatus) {
        localStorage.setItem("isAuthenticated", "true");
      }
    } else {
      setIsAuthenticated(authStatus);

      // Redirigir si no está autenticado
      if (!authStatus) {
        router.push(`/${locale}/login`);
      }
    }
  }, [router, locale]);

  // Mostrar un indicador de carga mientras comprobamos la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (la redirección debería ocurrir)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, renderizar los children
  return <>{children}</>;
}
