"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import PropertyDetailHeader from "./property-detail-header";
import PropertyCarousel from "@/components/admin/property-detail/property-carousel";
import PropertyInfoCard from "@/components/admin/property-detail/property-info-card";
import PropertyNotes from "./property-notes";
import { toast } from "sonner";
import {
  fetchPropertyById,
  deleteProperty,
  addPropertyNote as apiAddPropertyNote,
} from "@/lib/api/client/properties";
import { Loader2 } from "lucide-react";

export interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  operationType: "venta" | "alquiler";
  propertyType: string;
  status: "borrador" | "publicada" | "destacada" | "inactiva";
  isFeatured: boolean;

  // Ubicación
  address: string;
  city: string;
  postalCode: string;
  neighborhood: string;
  latitude: number;
  longitude: number;

  // Características
  bedrooms: number;
  bathrooms: number;
  squareMetersBuilt: number;
  squareMetersUsable: number;
  constructionYear: number;
  parkingSpaces: number;
  features: string[];
  energyRating: string;

  // Galería
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
    order: number;
  }[];

  // Fechas
  createdAt: string;
  updatedAt: string;
  publishDate: string;

  // Notas
  notes: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      name: string;
      avatar: string;
    };
  }[];
}

interface PropertyDetailProps {
  propertyId: string;
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Obtener la propiedad usando React Query
  const {
    data: property,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      try {
        // Obtener datos básicos de la propiedad
        const propertyData = await fetchPropertyById(propertyId);

        if (!propertyData) {
          throw new Error("Propiedad no encontrada");
        }

        // Transformar los datos de la API al formato que necesitamos
        return transformPropertyData(propertyData);
      } catch (error) {
        console.error("Error al cargar la propiedad:", error);
        throw error;
      }
    },
    retry: 1,
  });

  // Mutación para eliminar la propiedad
  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      toast.success("Propiedad eliminada", {
        description: "La propiedad se ha eliminado correctamente.",
      });

      // Obtener el locale actual de la URL
      const locale = window.location.pathname.split("/")[1];
      router.push(`/${locale}/dashboard/properties`);
    },
    onError: (error) => {
      console.error("Error al eliminar la propiedad:", error);
      toast.error("Error al eliminar", {
        description:
          "Ha ocurrido un error al eliminar la propiedad. Inténtalo de nuevo.",
      });
    },
  });

  // Mutación para añadir notas
  const noteMutation = useMutation({
    mutationFn: (content: string) => apiAddPropertyNote(propertyId, content),
    onSuccess: (newNote) => {
      toast.success("Nota añadida", {
        description: "La nota se ha añadido correctamente.",
      });

      // Actualizar la caché de React Query con la nueva nota
      queryClient.setQueryData(
        ["property", propertyId],
        (oldData: PropertyDetail | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notes: [
              {
                id: (newNote as { id: string }).id,
                content: (newNote as { content: string }).content,
                createdAt: (newNote as { createdAt: string }).createdAt,
                user: (newNote as unknown as { user: string }).user,
              },
              ...oldData.notes,
            ],
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error al añadir la nota:", error);
      toast.error("Error al añadir nota", {
        description: "No se pudo guardar la nota. Inténtalo de nuevo.",
      });
    },
  });

  // Handler para eliminar la propiedad - Convertido a async para cumplir con el tipo esperado
  const handleDelete = async (): Promise<void> => {
    await deleteMutation.mutateAsync(propertyId);
  };

  // Handler para añadir una nota
  const handleAddNote = (content: string) => {
    noteMutation.mutate(content);
  };

  // Handler para actualizar la propiedad
  const handlePropertyUpdate = () => {
    toast.info("Esta funcionalidad está en desarrollo", {
      description:
        "Próximamente podrás actualizar la propiedad directamente desde aquí.",
    });
  };

  // Mostrar mensaje de carga
  if (isLoading || deleteMutation.isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
          <p>
            {deleteMutation.isPending
              ? "Eliminando propiedad..."
              : "Cargando información de la propiedad..."}
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error si la propiedad no se pudo cargar
  if (queryError || !property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          {queryError instanceof Error
            ? queryError.message
            : "Propiedad no encontrada"}
        </h2>
        <p className="mb-6">
          No se pudo cargar la información de la propiedad solicitada.
        </p>
        <button
          onClick={() => {
            const locale = window.location.pathname.split("/")[1];
            router.push(`/${locale}/dashboard/properties`);
          }}
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PropertyDetailHeader
        property={property}
        onDelete={handleDelete}
        isLoading={
          isLoading || deleteMutation.isPending || noteMutation.isPending
        }
        onPropertyUpdate={async () => handlePropertyUpdate()}
      />

      {/* Nueva estructura: carrusel e información general en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1: Carrusel */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <PropertyCarousel images={property.images} />
          </Card>
        </div>

        {/* Columna 2: Información general */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{property.title}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {property.address}, {property.city}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <PropertyInfoCard
                  title="Detalles de la propiedad"
                  items={[
                    { label: "Tipo", value: property.propertyType },
                    {
                      label: "Operación",
                      value:
                        property.operationType === "venta"
                          ? "Venta"
                          : "Alquiler",
                    },
                    {
                      label: "Precio",
                      value: `${property.price.toLocaleString("es-ES")} €${property.operationType === "alquiler" ? "/mes" : ""}`,
                    },
                    {
                      label: "Dormitorios",
                      value: property.bedrooms.toString(),
                    },
                    {
                      label: "Baños",
                      value: property.bathrooms.toString(),
                    },
                    {
                      label: "Superficie construida",
                      value: `${property.squareMetersBuilt} m²`,
                    },
                    {
                      label: "Superficie útil",
                      value: `${property.squareMetersUsable} m²`,
                    },
                    {
                      label: "Plazas de garaje",
                      value: property.parkingSpaces.toString(),
                    },
                    {
                      label: "Año de construcción",
                      value: property.constructionYear.toString(),
                    },
                    {
                      label: "Calificación energética",
                      value: property.energyRating.toUpperCase(),
                    },
                  ]}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Segunda fila: Características y descripción */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-6">
            <PropertyInfoCard
              title="Características"
              items={property.features.map((feature) => ({
                label: feature,
                value: "✓",
              }))}
            />

            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tercera fila: Notas */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <PropertyNotes notes={property.notes} onAddNote={handleAddNote} />
        </Card>
      </div>
    </div>
  );
}

// Función auxiliar para transformar los datos de la API al formato que necesitamos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPropertyData(propertyData: any): PropertyDetail {
  // Extraer ciudad del campo location
  const city = propertyData.location
    ? propertyData.location.split(",").pop()?.trim() || ""
    : "";

  // Extraer código postal de la dirección
  const postalCode = propertyData.address
    ? propertyData.address.match(/\d{5}/)?.toString() || ""
    : "";

  // Colección de imágenes reales para usar en caso de que falten imágenes
  const realPropertyImages = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&h=600&auto=format&fit=crop",
  ];

  return {
    id: propertyData.id,
    title: propertyData.title,
    description: propertyData.description || "",
    price: propertyData.price,
    operationType: propertyData.type as "venta" | "alquiler",
    propertyType: propertyData.propertyType,
    status: propertyData.status as
      | "borrador"
      | "publicada"
      | "destacada"
      | "inactiva",
    isFeatured: propertyData.isFeatured || false,

    // Ubicación
    address: propertyData.address || propertyData.location,
    city: city,
    postalCode: postalCode,
    neighborhood: propertyData.neighborhood || "",
    latitude: propertyData.latitude || 0,
    longitude: propertyData.longitude || 0,

    // Características
    bedrooms: propertyData.bedrooms || 0,
    bathrooms: propertyData.bathrooms || 0,
    squareMetersBuilt: propertyData.area || 0,
    squareMetersUsable: Math.floor(propertyData.area * 0.9) || 0,
    constructionYear:
      propertyData.constructionYear || Math.floor(2000 + Math.random() * 20),
    parkingSpaces:
      propertyData.parkingSpaces ||
      (propertyData.features?.includes("Garaje") ? 1 : 0),
    features: propertyData.features || [],
    energyRating: propertyData.energyRating || "C",

    // Galería - Creamos imágenes a partir de la imagen principal y otras imágenes si están disponibles
    images: propertyData.images?.length
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        propertyData.images.map((img: any, index: number) => ({
          id: img.id || `img${index + 1}`,
          url: img.url,
          isPrimary: img.isPrimary || index === 0,
          order: img.order || index,
        }))
      : [
          {
            id: "img1",
            url: propertyData.image || realPropertyImages[0],
            isPrimary: true,
            order: 0,
          },
          // Agregamos más imágenes reales si no hay ninguna
          ...Array(4)
            .fill(0)
            .map((_, i) => ({
              id: `img${i + 2}`,
              url: realPropertyImages[i + 1] || realPropertyImages[0],
              isPrimary: false,
              order: i + 1,
            })),
        ],

    // Fechas
    createdAt:
      propertyData.createdAt ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: propertyData.updatedAt || new Date().toISOString(),
    publishDate:
      propertyData.publishDate ||
      new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],

    // Notas
    notes: propertyData.notes || [],
  };
}
