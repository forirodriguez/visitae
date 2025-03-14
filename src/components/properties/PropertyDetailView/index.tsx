// src/components/properties/PropertyDetailView.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Heart,
  Share,
  Home,
  ChevronLeft,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFilteredProperties } from "@/lib/mock-data/properties";
import PropertyCard from "@/components/properties/PropertyCard";

interface PropertyDetailViewProps {
  property: Property;
  locale: string;
}

export default function PropertyDetailView({
  property,
  locale,
}: PropertyDetailViewProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  // Verificar si la propiedad está en favoritos al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(property.id));
    }

    // Cargar propiedades similares
    const fetchSimilarProperties = async () => {
      try {
        const filtered = await getFilteredProperties({
          type: property.type,
          minBedrooms: Math.max(property.bedrooms - 1, 1),
        });

        const similar = filtered
          .filter((p) => p.id !== property.id)
          .slice(0, 3);

        setSimilarProperties(similar);
      } catch (error) {
        console.error("Error fetching similar properties:", error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarProperties();
  }, [property.id, property.type, property.bedrooms]);

  // Función para alternar favoritos
  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);

    // Actualizar localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (newState) {
      if (!favorites.includes(property.id)) {
        favorites.push(property.id);
      }
    } else {
      const index = favorites.indexOf(property.id);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  // Datos para las características adicionales (para mostrar en las pestañas)
  const interiorFeatures = [
    `${property.bedrooms} dormitorios amplios`,
    `${property.bathrooms} baños completos`,
    "Cocina equipada",
    "Salón luminoso",
    "Armarios empotrados",
  ];

  const exteriorFeatures = [
    "2 plazas de garaje",
    "Piscina comunitaria",
    "Zonas verdes",
    "Seguridad 24h",
    "Ascensor",
  ];

  const nearbyPlaces = [
    { type: "Colegio", distance: "500m" },
    { type: "Centro comercial", distance: "1km" },
    { type: "Parada de metro", distance: "300m" },
  ];

  return (
    <div className="container py-10">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-gray-500">
        <Link
          href={`/${locale}`}
          className="hover:text-primary flex items-center"
        >
          <Home className="h-4 w-4 mr-1" />
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/propiedades`} className="hover:text-primary">
          Propiedades
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate">
          {property.title}
        </span>
      </nav>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-3xl font-bold text-primary">
            {property.price.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
          </div>
          <Badge
            className={
              property.type === "venta" ? "bg-blue-800" : "bg-teal-700"
            }
          >
            {property.type === "venta" ? "Venta" : "Alquiler"}
          </Badge>
          {property.isNew && <Badge className="bg-amber-600 ml-2">Nueva</Badge>}
        </div>
      </div>

      {/* Imagen principal */}
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8">
        <Image
          src={
            property.image ||
            "/placeholder.svg?height=600&width=1200&text=Propiedad"
          }
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-4 mb-8">
        <Button className="flex-1 bg-blue-800 hover:bg-blue-900">
          <Calendar className="h-5 w-5 mr-2" />
          Agendar visita
        </Button>
        <Button
          variant="outline"
          className={`${isFavorite ? "text-red-500 border-red-200 hover:border-red-300" : ""}`}
          onClick={toggleFavorite}
        >
          <Heart
            className={`h-5 w-5 mr-2 ${isFavorite ? "fill-red-500" : ""}`}
          />
          {isFavorite ? "Guardado" : "Guardar"}
        </Button>
        <Button variant="outline">
          <Share className="h-5 w-5 mr-2" />
          Compartir
        </Button>
      </div>

      {/* Características */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg mb-8">
        <div className="flex flex-col items-center justify-center p-3">
          <Bed className="h-6 w-6 text-gray-500 mb-1" />
          <span className="text-lg font-semibold">{property.bedrooms}</span>
          <span className="text-sm text-gray-500">Dormitorios</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <Bath className="h-6 w-6 text-gray-500 mb-1" />
          <span className="text-lg font-semibold">{property.bathrooms}</span>
          <span className="text-sm text-gray-500">Baños</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <Square className="h-6 w-6 text-gray-500 mb-1" />
          <span className="text-lg font-semibold">{property.area}</span>
          <span className="text-sm text-gray-500">m²</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <Home className="h-6 w-6 text-gray-500 mb-1" />
          <span className="text-lg font-semibold">2008</span>
          <span className="text-sm text-gray-500">Año</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <svg
            className="h-6 w-6 text-gray-500 mb-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9H21M9 21V9M7 3H17L21 9V21H3V9L7 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-semibold">2</span>
          <span className="text-sm text-gray-500">Garaje</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <svg
            className="h-6 w-6 text-gray-500 mb-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 9L12 5L2 9L12 13L22 9ZM22 9V15M19 10.5V16.5C19 16.5 16.5 18 12 18C7.5 18 5 16.5 5 16.5V10.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-semibold">A+</span>
          <span className="text-sm text-gray-500">Eficiencia</span>
        </div>
      </div>

      {/* Contenido con pestañas */}
      <Tabs defaultValue="descripcion" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="descripcion">Descripción</TabsTrigger>
          <TabsTrigger value="caracteristicas">Características</TabsTrigger>
          <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
        </TabsList>

        <TabsContent value="descripcion" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Sobre esta propiedad</h2>
          <p className="text-gray-600 mb-4">
            Este impresionante {property.title.toLowerCase()} ofrece una
            combinación perfecta de comodidad, estilo y ubicación privilegiada.
            Disfrute de espacios amplios y luminosos diseñados para el confort
            moderno.
          </p>
          <p className="text-gray-600 mb-4">
            La propiedad cuenta con {property.bedrooms} dormitorios espaciosos,{" "}
            {property.bathrooms} baños completos y una superficie total de{" "}
            {property.area} m². Su distribución optimizada aprovecha al máximo
            cada espacio, proporcionando un ambiente acogedor y funcional.
          </p>
          <p className="text-gray-600 mb-4">
            Ubicado en {property.location}, tiene fácil acceso a todos los
            servicios esenciales, transporte público, zonas verdes y áreas
            comerciales, convirtiéndolo en una opción ideal para vivir
            cómodamente o como inversión.
          </p>
        </TabsContent>

        <TabsContent value="caracteristicas" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">
            Características detalladas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Interior</h3>
              <ul className="space-y-2">
                {interiorFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg
                      className="h-5 w-5 mr-2 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Exterior y servicios</h3>
              <ul className="space-y-2">
                {exteriorFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg
                      className="h-5 w-5 mr-2 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ubicacion" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center mb-4">
            <div className="text-gray-400 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Mapa interactivo no disponible en modo demo</p>
              <p className="font-medium">{property.location}</p>
            </div>
          </div>
          <h3 className="font-medium mb-2">Puntos de interés cercanos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearbyPlaces.map((place, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <svg
                  className="h-5 w-5 mr-2 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C7.58172 2 4 5.58172 4 10C4 12.9539 5.60879 15.5454 8 17C8.91959 17.6588 10 18.5 10 20H11H13H14C14 18.5 15.0804 17.6588 16 17C18.3912 15.5454 20 12.9539 20 10C20 5.58172 16.4183 2 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 20V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  {place.type} a {place.distance}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contacto y herramientas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">
            ¿Te interesa esta propiedad?
          </h2>
          <p className="text-gray-600 mb-6">
            Agenda una visita o contacta con un agente para obtener más
            información sobre esta propiedad.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button className="bg-blue-800 hover:bg-blue-900">
              <Calendar className="h-5 w-5 mr-2" />
              Agendar visita
            </Button>
            <Button variant="outline">Contactar agente</Button>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Herramientas</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18H12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Calcular hipoteca
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8V16M12 11V16M8 14V16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Análisis de inversión
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8L15 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L15 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 16L12 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Solicitar más información
            </Button>
          </div>
        </div>
      </div>

      {/* Propiedades similares */}
      {similarProperties.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-6">Propiedades similares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

      {/* Navegación entre propiedades */}
      <div className="flex justify-between mt-14 pt-6 border-t">
        <Button variant="outline" asChild className="flex items-center">
          <Link href={`/${locale}/propiedades`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver a listado
          </Link>
        </Button>
      </div>
    </div>
  );
}
