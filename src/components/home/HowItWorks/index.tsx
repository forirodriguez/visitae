import { ArrowRight, Search, Calendar, Home, UserCheck } from "lucide-react";
import Image from "next/image";

export default function HowItWorks() {
  const buyerSteps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Busca propiedades",
      description:
        "Utiliza filtros avanzados y mapas interactivos para encontrar propiedades que se ajusten a tus necesidades.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Agenda una visita",
      description:
        "Selecciona un horario disponible y programa una visita física o virtual en tiempo real.",
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: "Visita la propiedad",
      description:
        "Recibe confirmación instantánea y recordatorios automáticos para tu visita programada.",
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Gestiona el proceso",
      description:
        "Realiza ofertas, gestiona documentos y completa todo el proceso desde la plataforma.",
    },
  ];

  const agentSteps = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "Publica propiedades",
      description:
        "Crea listados detallados con fotos, videos y toda la información relevante de tus propiedades.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Configura disponibilidad",
      description:
        "Define tu calendario de disponibilidad que se sincroniza automáticamente con Google Calendar.",
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Recibe solicitudes",
      description:
        "Obtén notificaciones instantáneas cuando alguien agenda una visita a tus propiedades.",
    },
    {
      icon: <ArrowRight className="h-6 w-6" />,
      title: "Gestiona clientes",
      description:
        "Haz seguimiento de clientes, comparte documentos y cierra tratos desde el panel de control.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-white to-blue-50"
    >
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Cómo funciona
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Una experiencia fluida tanto para compradores como para agentes
            inmobiliarios
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Para compradores */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
                <span>Para compradores e inquilinos</span>
              </div>
              <h3 className="text-2xl font-bold">
                Encuentra y visita propiedades sin complicaciones
              </h3>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-800/0 via-blue-800/50 to-blue-800/0" />
              <div className="space-y-8">
                {buyerSteps.map((step, index) => (
                  <div key={index} className="relative pl-16">
                    <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{step.title}</h4>
                      <p className="text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[200px] md:h-[300px] overflow-hidden rounded-xl">
              <Image
                src="/placeholder.svg?height=300&width=500&text=Interfaz+de+Usuario+para+Compradores"
                alt="Interfaz para compradores"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Para agentes */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-100 px-4 py-1 text-sm font-medium text-teal-800">
                <span>Para agentes inmobiliarios</span>
              </div>
              <h3 className="text-2xl font-bold">
                Gestiona propiedades y clientes eficientemente
              </h3>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-teal-800/0 via-teal-800/50 to-teal-800/0" />
              <div className="space-y-8">
                {agentSteps.map((step, index) => (
                  <div key={index} className="relative pl-16">
                    <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{step.title}</h4>
                      <p className="text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[200px] md:h-[300px] overflow-hidden rounded-xl">
              <Image
                src="/placeholder.svg?height=300&width=500&text=Panel+de+Control+para+Agentes"
                alt="Panel para agentes"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
