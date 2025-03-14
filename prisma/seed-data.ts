// Archivo simplificado con los datos mock necesarios para el seed

// Propiedades
export const seedProperties = [
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
];

// Definición de la disponibilidad del agente
export const seedAvailability = {
  lunes: {
    enabled: true,
    timeSlots: [
      { id: "lun-1", startTime: "09:00", endTime: "14:00" },
      { id: "lun-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  martes: {
    enabled: true,
    timeSlots: [
      { id: "mar-1", startTime: "09:00", endTime: "14:00" },
      { id: "mar-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  miercoles: {
    enabled: true,
    timeSlots: [
      { id: "mie-1", startTime: "09:00", endTime: "14:00" },
      { id: "mie-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  jueves: {
    enabled: true,
    timeSlots: [
      { id: "jue-1", startTime: "09:00", endTime: "14:00" },
      { id: "jue-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  viernes: {
    enabled: true,
    timeSlots: [
      { id: "vie-1", startTime: "09:00", endTime: "14:00" },
      { id: "vie-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  sabado: {
    enabled: true,
    timeSlots: [{ id: "sab-1", startTime: "10:00", endTime: "14:00" }],
  },
  domingo: {
    enabled: false,
    timeSlots: [],
  },
};

// Agente principal
export const seedAgent = {
  id: "agent-001",
  name: "Carlos García",
  email: "carlos@visitae.com",
  phone: "600111222",
  avatarUrl: "/placeholder.svg?height=100&width=100&text=CG",
  availability: seedAvailability,
};

// Visitas de ejemplo
export const seedVisits = [
  {
    id: "v1",
    date: new Date(2025, 2, 10), // 10 de marzo de 2025
    time: "10:00",
    propertyId: "prop1",
    clientName: "Carlos Rodríguez",
    clientEmail: "carlos@example.com",
    clientPhone: "600123456",
    type: "presencial",
    status: "confirmada",
    notes: "Cliente interesado en compra inmediata",
  },
  {
    id: "v2",
    date: new Date(2025, 2, 10), // 10 de marzo de 2025
    time: "12:30",
    propertyId: "prop2",
    clientName: "Laura Martínez",
    clientEmail: "laura@example.com",
    clientPhone: "600789012",
    type: "presencial",
    status: "pendiente",
  },
  {
    id: "v3",
    date: new Date(2025, 2, 11), // 11 de marzo de 2025
    time: "16:00",
    propertyId: "prop3",
    clientName: "Miguel Sánchez",
    clientEmail: "miguel@example.com",
    clientPhone: "600345678",
    type: "videollamada",
    status: "confirmada",
    notes: "Cliente solicitó información sobre financiación",
  },
  {
    id: "v4",
    date: new Date(2025, 2, 13), // 13 de marzo de 2025
    time: "11:15",
    propertyId: "prop1",
    clientName: "Ana López",
    clientEmail: "ana@example.com",
    clientPhone: "600567890",
    type: "presencial",
    status: "pendiente",
  },
  {
    id: "v5",
    date: new Date(2025, 2, 14), // 14 de marzo de 2025
    time: "15:30",
    propertyId: "prop5",
    clientName: "Pedro Gómez",
    clientEmail: "pedro@example.com",
    clientPhone: "600901234",
    type: "videollamada",
    status: "cancelada",
  },
];
