"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PropertyFormAdapter from "@/components/admin/property-form/property-form-adapter";

export default function EditPropertyPage() {
  // Obtener los parámetros de la ruta
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

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
          <h1 className="text-3xl font-bold tracking-tight">
            Editar propiedad
          </h1>
        </div>
      </div>

      <PropertyFormAdapter propertyId={id} />
    </div>
  );
}
