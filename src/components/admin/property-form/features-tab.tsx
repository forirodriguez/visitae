"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyFormSection from "@/components/admin/property-form/property-form-section";
import type { PropertyFormData } from "@/components/admin/property-form/property-form";

interface FeaturesTabProps {
  formData: PropertyFormData;
  onChange: (
    section: keyof PropertyFormData,
    field: string,
    value: unknown
  ) => void;
  errors: Record<string, string>;
}

export default function FeaturesTab({
  formData,
  onChange,
  errors,
}: FeaturesTabProps) {
  const availableFeatures = [
    { id: "terraza", label: "Terraza" },
    { id: "balcon", label: "Balcón" },
    { id: "piscina", label: "Piscina" },
    { id: "jardin", label: "Jardín" },
    { id: "ascensor", label: "Ascensor" },
    { id: "aire_acondicionado", label: "Aire acondicionado" },
    { id: "calefaccion", label: "Calefacción" },
    { id: "amueblado", label: "Amueblado" },
    { id: "trastero", label: "Trastero" },
    { id: "seguridad", label: "Seguridad" },
    { id: "armarios_empotrados", label: "Armarios empotrados" },
    { id: "cocina_equipada", label: "Cocina equipada" },
  ];

  const energyRatings = ["A", "B", "C", "D", "E", "F", "G", "En trámite"];

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.features, featureId]
      : formData.features.filter((id) => id !== featureId);

    onChange("features", "features", updatedFeatures);
  };

  return (
    <div className="space-y-8">
      <PropertyFormSection
        title="Detalles básicos"
        description="Introduce las características principales de la propiedad"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">
              Dormitorios <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={(e) => onChange("bedrooms", "bedrooms", e.target.value)}
              placeholder="Ej: 3"
              className={errors.bedrooms ? "border-red-500" : ""}
            />
            {errors.bedrooms && (
              <p className="text-sm text-red-500">{errors.bedrooms}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">
              Baños <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              value={formData.bathrooms}
              onChange={(e) =>
                onChange("bathrooms", "bathrooms", e.target.value)
              }
              placeholder="Ej: 2"
              className={errors.bathrooms ? "border-red-500" : ""}
            />
            {errors.bathrooms && (
              <p className="text-sm text-red-500">{errors.bathrooms}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkingSpaces">Plazas de garaje</Label>
            <Input
              id="parkingSpaces"
              type="number"
              min="0"
              value={formData.parkingSpaces}
              onChange={(e) =>
                onChange("parkingSpaces", "parkingSpaces", e.target.value)
              }
              placeholder="Ej: 1"
            />
          </div>
        </div>
      </PropertyFormSection>

      <PropertyFormSection
        title="Superficie"
        description="Indica los metros cuadrados de la propiedad"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="squareMetersBuilt">
              Metros cuadrados construidos{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="squareMetersBuilt"
                type="number"
                min="0"
                value={formData.squareMetersBuilt}
                onChange={(e) =>
                  onChange(
                    "squareMetersBuilt",
                    "squareMetersBuilt",
                    e.target.value
                  )
                }
                placeholder="Ej: 120"
                className={`pr-8 ${errors.squareMetersBuilt ? "border-red-500" : ""}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                m²
              </span>
            </div>
            {errors.squareMetersBuilt && (
              <p className="text-sm text-red-500">{errors.squareMetersBuilt}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="squareMetersUsable">Metros cuadrados útiles</Label>
            <div className="relative">
              <Input
                id="squareMetersUsable"
                type="number"
                min="0"
                value={formData.squareMetersUsable}
                onChange={(e) =>
                  onChange(
                    "squareMetersUsable",
                    "squareMetersUsable",
                    e.target.value
                  )
                }
                placeholder="Ej: 110"
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                m²
              </span>
            </div>
          </div>
        </div>
      </PropertyFormSection>

      <PropertyFormSection
        title="Año y eficiencia energética"
        description="Información adicional sobre la construcción"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="constructionYear">Año de construcción</Label>
            <Input
              id="constructionYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.constructionYear}
              onChange={(e) =>
                onChange("constructionYear", "constructionYear", e.target.value)
              }
              placeholder="Ej: 2010"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="energyRating">Certificación energética</Label>
            <Select
              value={formData.energyRating}
              onValueChange={(value) =>
                onChange("energyRating", "energyRating", value)
              }
            >
              <SelectTrigger id="energyRating">
                <SelectValue placeholder="Selecciona una calificación" />
              </SelectTrigger>
              <SelectContent>
                {energyRatings.map((rating) => (
                  <SelectItem key={rating} value={rating.toLowerCase()}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PropertyFormSection>

      <PropertyFormSection
        title="Características adicionales"
        description="Selecciona todas las características que apliquen a la propiedad"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={formData.features.includes(feature.id)}
                onCheckedChange={(checked) =>
                  handleFeatureChange(feature.id, checked === true)
                }
              />
              <Label htmlFor={feature.id} className="font-normal">
                {feature.label}
              </Label>
            </div>
          ))}
        </div>
      </PropertyFormSection>
    </div>
  );
}
