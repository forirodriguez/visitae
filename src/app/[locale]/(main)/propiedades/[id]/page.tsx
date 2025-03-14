"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getPropertyById } from "@/lib/mock-data/properties";
import PropertyDetailView from "@/components/properties/PropertyDetailView";
import type { Property } from "@/types/property";

export default function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getPropertyById(id.toString())
        .then((data) => {
          setProperty(data);
          setLoading(false);
        })
        .catch(() => {
          setError("No se pudo cargar la propiedad.");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="container py-10">
      <Button className="mb-6" onClick={() => window.history.back()}>
        Volver
      </Button>

      {property ? (
        <PropertyDetailView property={property} locale={""} />
      ) : (
        <div className="text-center py-10">Propiedad no encontrada</div>
      )}
    </div>
  );
}
