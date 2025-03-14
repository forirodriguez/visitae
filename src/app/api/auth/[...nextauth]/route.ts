// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
/* import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"; */
import { authConfig } from "@/lib/auth/config";

// Handler para la API de autenticación
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
