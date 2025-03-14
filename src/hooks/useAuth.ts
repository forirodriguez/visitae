"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { AdminRole, ROLE_PERMISSIONS } from "@/types/admin";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        return { success: false, error: "Credenciales incorrectas" };
      }

      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false, error: "Error al iniciar sesión" };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push(`/${locale}/auth/login`);
  };

  // Obtener permisos basados en el rol
  const permissions = session?.user?.role
    ? ROLE_PERMISSIONS[session.user.role as AdminRole] || []
    : [];

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return permissions.includes(permission as any);
  };

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout,
    permissions,
    hasPermission,
  };
}
