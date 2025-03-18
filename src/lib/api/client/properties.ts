// src/utils/property-adapter.ts
import { PropertyFormData } from "@/components/admin/property-form/property-form";
import { Property } from "@/types/property";

/**
 * Convierte los datos del formulario al formato de Property para la API
 */
export function formDataToProperty(
  formData: PropertyFormData
): Omit<Property, "id"> {
  // Seleccionar la imagen principal o la primera disponible
  // Usamos || para proporcionar un fallback solo cuando es necesario
  const mainImage =
    formData.images.find((img) => img.isPrimary)?.url ||
    (formData.images.length > 0 ? formData.images[0].url : "/placeholder.svg");

  console.log("Imagen seleccionada para guardar:", mainImage);

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
  console.log("Propiedad a convertir:", property);
  console.log("URL de imagen recibida de la BD:", property.image);

  // Extraer neighborhood y city de location
  let neighborhood = "";
  let city = property.location;

  if (property.location.includes(",")) {
    const parts = property.location.split(",");
    neighborhood = parts[0].trim();
    city = parts.slice(1).join(",").trim();
  }

  // Nos aseguramos de tener una URL de imagen válida
  const imageUrl = property.image || "/placeholder.svg";

  // Creamos un objeto de imagen para el formulario
  const imageObject = {
    id: "main",
    url: imageUrl,
    isPrimary: true,
    order: 0,
  };

  console.log("Objeto de imagen para el formulario:", imageObject);

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

    images: [imageObject],

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
 * Función para depurar problemas de imágenes
 * Puedes llamar a esta función desde componentes para verificar las URLs
 */
export function debugPropertyImage(property: Property): void {
  console.log("DEBUG - Información de imagen de propiedad:");
  console.log("ID de propiedad:", property.id);
  console.log("Título:", property.title);
  console.log("URL de imagen:", property.image);

  // Verificar si la URL es absoluta o relativa
  const isAbsoluteUrl =
    property.image.startsWith("http") || property.image.startsWith("/");
  console.log("¿Es URL absoluta?", isAbsoluteUrl);

  // Verificar si es un placeholder
  const isPlaceholder = property.image.includes("placeholder");
  console.log("¿Es imagen placeholder?", isPlaceholder);
}
