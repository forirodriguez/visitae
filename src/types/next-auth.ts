// src/types/next-auth.d.ts
import "next-auth";
import { AdminRole } from "./admin";

declare module "next-auth" {
  /**
   * Extiende la interfaz User de next-auth para incluir campos adicionales
   */
  interface User {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    avatarUrl?: string;
  }

  /**
   * Extiende la interfaz Session de next-auth para incluir campos adicionales
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: AdminRole;
      avatarUrl?: string;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende la interfaz JWT de next-auth para incluir campos adicionales
   */
  interface JWT {
    id: string;
    role: AdminRole;
    avatarUrl?: string;
  }
}
