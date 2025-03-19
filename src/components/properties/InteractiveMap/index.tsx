"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  School,
  Hospital,
  TreesIcon as Tree,
  ShoppingBag,
  Train,
} from "lucide-react";

// Sample properties data with real images
const mapProperties = [
  {
    id: "prop1",
    title: "Apartamento de lujo con vistas al mar",
    price: 450000,
    location: "Paseo Marítimo, Málaga",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=120&h=80&auto=format&fit=crop",
    type: "venta",
    position: { top: "30%", left: "20%" },
  },
  {
    id: "prop2",
    title: "Casa adosada con jardín privado",
    price: 320000,
    location: "Urbanización Los Pinos, Marbella",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=120&h=80&auto=format&fit=crop",
    type: "venta",
    position: { top: "45%", left: "35%" },
  },
  {
    id: "prop3",
    title: "Ático dúplex con terraza panorámica",
    price: 550000,
    location: "Centro Histórico, Sevilla",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=120&h=80&auto=format&fit=crop",
    type: "venta",
    position: { top: "60%", left: "15%" },
  },
  {
    id: "prop4",
    title: "Piso reformado en zona exclusiva",
    price: 280000,
    location: "Barrio Salamanca, Madrid",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=120&h=80&auto=format&fit=crop",
    type: "venta",
    position: { top: "25%", left: "65%" },
  },
  {
    id: "prop5",
    title: "Villa de lujo con piscina privada",
    price: 890000,
    location: "La Zagaleta, Marbella",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=120&h=80&auto=format&fit=crop",
    type: "venta",
    position: { top: "70%", left: "40%" },
  },
];

const pointsOfInterest = [
  {
    id: "school",
    label: "Escuelas",
    icon: <School className="h-4 w-4 mr-2" />,
  },
  {
    id: "hospital",
    label: "Hospitales",
    icon: <Hospital className="h-4 w-4 mr-2" />,
  },
  { id: "park", label: "Parques", icon: <Tree className="h-4 w-4 mr-2" /> },
  {
    id: "shopping",
    label: "Comercios",
    icon: <ShoppingBag className="h-4 w-4 mr-2" />,
  },
  {
    id: "transport",
    label: "Transporte",
    icon: <Train className="h-4 w-4 mr-2" />,
  },
];

export default function InteractiveMap() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedProperty(propertyId === selectedProperty ? null : propertyId);
  };

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Mapa Interactivo
          </h2>
          <p className="text-gray-500 mt-1">
            Explora propiedades y puntos de interés en el mapa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters and Property List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Points of Interest Filters */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-3">Puntos de interés</h3>
              <div className="space-y-2">
                {pointsOfInterest.map((poi) => (
                  <div key={poi.id} className="flex items-center">
                    <Checkbox
                      id={`filter-${poi.id}`}
                      checked={activeFilters.includes(poi.id)}
                      onCheckedChange={() => toggleFilter(poi.id)}
                    />
                    <label
                      htmlFor={`filter-${poi.id}`}
                      className="ml-2 text-sm font-medium flex items-center cursor-pointer"
                    >
                      {poi.icon}
                      {poi.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Properties in View */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-3">Propiedades en vista</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {mapProperties.map((property) => (
                  <div
                    key={property.id}
                    className={`flex p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedProperty === property.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <div className="relative h-16 w-24 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {property.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {property.location}
                      </p>
                      <p className="text-sm font-bold">
                        {property.price.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div
            className="lg:col-span-2 relative bg-gray-100 rounded-lg overflow-hidden border shadow-sm"
            style={{ height: "600px" }}
          >
            {/* Map background with city/property view */}
            <div className="relative w-full h-full bg-blue-50">
              <Image
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&h=600&auto=format&fit=crop&saturation=-50&brightness=95"
                alt="Mapa interactivo"
                fill
                className="object-cover opacity-60"
              />

              {/* Property markers */}
              {mapProperties.map((property) => (
                <div
                  key={property.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    selectedProperty === property.id
                      ? "z-20 scale-125"
                      : "z-10 hover:scale-110"
                  }`}
                  style={{
                    top: property.position.top,
                    left: property.position.left,
                  }}
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      selectedProperty === property.id
                        ? "bg-blue-800"
                        : "bg-blue-600"
                    } text-white shadow-md`}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>

                  {/* Property popup on hover/select */}
                  {selectedProperty === property.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 bg-white rounded-lg shadow-lg p-2 z-30">
                      <div className="relative h-24 w-full mb-2 rounded overflow-hidden">
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="text-sm font-medium line-clamp-1">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {property.location}
                      </p>
                      <p className="text-sm font-bold">
                        {property.price.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-blue-800 hover:bg-blue-900 text-xs"
                      >
                        Ver detalles
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Points of interest markers (only show if filter is active) */}
              {activeFilters.includes("school") && (
                <div className="absolute top-40% left-25% z-10">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-amber-500 text-white shadow-md">
                    <School className="h-4 w-4" />
                  </div>
                </div>
              )}

              {activeFilters.includes("hospital") && (
                <div className="absolute top-55% left-60% z-10">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-red-500 text-white shadow-md">
                    <Hospital className="h-4 w-4" />
                  </div>
                </div>
              )}

              {activeFilters.includes("park") && (
                <div className="absolute top-35% left-45% z-10">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-green-500 text-white shadow-md">
                    <Tree className="h-4 w-4" />
                  </div>
                </div>
              )}

              {activeFilters.includes("shopping") && (
                <div className="absolute top-50% left-30% z-10">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-purple-500 text-white shadow-md">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </div>
              )}

              {activeFilters.includes("transport") && (
                <div className="absolute top-65% left-50% z-10">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-blue-500 text-white shadow-md">
                    <Train className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
