import type { Metadata } from "next";
import PropertyFormAdapter from "@/components/admin/property-form/property-form-adapter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crear propiedad | Panel de Administración Visitae",
  description: "Crear una nueva propiedad en la plataforma Visitae",
};

type PageParams = Promise<{ locale: string }>;

export default async function CreatePropertyPage(props: {
  params: PageParams;
}) {
  // Espera a que se resuelvan los parámetros
  const { locale } = await props.params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard/properties`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Crear propiedad</h1>
        </div>
      </div>

      <PropertyFormAdapter />
    </div>
  );
}
