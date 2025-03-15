import { PrismaClient } from "@prisma/client";
import { seedProperties, seedAgent, seedVisits } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Empezando seed de datos...");

  try {
    // Limpiar datos existentes
    console.log("Eliminando datos existentes...");
    await prisma.visit.deleteMany({});
    await prisma.agentAvailability.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({});

    // Crear usuario administrador
    console.log("Creando usuarios administradores...");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const adminUser = await prisma.user.create({
      data: {
        id: "1",
        email: "admin@visitae.com",
        name: "Administrador",
        role: "admin",
        password: "admin123",
      },
    });

    // Crear usuario super administrador
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const superAdminUser = await prisma.user.create({
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
        id: seedAgent.id,
        email: seedAgent.email,
        name: seedAgent.name,
        phone: seedAgent.phone,
        avatarUrl: seedAgent.avatarUrl,
        role: "agent",
        password: "agente123",
      },
    });

    // Crear disponibilidad del agente
    console.log("Creando disponibilidad del agente...");
    await prisma.agentAvailability.create({
      data: {
        agentId: agent.id,
        weekData: JSON.parse(JSON.stringify(seedAgent.availability)), // Convertir a JSON puro
      },
    });

    // Crear propiedades
    console.log("Creando propiedades...");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createdProperties = await Promise.all(
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clients = await Promise.all([
      prisma.user.create({
        data: {
          id: "client-1",
          name: "Carlos Rodríguez",
          email: "carlos@example.com",
          phone: "600123456",
          role: "client",
        },
      }),
      prisma.user.create({
        data: {
          id: "client-2",
          name: "Laura Martínez",
          email: "laura@example.com",
          phone: "600789012",
          role: "client",
        },
      }),
      prisma.user.create({
        data: {
          id: "client-3",
          name: "Miguel Sánchez",
          email: "miguel@example.com",
          phone: "600345678",
          role: "client",
        },
      }),
    ]);

    // Mapeo de correos electrónicos a IDs de cliente
    const clientEmailMap: Record<string, string> = {
      "carlos@example.com": "client-1",
      "laura@example.com": "client-2",
      "miguel@example.com": "client-3",
      "ana@example.com": "client-1", // Usar client-1 para Ana por simplicidad
      "pedro@example.com": "client-2", // Usar client-2 para Pedro por simplicidad
    };

    // Crear visitas
    console.log("Creando visitas...");
    await Promise.all(
      seedVisits.map(async (visit) => {
        const clientId = clientEmailMap[visit.clientEmail] || "client-1";

        return prisma.visit.create({
          data: {
            id: visit.id,
            date: visit.date,
            time: visit.time,
            type: visit.type,
            status: visit.status,
            notes: visit.notes,
            propertyId: visit.propertyId,
            agentId: agent.id,
            clientId: clientId,
          },
        });
      })
    );

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
