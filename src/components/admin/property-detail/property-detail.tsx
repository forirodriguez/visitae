"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import PropertyDetailHeader from "./property-detail-header";
import PropertyCarousel from "@/components/admin/property-detail/property-carousel";
import PropertyInfoCard from "@/components/admin/property-detail/property-info-card";
import PropertyNotes from "./property-notes";
import { toast } from "sonner";
import { fetchPropertyById, deleteProperty } from "@/lib/api/client/properties";

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

// Datos de ejemplo como fallback en caso de error
const sampleProperty: PropertyDetail = {
  id: "prop-error",
  title: "Propiedad de ejemplo (error al cargar)",
  description:
    "Esta es una propiedad de ejemplo que se muestra cuando hay un error al cargar los datos reales.",
  price: 0,
  operationType: "venta",
  propertyType: "Desconocido",
  status: "borrador",
  isFeatured: false,

  address: "Dirección desconocida",
  city: "Ciudad",
  postalCode: "00000",
  neighborhood: "Barrio",
  latitude: 0,
  longitude: 0,

  bedrooms: 0,
  bathrooms: 0,
  squareMetersBuilt: 0,
  squareMetersUsable: 0,
  constructionYear: 0,
  parkingSpaces: 0,
  features: [],
  energyRating: "F",

  images: [
    {
      id: "img-error",
      url: "/placeholder.svg?height=600&width=800&text=Error+al+cargar+imagen",
      isPrimary: true,
      order: 0,
    },
  ],

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishDate: new Date().toISOString().split("T")[0],

  notes: [],
};

interface PropertyDetailProps {
  propertyId: string;
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const router = useRouter();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar la propiedad según el ID proporcionado
  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Utilizamos la función fetchPropertyById de la API real
        const propertyData = await fetchPropertyById(propertyId);

        if (!propertyData) {
          throw new Error("Propiedad no encontrada");
        }

        // Convertir los datos de la API a nuestro formato PropertyDetail
        const propertyDetail: PropertyDetail = {
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

          // Ubicación - Extraemos la ciudad de la ubicación
          address: propertyData.address || propertyData.location,
          city: propertyData.location
            ? propertyData.location.split(",").pop()?.trim() || ""
            : "",
          postalCode: propertyData.address
            ? propertyData.address.match(/\d{5}/)?.toString() || ""
            : "",
          neighborhood: "",
          latitude: 0,
          longitude: 0,

          // Características
          bedrooms: propertyData.bedrooms || 0,
          bathrooms: propertyData.bathrooms || 0,
          squareMetersBuilt: propertyData.area || 0,
          squareMetersUsable: Math.floor(propertyData.area * 0.9) || 0,
          constructionYear: Math.floor(2000 + Math.random() * 20),
          parkingSpaces: propertyData.features?.includes("Garaje") ? 1 : 0,
          features: propertyData.features || [],
          energyRating: "C",

          // Galería - Creamos imágenes a partir de la imagen principal
          images: [
            {
              id: "img1",
              url:
                propertyData.image ||
                "/placeholder.svg?height=600&width=800&text=Sin+imagen",
              isPrimary: true,
              order: 0,
            },
            // Agregamos más imágenes de ejemplo
            ...Array(4)
              .fill(0)
              .map((_, i) => ({
                id: `img${i + 2}`,
                url: `/placeholder.svg?height=600&width=800&text=Imagen+${i + 2}`,
                isPrimary: false,
                order: i + 1,
              })),
          ],

          // Fechas
          createdAt: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 días atrás
          updatedAt: new Date().toISOString(),
          publishDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 20 días atrás

          notes: [
            {
              id: "note1",
              content:
                "Propiedad con alto potencial. El propietario está abierto a negociar el precio.",
              createdAt: new Date(
                Date.now() - 15 * 24 * 60 * 60 * 1000
              ).toISOString(),
              user: {
                name: "Gestión Comercial",
                avatar: "/placeholder.svg?height=40&width=40&text=GC",
              },
            },
          ],
        };

