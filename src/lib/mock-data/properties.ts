import { Property, PropertyFilter } from "@/types/property";

export const mockProperties: Property[] = [
  {
    id: "prop1",
    title: "Apartamento de lujo con vistas al mar",
    price: 450000,
    location: "Paseo Marítimo, Málaga",
    image: "/placeholder.svg?height=300&width=400&text=Apartamento+Lujo",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: "venta",
    isNew: true,
    description:
      "Espectacular apartamento con vistas panorámicas al mar Mediterráneo. Acabados de lujo y terraza amplia.",
    propertyType: "Apartamento",
    address: "Paseo Marítimo 123, 29016 Málaga",
    features: [
      "Piscina",
      "Terraza",
      "Garaje",
      "Seguridad 24h",
      "Aire acondicionado",
    ],
    isFeatured: true,
    status: "destacada",
  },
  {
    id: "prop2",
    title: "Casa adosada con jardín privado",
    price: 320000,
    location: "Urbanización Los Pinos, Marbella",
    image: "/placeholder.svg?height=300&width=400&text=Casa+Adosada",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    type: "venta",
    description:
      "Bonita casa adosada en urbanización con zonas comunes y seguridad privada. Jardín privado y amplio salón.",
    propertyType: "Adosado",
    address: "Calle Pinos 45, 29603 Marbella",
    features: [
      "Jardín privado",
      "Piscina comunitaria",
      "Zonas verdes",
      "Seguridad",
    ],
    isNew: false,
    isFeatured: false,
    status: "publicada",
  },
  {
    id: "prop3",
    title: "Ático dúplex con terraza panorámica",
    price: 550000,
    location: "Centro Histórico, Sevilla",
    image: "/placeholder.svg?height=300&width=400&text=Ático+Dúplex",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    type: "venta",
    isNew: true,
    description:
      "Exclusivo ático dúplex en pleno centro histórico con vistas a la Giralda. Terraza de 30m2.",
    propertyType: "Ático",
    address: "Calle Sierpes 78, 41004 Sevilla",
    features: [
      "Terraza panorámica",
      "Ascensor",
      "Aire acondicionado",
      "Acabados de lujo",
    ],
    isFeatured: true,
    status: "destacada",
  },
  {
    id: "prop4",
    title: "Piso reformado en zona exclusiva",
    price: 280000,
    location: "Barrio Salamanca, Madrid",
    image: "/placeholder.svg?height=300&width=400&text=Piso+Reformado",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    type: "venta",
    description:
      "Piso completamente reformado con materiales de alta calidad. Ubicación inmejorable en Barrio Salamanca.",
    propertyType: "Piso",
    address: "Calle Serrano 151, 28006 Madrid",
    features: [
      "Reformado",
      "Calefacción central",
      "Parquet",
      "Armarios empotrados",
    ],
    isNew: false,
    isFeatured: false,
    status: "publicada",
  },
  {
    id: "prop5",
    title: "Villa de lujo con piscina privada",
    price: 890000,
    location: "La Zagaleta, Marbella",
    image: "/placeholder.svg?height=300&width=400&text=Villa+Lujo",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    type: "venta",
    description:
      "Impresionante villa de lujo en La Zagaleta con vistas al mar y montaña. Piscina infinity y jardín tropical.",
    propertyType: "Villa",
    address: "Urb. La Zagaleta, 29679 Benahavís, Málaga",
    features: [
      "Piscina infinity",
      "Jardín tropical",
      "Garaje 3 coches",
      "Domótica",
      "Gimnasio",
      "Sauna",
    ],
    isNew: false,
    isFeatured: true,
    status: "destacada",
  },
  {
    id: "prop6",
    title: "Apartamento moderno cerca de la playa",
    price: 195000,
    location: "Playa de la Victoria, Cádiz",
    image: "/placeholder.svg?height=300&width=400&text=Apartamento+Playa",
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    type: "venta",
    isNew: true,
    description:
      "Apartamento moderno a 2 minutos andando de la playa. Ideal para inversión o primera vivienda.",
    propertyType: "Apartamento",
    address: "Avenida del Mar 27, 11010 Cádiz",
    features: [
      "Primera línea de playa",
      "Amueblado",
      "Terraza",
      "Zona tranquila",
    ],
    isFeatured: false,
    status: "borrador",
  },
  {
    id: "prop7",
    title: "Chalet independiente con amplio jardín",
    price: 420000,
    location: "Sierra de Guadarrama, Madrid",
    image: "/placeholder.svg?height=300&width=400&text=Chalet+Jardín",
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    type: "venta",
    description:
      "Amplio chalet independiente con 1000m2 de parcela. Perfecto para familias que buscan tranquilidad cerca de Madrid.",
    propertyType: "Chalet",
    address: "Calle Pinar 15, 28440 Guadarrama, Madrid",
    features: ["Jardín", "Barbacoa", "Chimenea", "Trastero", "Garaje"],
    isNew: false,
    isFeatured: false,
    status: "inactiva",
  },
  {
    id: "prop8",
    title: "Loft industrial en zona céntrica",
    price: 2400,
    location: "Poblenou, Barcelona",
    image: "/placeholder.svg?height=300&width=400&text=Loft+Industrial",
    bedrooms: 1,
    bathrooms: 1,
    area: 90,
    type: "alquiler",
    description:
      "Espectacular loft de estilo industrial en antiguo edificio rehabilitado. Techos altos y amplios ventanales.",
    propertyType: "Loft",
    address: "Calle Pujades 156, 08018 Barcelona",
    features: [
      "Estilo industrial",
      "Techos altos",
      "Espacios abiertos",
      "Reformado",
    ],
    isNew: true,
    isFeatured: false,
    status: "publicada",
  },
  {
    id: "prop9",
    title: "Apartamento con terraza en el centro",
    price: 1500,
    location: "Gran Vía, Madrid",
    image: "/placeholder.svg?height=300&width=400&text=Apartamento+Centro",
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    type: "alquiler",
    description:
      "Moderno apartamento en pleno centro de Madrid. Terraza con vistas a Gran Vía. Recién reformado.",
    propertyType: "Apartamento",
    address: "Gran Vía 42, 28013 Madrid",
    features: ["Terraza", "Ascensor", "Amueblado", "Electrodomésticos nuevos"],
    isNew: false,
    isFeatured: true,
    status: "publicada",
  },
  {
    id: "prop10",
    title: "Estudio amueblado cerca de universidad",
    price: 850,
    location: "Moncloa, Madrid",
    image: "/placeholder.svg?height=300&width=400&text=Estudio+Moncloa",
    bedrooms: 0,
    bathrooms: 1,
    area: 45,
    type: "alquiler",
    description:
      "Estudio completamente amueblado ideal para estudiantes. A 5 minutos de la Ciudad Universitaria.",
    propertyType: "Estudio",
    address: "Calle Princesa 83, 28008 Madrid",
    features: ["Amueblado", "Internet incluido", "Cocina equipada"],
    isNew: false,
    isFeatured: false,
    status: "borrador",
  },
  {
    id: "prop11",
    title: "Duplex de lujo en zona financiera",
    price: 3200,
    location: "AZCA, Madrid",
    image: "/placeholder.svg?height=300&width=400&text=Duplex+AZCA",
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    type: "alquiler",
    description:
      "Espectacular dúplex en la zona financiera de Madrid. Vistas panorámicas y acabados de lujo.",
    propertyType: "Dúplex",
    address: "Paseo de la Castellana 89, 28046 Madrid",
    features: ["Vistas panorámicas", "Gimnasio", "Garaje", "Seguridad 24h"],
    isNew: true,
    isFeatured: true,
    status: "destacada",
  },
  {
    id: "prop12",
    title: "Casa rural con encanto",
    price: 180000,
    location: "Sierra de Aracena, Huelva",
    image: "/placeholder.svg?height=300&width=400&text=Casa+Rural",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    type: "venta",
    description:
      "Encantadora casa rural rehabilitada con materiales tradicionales. Ideal para amantes de la naturaleza.",
    propertyType: "Casa rural",
    address: "Camino del Molino 5, 21291 Aracena, Huelva",
    features: ["Chimenea", "Huerto", "Pozo", "Vistas a la montaña"],
    isNew: false,
    isFeatured: false,
    status: "inactiva",
  },
];

