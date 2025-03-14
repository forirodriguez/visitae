"use client";

import type React from "react";

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
import type { PropertyFormData } from "./property-form";

interface AdvancedTabProps {
  formData: PropertyFormData;
  onChange: (
    section: keyof PropertyFormData,
    field: string,
    value: unknown
  ) => void;
  errors: Record<string, string>;
}

export default function AdvancedTab({ formData, onChange }: AdvancedTabProps) {
  const statusOptions = [
    { value: "borrador", label: "Borrador" },
    { value: "publicada", label: "Publicada" },
    { value: "destacada", label: "Destacada" },
    { value: "inactiva", label: "Inactiva" },
  ];

  const visibilityOptions = [
    { value: "publica", label: "Pública" },
    { value: "privada", label: "Privada" },
  ];

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(
      "tags",
      "tags",
      value.split(",").map((tag) => tag.trim())
    );
  };

  return (
    <div className="space-y-8">
      <PropertyFormSection
        title="Estado y visibilidad"
        description="Configura el estado y la visibilidad de la propiedad"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onChange("status", "status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                onChange("isFeatured", "isFeatured", checked === true)
              }
            />
            <Label htmlFor="isFeatured" className="font-normal">
              Destacada
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishDate">Fecha de publicación</Label>
            <Input
              id="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={(e) =>
                onChange("publishDate", "publishDate", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidad</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value) =>
                onChange("visibility", "visibility", value)
              }
            >
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Selecciona la visibilidad" />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PropertyFormSection>

      <PropertyFormSection
        title="Etiquetas"
        description="Añade etiquetas para mejorar la búsqueda"
      >
        <div className="space-y-2">
          <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
          <Input
            id="tags"
            value={formData.tags.join(", ")}
            onChange={handleTagChange}
            placeholder="Ej: lujo, vistas, nuevo"
          />
        </div>
      </PropertyFormSection>
    </div>
  );
}