        setProperty(propertyDetail);
      } catch (err) {
        console.error("Error al cargar la propiedad:", err);
        setError(
          "No se pudo cargar la información de la propiedad. Utilizando datos de ejemplo."
        );
        setProperty(sampleProperty); // Usamos datos de ejemplo como fallback

        toast.error("Error al cargar la propiedad", {
          description: "Se están mostrando datos de ejemplo.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Utilizamos la función deleteProperty de la API real
      const success = await deleteProperty(propertyId);

      if (success) {
        toast.success("Propiedad eliminada", {
          description: "La propiedad se ha eliminado correctamente.",
        });

        // Obtener el locale actual de la URL
        const locale = window.location.pathname.split("/")[1];
        router.push(`/${locale}/dashboard/properties`);
      } else {
        throw new Error("No se pudo eliminar la propiedad");
      }
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error);
      toast.error("Error al eliminar", {
        description:
          "Ha ocurrido un error al eliminar la propiedad. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = (content: string) => {
    if (!property) return;

    const newNote = {
      id: `note${property.notes.length + 1}`,
      content,
      createdAt: new Date().toISOString(),
      user: {
        name: "Usuario Actual",
        avatar: "/placeholder.svg?height=40&width=40&text=UC",
      },
    };

    setProperty((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: [newNote, ...prev.notes],
      };
    });

    toast.success("Nota añadida", {
      description: "La nota se ha añadido correctamente.",
    });

    // En una aplicación real, aquí habría una llamada a la API para guardar la nota
    // Por ejemplo: await addPropertyNote(propertyId, content);
  };

  // Mostrar mensaje de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mb-4"></div>
          <p>Cargando información de la propiedad...</p>
        </div>
      </div>
    );
  }

  // Si no hay propiedad después de cargar (y no hay error que haya establecido los datos de ejemplo)
  if (!property && !error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Propiedad no encontrada
        </h2>
        <p className="mb-6">
          No se encontró la propiedad con el ID especificado.
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
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}

      <PropertyDetailHeader
        property={property!}
        onDelete={handleDelete}
        isLoading={isLoading}
        onPropertyUpdate={function (): void {
          toast.info("Esta funcionalidad está en desarrollo", {
            description:
              "Próximamente podrás actualizar la propiedad directamente desde aquí.",
          });
        }}
      />

      {/* Nueva estructura: carrusel e información general en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1: Carrusel */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <PropertyCarousel images={property!.images} />
          </Card>
        </div>

        {/* Columna 2: Información general */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{property!.title}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {property!.address}, {property!.city}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <PropertyInfoCard
                  title="Detalles de la propiedad"
                  items={[
                    { label: "Tipo", value: property!.propertyType },
                    {
                      label: "Operación",
                      value:
                        property!.operationType === "venta"
                          ? "Venta"
                          : "Alquiler",
                    },
                    {
                      label: "Precio",
                      value: `${property!.price.toLocaleString("es-ES")} €${property!.operationType === "alquiler" ? "/mes" : ""}`,
                    },
                    {
                      label: "Dormitorios",
                      value: property!.bedrooms.toString(),
                    },
                    {
                      label: "Baños",
                      value: property!.bathrooms.toString(),
                    },
                    {
                      label: "Superficie construida",
                      value: `${property!.squareMetersBuilt} m²`,
                    },
                    {
                      label: "Superficie útil",
                      value: `${property!.squareMetersUsable} m²`,
                    },
                    {
                      label: "Plazas de garaje",
                      value: property!.parkingSpaces.toString(),
                    },
                    {
                      label: "Año de construcción",
                      value: property!.constructionYear.toString(),
                    },
                    {
                      label: "Calificación energética",
                      value: property!.energyRating.toUpperCase(),
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
              items={property!.features.map((feature) => ({
                label: feature,
                value: "✓",
              }))}
            />

            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {property!.description}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tercera fila: Notas */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <PropertyNotes notes={property!.notes} onAddNote={handleAddNote} />
        </Card>
      </div>
    </div>
  );
}
