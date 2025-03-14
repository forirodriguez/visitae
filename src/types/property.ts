export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: "venta" | "alquiler";
  isNew?: boolean;
  isFeatured?: boolean;
  description: string;
  propertyType: string;
  address: string;
  features: string[];
  status: "publicada" | "borrador" | "destacada" | "inactiva";
}

export interface PropertyFilter {
  status: unknown;
  featured: boolean;
  type?: "venta" | "alquiler";
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  location?: string;
  keyword?: string;
}