// Función para obtener todas las propiedades (simulando una API)
export function getAllProperties(): Promise<Property[]> {
  return Promise.resolve(mockProperties);
}

// Función para obtener propiedades filtradas
export function getFilteredProperties(
  filters: PropertyFilter
): Promise<Property[]> {
  let filtered = [...mockProperties];

  // Aplicar filtros
  if (filters.type) {
    filtered = filtered.filter((property) => property.type === filters.type);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(
      (property) => property.price >= filters.minPrice!
    );
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(
      (property) => property.price <= filters.maxPrice!
    );
  }

  if (filters.minBedrooms !== undefined) {
    filtered = filtered.filter(
      (property) => property.bedrooms >= filters.minBedrooms!
    );
  }

  if (filters.location) {
    filtered = filtered.filter((property) =>
      property.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  if (filters.keyword) {
    filtered = filtered.filter(
      (property) =>
        property.title.toLowerCase().includes(filters.keyword!.toLowerCase()) ||
        property.location
          .toLowerCase()
          .includes(filters.keyword!.toLowerCase()) ||
        property.description
          .toLowerCase()
          .includes(filters.keyword!.toLowerCase())
    );
  }

  // Simular latencia de API
  return new Promise((resolve) => {
    setTimeout(() => resolve(filtered), 300);
  });
}

// Función para obtener una propiedad por ID
export function getPropertyById(id: string): Promise<Property | null> {
  const property = mockProperties.find((p) => p.id === id) || null;

  // Simular latencia de API
  return new Promise((resolve) => {
    setTimeout(() => resolve(property), 200);
  });
}

// Función para obtener propiedades destacadas
export function getFeaturedProperties(limit: number = 6): Promise<Property[]> {
  const featured = mockProperties.filter((property) => property.isFeatured);
  return Promise.resolve(featured.slice(0, limit));
}

// Función para obtener propiedades nuevas
export function getNewProperties(): Promise<Property[]> {
  return Promise.resolve(mockProperties.filter((property) => property.isNew));
}

// Función para obtener propiedades por tipo
export function getPropertiesByType(
  type: "venta" | "alquiler"
): Promise<Property[]> {
  return Promise.resolve(
    mockProperties.filter((property) => property.type === type)
  );
}
