// prisma/direct-seed.ts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Propiedades expandidas
const seedProperties = [
  // Propiedades originales
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

  // Propiedades adicionales - propiedades en venta
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
    address: "Calle Serrano, 28006 Madrid",
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
    status: "borrador",
  },
  {
    id: "prop7",
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

  // Propiedades adicionales - propiedades en alquiler
  {
    id: "prop8",
    title: "Loft industrial en zona céntrica",
    price: 1200,
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
    title: "Piso compartido para profesionales",
    price: 450,
    location: "Chamberí, Madrid",
    image: "/placeholder.svg?height=300&width=400&text=Piso+Compartido",
    bedrooms: 4,
    bathrooms: 2,
    area: 120,
    type: "alquiler",
    description:
      "Habitación individual en piso compartido. Zonas comunes amplias. Ambiente tranquilo ideal para profesionales.",
    propertyType: "Habitación",
    address: "Calle Almagro 25, 28010 Madrid",
    features: ["Habitación amueblada", "Gastos incluidos", "Fibra óptica"],
    isNew: false,
    isFeatured: false,
    status: "inactiva",
  },
];

// Definición de la disponibilidad del agente
const seedAvailability = {
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

// Datos de agentes adicionales
const additionalAgents = [
  {
    id: "agent-002",
    email: "maria@visitae.com",
    name: "María López",
    phone: "600222333",
    avatarUrl: "/placeholder.svg?height=100&width=100&text=ML",
    role: "agent",
    password: "agente123",
  },
  {
    id: "agent-003",
    email: "juan@visitae.com",
    name: "Juan Martínez",
    phone: "600333444",
    avatarUrl: "/placeholder.svg?height=100&width=100&text=JM",
    role: "agent",
    password: "agente123",
  },
];

// Datos de clientes adicionales
const additionalClients = [
  {
    id: "client-3",
    name: "Miguel Sánchez",
    email: "miguel@example.com",
    phone: "600345678",
    role: "client",
  },
  {
    id: "client-4",
    name: "Ana López",
    email: "ana@example.com",
    phone: "600456789",
    role: "client",
  },
  {
    id: "client-5",
    name: "Pablo García",
    email: "pablo@example.com",
    phone: "600567890",
    role: "client",
  },
  {
    id: "client-6",
    name: "Elena Rodríguez",
    email: "elena@example.com",
    phone: "600678901",
    role: "client",
  },
  {
    id: "client-7",
    name: "Lucía Fernández",
    email: "lucia@example.com",
    phone: "600789012",
    role: "client",
  },
  {
    id: "client-8",
    name: "Javier González",
    email: "javier@example.com",
    phone: "600890123",
    role: "client",
  },
];
// Función para obtener una fecha futura o pasada
const getDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

// Datos de visitas expandidas
const expandedVisits = [
  // Visitas originales
  {
    id: "v1",
    date: new Date(2025, 2, 10), // 10 de marzo de 2025
    time: "10:00",
    type: "presencial",
    status: "confirmada",
    notes: "Cliente interesado en compra inmediata",
    propertyId: "prop1",
    agentId: "agent-001",
    clientId: "client-1",
  },
  {
    id: "v2",
    date: new Date(2025, 2, 12), // 12 de marzo de 2025
    time: "12:30",
    type: "videollamada",
    status: "pendiente",
    propertyId: "prop2",
    agentId: "agent-001",
    clientId: "client-2",
  },

  // Visitas para propiedades en venta (confirmadas)
  {
    id: "v3",
    date: getDate(-5), // 5 días atrás
    time: "11:00",
    type: "presencial",
    status: "completada",
    notes: "El cliente quedó muy interesado, pidió una segunda visita",
    propertyId: "prop3",
    agentId: "agent-001",
    clientId: "client-3",
  },
  {
    id: "v4",
    date: getDate(-3), // 3 días atrás
    time: "17:30",
    type: "presencial",
    status: "completada",
    notes: "Posible oferta en los próximos días",
    propertyId: "prop4",
    agentId: "agent-002",
    clientId: "client-4",
  },
  {
    id: "v5",
    date: getDate(-1), // ayer
    time: "10:45",
    type: "videollamada",
    status: "completada",
    notes: "Cliente en el extranjero, muy interesado",
    propertyId: "prop5",
    agentId: "agent-003",
    clientId: "client-5",
  },

  // Visitas para propiedades en venta (pendientes y confirmadas futuras)
  {
    id: "v6",
    date: getDate(1), // mañana
    time: "09:30",
    type: "presencial",
    status: "confirmada",
    propertyId: "prop1",
    agentId: "agent-001",
    clientId: "client-6",
  },
  {
    id: "v7",
    date: getDate(2), // en 2 días
    time: "12:00",
    type: "presencial",
    status: "confirmada",
    propertyId: "prop2",
    agentId: "agent-002",
    clientId: "client-7",
  },
  {
    id: "v8",
    date: getDate(3), // en 3 días
    time: "17:15",
    type: "videollamada",
    status: "pendiente",
    propertyId: "prop3",
    agentId: "agent-003",
    clientId: "client-8",
  },
  {
    id: "v9",
    date: getDate(5), // en 5 días
    time: "11:30",
    type: "presencial",
    status: "pendiente",
    propertyId: "prop4",
    agentId: "agent-001",
    clientId: "client-1",
  },
  {
    id: "v10",
    date: getDate(7), // en 7 días
    time: "16:00",
    type: "presencial",
    status: "pendiente",
    propertyId: "prop5",
    agentId: "agent-002",
    clientId: "client-2",
  },

  // Visitas para propiedades en alquiler
  {
    id: "v11",
    date: getDate(-2), // 2 días atrás
    time: "18:00",
    type: "presencial",
    status: "completada",
    notes: "Cliente quiere formalizar el contrato cuanto antes",
    propertyId: "prop8",
    agentId: "agent-003",
    clientId: "client-3",
  },
  {
    id: "v12",
    date: getDate(2), // en 2 días
    time: "10:00",
    type: "presencial",
    status: "confirmada",
    propertyId: "prop9",
    agentId: "agent-001",
    clientId: "client-4",
  },
  {
    id: "v13",
    date: getDate(4), // en 4 días
    time: "17:00",
    type: "videollamada",
    status: "pendiente",
    propertyId: "prop11",
    agentId: "agent-002",
    clientId: "client-5",
  },

  // Visitas canceladas
  {
    id: "v14",
    date: getDate(-1), // ayer
    time: "16:30",
    type: "presencial",
    status: "cancelada",
    notes: "Cliente tuvo una emergencia familiar",
    propertyId: "prop6",
    agentId: "agent-003",
    clientId: "client-6",
  },
  {
    id: "v15",
    date: getDate(6), // en 6 días
    time: "12:45",
    type: "presencial",
    status: "cancelada",
    notes: "Cliente encontró otra opción",
    propertyId: "prop7",
    agentId: "agent-001",
    clientId: "client-7",
  },

  // Visitas adicionales para el mismo día
  {
    id: "v16",
    date: getDate(0), // hoy
    time: "09:15",
    type: "presencial",
    status: "confirmada",
    propertyId: "prop1",
    agentId: "agent-002",
    clientId: "client-8",
  },
  {
    id: "v17",
    date: getDate(0), // hoy
    time: "11:30",
    type: "presencial",
    status: "confirmada",
    propertyId: "prop4",
    agentId: "agent-003",
    clientId: "client-1",
  },
  {
    id: "v18",
    date: getDate(0), // hoy
    time: "16:00",
    type: "videollamada",
    status: "pendiente",
    propertyId: "prop9",
    agentId: "agent-001",
    clientId: "client-2",
  },
  {
    id: "v19",
    date: getDate(0), // hoy
    time: "18:30",
    type: "videollamada",
    status: "pendiente",
    propertyId: "prop11",
    agentId: "agent-002",
    clientId: "client-3",
  },

  // Visitas para la próxima semana
  {
    id: "v20",
    date: getDate(8), // en 8 días
    time: "10:30",
    type: "presencial",
    status: "pendiente",
    propertyId: "prop3",
    agentId: "agent-001",
    clientId: "client-4",
  },
  {
    id: "v21",
    date: getDate(9), // en 9 días
    time: "16:45",
    type: "presencial",
    status: "pendiente",
    propertyId: "prop5",
    agentId: "agent-002",
    clientId: "client-5",
  },
  {
    id: "v22",
    date: getDate(10), // en 10 días
    time: "12:00",
    type: "videollamada",
    status: "pendiente",
    propertyId: "prop9",
    agentId: "agent-003",
    clientId: "client-6",
  },
  {
    id: "v23",
    date: getDate(11), // en 11 días
    time: "17:30",
    type: "presencial",
    status: "pendiente",
    propertyId: "prop1",
    agentId: "agent-001",
    clientId: "client-7",
  },
  {
    id: "v24",
    date: getDate(12), // en 12 días
    time: "11:15",
    type: "presencial",
    status: "pendiente",
    propertyId: "prop2",
    agentId: "agent-002",
    clientId: "client-8",
  },
];

async function main() {
  console.log("Iniciando seed expandido...");

  try {
    // Limpiar datos existentes
    console.log("Eliminando datos existentes...");
    await prisma.visit.deleteMany({});
    await prisma.agentAvailability.deleteMany({});
    await prisma.agentProperty.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({});

    // Crear usuarios administradores
    console.log("Creando usuarios administradores...");
    await prisma.user.create({
      data: {
        id: "1",
        email: "admin@visitae.com",
        name: "Administrador",
        role: "admin",
        password: "admin123",
      },
    });

    await prisma.user.create({
      data: {
        id: "2",
        email: "super@visitae.com",
        name: "Super Admin",
        role: "superadmin",
        password: "super123",
      },
    });

    // Crear agente inmobiliario principal
    console.log("Creando agentes inmobiliarios...");
    const agent1 = await prisma.user.create({
      data: {
        id: "agent-001",
        email: "carlos@visitae.com",
        name: "Carlos García",
        phone: "600111222",
        avatarUrl: "/placeholder.svg?height=100&width=100&text=CG",
        role: "agent",
        password: "agente123",
      },
    });

    // Crear agentes adicionales
    const agents = [agent1];
    for (const agentData of additionalAgents) {
      const agent = await prisma.user.create({
        data: agentData,
      });
      agents.push(agent);
    }

    // Crear disponibilidad para cada agente
    console.log("Creando disponibilidad de los agentes...");
    for (const agent of agents) {
      await prisma.agentAvailability.create({
        data: {
          agentId: agent.id,
          weekData: seedAvailability,
        },
      });
    }

    // Crear propiedades
    console.log("Creando propiedades...");
    const properties = await Promise.all(
      seedProperties.map(async (property) => {
        return prisma.property.create({
          data: {
            id: property.id,
            title: property.title,
            price: property.price,
            location: property.location,
            image: property.image,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            type: property.type,
            description: property.description,
            propertyType: property.propertyType,
            address: property.address,
            features: property.features,
            status: property.status,
            isNew: property.isNew || false,
            isFeatured: property.isFeatured || false,
          },
        });
      })
    );

    // Asignar propiedades a agentes (para tener relaciones en la BD)
    console.log("Asignando propiedades a agentes...");

    // Distribuir propiedades entre los agentes
    const assignProperties = async () => {
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        const agentIndex = i % agents.length; // Distribuir equitativamente
        const agent = agents[agentIndex];

        await prisma.agentProperty.create({
          data: {
            agentId: agent.id,
            propertyId: property.id,
          },
        });
      }
    };

    await assignProperties();

    // Crear clientes
    console.log("Creando clientes...");
    const clients = [];

    // Crear clientes originales
    const client1 = await prisma.user.create({
      data: {
        id: "client-1",
        name: "Carlos Rodríguez",
        email: "carlos@example.com",
        phone: "600123456",
        role: "client",
      },
    });
    clients.push(client1);

    const client2 = await prisma.user.create({
      data: {
        id: "client-2",
        name: "Laura Martínez",
        email: "laura@example.com",
        phone: "600789012",
        role: "client",
      },
    });
    clients.push(client2);

    // Crear clientes adicionales
    for (const clientData of additionalClients) {
      const client = await prisma.user.create({
        data: clientData,
      });
      clients.push(client);
    }

    // Crear visitas expandidas
    console.log("Creando visitas...");

    for (const visit of expandedVisits) {
      await prisma.visit.create({
        data: {
          id: visit.id,
          date: visit.date,
          time: visit.time,
          type: visit.type,
          status: visit.status,
          notes: visit.notes,
          propertyId: visit.propertyId,
          agentId: visit.agentId,
          clientId: visit.clientId,
        },
      });
    }

    console.log("Seed expandido completado satisfactoriamente!");
  } catch (error) {
    console.error("Error durante el seed expandido:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
