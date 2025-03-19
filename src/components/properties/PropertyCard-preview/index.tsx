// src/components/properties/PropertyCard-preview.tsx
"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property } from "@/types/property";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Función para formatear el precio
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {property.isNew && (
            <Badge className="bg-blue-600 hover:bg-blue-700">Nuevo</Badge>
          )}
          {property.isFeatured && (
            <Badge className="bg-amber-600 hover:bg-amber-700">Destacado</Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white font-bold text-xl drop-shadow-md">
            {formatPrice(property.price)}
            {property.type === "alquiler" && "/mes"}
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-1">
          {property.title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="truncate">{property.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {property.description}
        </p>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{property.bedrooms} hab.</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{property.bathrooms} baños</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{property.area} m²</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Badge variant={property.type === "venta" ? "default" : "secondary"}>
          {property.type === "venta" ? "Venta" : "Alquiler"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {property.propertyType}
        </span>
      </CardFooter>
    </Card>
  );
}
