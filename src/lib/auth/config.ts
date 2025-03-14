// src/lib/auth/config.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { AdminRole } from "@/types/admin";

// Mock de usuarios para desarrollo (en producción, usa una base de datos)
const ADMIN_USERS = [
  {
    id: "1",
    email: "admin@visitae.com",
    name: "Administrador",
    role: "admin" as AdminRole,
    // Contraseña: admin123 (sin hashear para desarrollo)
    password: "admin123",
  },
  {
    id: "2",
    email: "super@visitae.com",
    name: "Super Admin",
    role: "superadmin" as AdminRole,
    // Contraseña: super123 (sin hashear para desarrollo)
    password: "super123",
  },
];

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Buscar usuario (desde el array mock)
        const user = ADMIN_USERS.find((u) => u.email === credentials.email);

        if (!user) {
          return null;
        }

        // Para desarrollo, comparación simple de contraseñas (sin bcrypt)
        const passwordMatch = user.password === credentials.password;

        if (!passwordMatch) {
          return null;
        }

        // No enviar la contraseña al cliente
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Quitamos el prefijo /es/ - el middleware se encargará
    error: "/auth/error", // Quitamos el prefijo /es/ - el middleware se encargará
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Incluir información adicional en el token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Añadir información del token a la sesión
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AdminRole;
      }
      return session;
    },
    // Callback de redirección corregido
    redirect: ({ url, baseUrl }) => {
      // Si la URL comienza con la URL base, es válida
      if (url.startsWith(baseUrl)) return url;

      // Redirecciones a rutas relativas
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // URLs externas (mantener como están)
      if (url.startsWith("http")) return url;

      // Por defecto, redirigir al dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET || "tu-secreto-para-desarrollo",
  debug: process.env.NODE_ENV === "development",
};
