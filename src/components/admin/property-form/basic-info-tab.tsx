"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyFormSection from "@/components/admin/property-form/property-form-section";
import type { PropertyFormData } from "@/components/admin/property-form/property-form";

interface BasicInfoTabProps {
  formData: PropertyFormData;
  onChange: (
    section: keyof PropertyFormData,
    field: string,
    value: unknown
  ) => void;
  errors: Record<string, string>;
}

export default function BasicInfoTab({
  formData,
  onChange,
  errors,
}: BasicInfoTabProps) {
  const propertyTypes = [
    { value: "apartamento", label: "Apartamento" },
    { value: "casa", label: "Casa" },
    { value: "chalet", label: "Chalet" },
    { value: "duplex", label: "Dúplex" },
    { value: "atico", label: "Ático" },
    { value: "estudio", label: "Estudio" },
    { value: "local", label: "Local comercial" },
    { value: "oficina", label: "Oficina" },
    { value: "terreno", label: "Terreno" },
  ];

  return (
    <div className="space-y-8">
      <PropertyFormSection
        title="Información general"
        description="Introduce los datos básicos de la propiedad"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onChange("title", "title", e.target.value)}
              placeholder="Ej: Apartamento de lujo con vistas al mar"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                onChange("description", "description", e.target.value)
              }
              placeholder="Describe la propiedad con detalle..."
              className={`min-h-[80px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>
      </PropertyFormSection>

      <PropertyFormSection
        title="Tipo y precio"
        description="Selecciona el tipo de operación y establece el precio"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Tipo de operación <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.operationType}
              onValueChange={(value) =>
                onChange("operationType", "operationType", value)
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="venta" id="venta" />
                <Label htmlFor="venta" className="font-normal">
                  Venta
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alquiler" id="alquiler" />
                <Label htmlFor="alquiler" className="font-normal">
                  Alquiler
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Precio <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => onChange("price", "price", e.target.value)}
                placeholder={
                  formData.operationType === "venta" ? "Ej: 250000" : "Ej: 800"
                }
                className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                €
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {formData.operationType === "alquiler" ? "/mes" : ""}
              </span>
            </div>
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">
              Tipo de propiedad <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                onChange("propertyType", "propertyType", value)
              }
            >
              <SelectTrigger
                id="propertyType"
                className={errors.propertyType ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyType && (
              <p className="text-sm text-red-500">{errors.propertyType}</p>
            )}
          </div>
        </div>
      </PropertyFormSection>
    </div>
  );
}
