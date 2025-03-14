// src/app/[locale]/(auth)/layout.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

type ParamsType = Promise<{ locale: string }>;

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: ParamsType;
}) {
  const { locale } = await props.params;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Lado izquierdo - Formulario */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center mb-8">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Visitae Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                Visitae
              </span>
            </Link>
          </div>
          {props.children}
        </div>
      </div>

      {/* Lado derecho - Imagen decorativa */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-800 to-blue-600">
          <div className="flex h-full items-center justify-center p-12">
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-white mb-6">
                Encuentra tu hogar ideal
              </h2>
              <p className="text-xl text-blue-100">
                Plataforma inmobiliaria que conecta compradores y agentes en
                tiempo real. Agenda visitas con un solo clic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
