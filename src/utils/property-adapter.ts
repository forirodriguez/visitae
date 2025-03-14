import { PropertyFormData } from "@/components/admin/property-form/property-form";
import { Property } from "@/types/property";

export function formDataToProperty(formData: PropertyFormData): Property {
  // Generar un ID único para la propiedad (en caso de ser nueva)
  const id = Math.random().toString(36).substring(2, 15);

  return {
    id: id,
    title: formData.title,
    description: formData.description,
    price: parseFloat(formData.price) || 0,
    type: formData.operationType,
    propertyType: formData.propertyType,
    location: `${formData.neighborhood ? formData.neighborhood + ", " : ""}${formData.city}`,
    address: formData.address,
    bedrooms: parseInt(formData.bedrooms) || 0,
    bathrooms: parseInt(formData.bathrooms) || 0,
    area: parseInt(formData.squareMetersBuilt) || 0,
    image:
      formData.images.length > 0
        ? formData.images.find((img) => img.isPrimary)?.url ||
          formData.images[0].url
        : "/placeholder.svg",
    features: formData.features,
    isNew:
      new Date(formData.publishDate).getTime() >
      Date.now() - 30 * 24 * 60 * 60 * 1000, // Considera nueva si se publicó en los últimos 30 días
    isFeatured: formData.isFeatured,
    status: formData.status,
  };
}
