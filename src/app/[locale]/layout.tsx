import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visitae | Plataforma Inmobiliaria",
  description: "Encuentra la propiedad de tus sueños con Visitae",
};

type ParamsType = Promise<{ locale: string }>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: ParamsType;
}) {
  // Awaiting the params Promise
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
