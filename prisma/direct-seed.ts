import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedProperties = [
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

async function main() {
  console.log("Iniciando seed directo...");

  try {
    // Limpiar datos existentes
    console.log("Eliminando datos existentes...");
    await prisma.visit.deleteMany({});
    await prisma.agentAvailability.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({});

    // Crear usuario administrador
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

    // Crear usuario super administrador
    await prisma.user.create({
      data: {
        id: "2",
        email: "super@visitae.com",
        name: "Super Admin",
        role: "superadmin",
        password: "super123",
      },
    });

    // Crear agente inmobiliario
    console.log("Creando agente inmobiliario...");
    const agent = await prisma.user.create({
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

    // Crear disponibilidad del agente
    console.log("Creando disponibilidad del agente...");
    await prisma.agentAvailability.create({
      data: {
        agentId: agent.id,
        weekData: seedAvailability, // Ya es un objeto simple
      },
    });

    // Crear propiedades
    console.log("Creando propiedades...");
    await Promise.all(
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

    // Crear algunos clientes para las visitas
    console.log("Creando clientes...");
    const client1 = await prisma.user.create({
      data: {
        id: "client-1",
        name: "Carlos Rodríguez",
        email: "carlos@example.com",
        phone: "600123456",
        role: "client",
      },
    });

    const client2 = await prisma.user.create({
      data: {
        id: "client-2",
        name: "Laura Martínez",
        email: "laura@example.com",
        phone: "600789012",
        role: "client",
      },
    });

    // Crear visitas simples
    console.log("Creando visitas...");
    await prisma.visit.create({
      data: {
        id: "v1",
        date: new Date(2025, 2, 10), // 10 de marzo de 2025
        time: "10:00",
        type: "presencial",
        status: "confirmada",
        notes: "Cliente interesado en compra inmediata",
        propertyId: "prop1",
        agentId: agent.id,
        clientId: client1.id,
      },
    });

    await prisma.visit.create({
      data: {
        id: "v2",
        date: new Date(2025, 2, 12), // 12 de marzo de 2025
        time: "12:30",
        type: "videollamada",
        status: "pendiente",
        propertyId: "prop2",
        agentId: agent.id,
        clientId: client2.id,
      },
    });

    console.log("Seed completado satisfactoriamente!");
  } catch (error) {
    console.error("Error durante el seed:", error);
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
