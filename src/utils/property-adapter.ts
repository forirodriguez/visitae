// src/utils/property-adapter.ts
import { PropertyFormData } from "@/components/admin/property-form/property-form";
import { Property } from "@/types/property";

// Define una URL de imagen por defecto para usar cuando no hay imagen disponible
const DEFAULT_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop";

/**
 * Convierte los datos del formulario al formato de Property para la API
 */
export function formDataToProperty(
  formData: PropertyFormData
): Omit<Property, "id"> {
  // Seleccionar la imagen principal o la primera disponible
  // Si no hay imágenes, usar la imagen por defecto
  const mainImage =
    formData.images.find((img) => img.isPrimary)?.url ||
    (formData.images.length > 0
      ? formData.images[0].url
      : DEFAULT_PROPERTY_IMAGE);

  return {
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
    image: mainImage,
    features: formData.features,
    isNew:
      new Date(formData.publishDate).getTime() >
      Date.now() - 30 * 24 * 60 * 60 * 1000, // Considera nueva si se publicó en los últimos 30 días
    isFeatured: formData.isFeatured,
    status: formData.status,
  };
}

/**
 * Versión para previsualización - incluye un ID temporal
 * Esta función se usa solo para la vista previa, no para la API
 */
export function formDataToPropertyPreview(
  formData: PropertyFormData
): Property {
  return {
    id: "preview-id", // ID temporal para previsualización
    ...formDataToProperty(formData),
  };
}

/**
 * Convierte una propiedad al formato del formulario para edición
 */
export function propertyToFormData(property: Property): PropertyFormData {
  // Extraer neighborhood y city de location
  let neighborhood = "";
  let city = property.location;

  if (property.location.includes(",")) {
    const parts = property.location.split(",");
    neighborhood = parts[0].trim();
    city = parts.slice(1).join(",").trim();
  }

  // Asegurar que siempre haya una URL de imagen válida
  const imageUrl = getValidImageUrl(property.image);

  return {
    title: property.title,
    description: property.description,
    price: property.price.toString(),
    operationType: property.type as "venta" | "alquiler",
    propertyType: property.propertyType,

    address: property.address,
    latitude: "", // Estos campos no están en Property, habría que extenderlo
    longitude: "", // o guardarlos como metadatos
    neighborhood: neighborhood,
    city: city,
    postalCode: "",

    bedrooms: property.bedrooms.toString(),
    bathrooms: property.bathrooms.toString(),
    squareMetersBuilt: property.area.toString(),
    squareMetersUsable: "",
    constructionYear: "",
    parkingSpaces: "",
    features: property.features,
    energyRating: "",

    images: [
      {
        id: "main",
        url: imageUrl,
        isPrimary: true,
        order: 0,
      },
    ],

    status: property.status as
      | "borrador"
      | "publicada"
      | "destacada"
      | "inactiva",
    isFeatured: property.isFeatured || false,
    publishDate: new Date().toISOString().split("T")[0],
    visibility: "publica",
    tags: [],
  };
}

/**
 * Verifica si una URL de imagen es válida
 * @param url URL de la imagen a verificar
 * @returns true si la URL es válida, false en caso contrario
 */
export function isValidImageUrl(url: string): boolean {
  // Verificar si la URL existe
  if (!url) return false;

  // Verificar si no es una URL de placeholder
  if (url.includes("placeholder.svg")) return false;

  // Verificar si es una URL absoluta
  return url.startsWith("http") || url.startsWith("https");
}

/**
 * Obtiene una URL de imagen válida, con fallback a la imagen por defecto
 * @param imageUrl URL de la imagen original
 * @returns URL válida para la imagen
 */
export function getValidImageUrl(imageUrl?: string): string {
  return isValidImageUrl(imageUrl || "") ? imageUrl! : DEFAULT_PROPERTY_IMAGE;
}
