"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import PropertyFormSection from "@/components/admin/property-form/property-form-section";
import type { PropertyFormData } from "@/components/admin/property-form/property-form";

interface LocationTabProps {
  formData: PropertyFormData;
  onChange: (
    section: keyof PropertyFormData,
    field: string,
    value: unknown
  ) => void;
  errors: Record<string, string>;
}

export default function LocationTab({
  formData,
  onChange,
  errors,
}: LocationTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PropertyFormSection
        title="Dirección"
        description="Introduce la dirección completa de la propiedad"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">
              Dirección <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onChange("address", "address", e.target.value)}
              placeholder="Ej: Calle Principal 123, Piso 4"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                Ciudad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => onChange("city", "city", e.target.value)}
                placeholder="Ej: Madrid"
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Código postal</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) =>
                  onChange("postalCode", "postalCode", e.target.value)
                }
                placeholder="Ej: 28001"
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Barrio / Zona</Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood}
              onChange={(e) =>
                onChange("neighborhood", "neighborhood", e.target.value)
              }
              placeholder="Ej: Centro"
            />
          </div>
        </div>
      </PropertyFormSection>

      <PropertyFormSection
        title="Ubicación en el mapa"
        description="Selecciona la ubicación exacta en el mapa o introduce las coordenadas"
      >
        <div className="space-y-4">
          <div className="relative aspect-video w-full border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* Aquí iría un componente de mapa interactivo real */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mapa interactivo (simulado)
                </p>
                <Button variant="outline" size="sm" onClick={() => {}}>
                  Seleccionar ubicación
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PropertyFormSection>
    </div>
  );
}
