"use client";

import { useFilteredProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/properties/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function PropertiesPage() {
  // Estado para el formulario
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<"venta" | "alquiler" | "">("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  // Hook con filtros
  const { properties, loading, error, updateFilters } = useFilteredProperties();

  const handleSearch = () => {
    updateFilters({
      keyword,
      type: type === "" ? undefined : type,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Búsqueda de propiedades</h1>

      {/* Formulario de búsqueda */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Buscar por ubicación o título"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <Select
            value={type}
            onValueChange={(value) =>
              setType(value as "venta" | "alquiler" | "")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>{" "}
              <SelectItem value="venta">Venta</SelectItem>
              <SelectItem value="alquiler">Alquiler</SelectItem>
            </SelectContent>
          </Select>
          <div className="md:col-span-2">
            <div className="flex justify-between text-sm mb-2">
              <span>
                Precio: €{priceRange[0].toLocaleString()} - €
                {priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              defaultValue={[0, 1000000]}
              max={2000000}
              step={10000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </div>
        </div>

        <Button onClick={handleSearch} className="w-full md:w-auto">
          Buscar
        </Button>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-10">Cargando propiedades...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-10">
          No se encontraron propiedades con estos filtros
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
