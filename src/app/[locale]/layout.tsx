import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers/auth-provider";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visitae | Plataforma Inmobiliaria",
  description: "Encuentra la propiedad de tus sueños con Visitae",
};

type ParamsType = Promise<{ locale: string }>;

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: ParamsType;
}) {
  const { locale } = await props.params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {props.children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
