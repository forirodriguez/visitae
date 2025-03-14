"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bed, Bath, Square, MapPin } from "lucide-react";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const params = useParams();
  const locale = params.locale as string;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita la navegación al hacer clic en el botón
    const newState = !isFavorite;
    setIsFavorite(newState);

    // Guardar en localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (newState) {
      if (!favorites.includes(property.id)) {
        favorites.push(property.id);
      }
    } else {
      const updatedFavorites = favorites.filter(
        (id: string) => id !== property.id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  return (
    <Link href={`/${locale}/propiedades/${property.id}`} className="block">
      <div className="group relative bg-white rounded-xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col">
        {/* Imagen */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge
              className={
                property.type === "venta" ? "bg-blue-800" : "bg-teal-700"
              }
            >
              {property.type === "venta" ? "Venta" : "Alquiler"}
            </Badge>
            {property.isNew && <Badge className="bg-amber-600">Nueva</Badge>}
          </div>

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center transition-colors hover:bg-white"
            aria-label={
              isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2 flex-1">
            <div className="text-xl font-bold text-gray-900">
              {property.price.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
            <h3 className="font-medium text-gray-800 line-clamp-1">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          </div>

          <Button className="w-full bg-blue-800 hover:bg-blue-900">
            Agendar visita
          </Button>
        </div>
      </div>
    </Link>
  );
}
