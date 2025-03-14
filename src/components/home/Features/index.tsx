import { Calendar, Calculator, Map, FileText } from "lucide-react";
import Image from "next/image";

export default function Features() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-blue-800" />,
      title: "Agendamiento en tiempo real",
      description:
        "Programa visitas físicas o virtuales según la disponibilidad real de los agentes, con sincronización automática con Google Calendar.",
      image: "/placeholder.svg?height=300&width=500&text=Calendario+de+Citas",
    },
    {
      icon: <Map className="h-10 w-10 text-blue-800" />,
      title: "Mapas interactivos",
      description:
        "Visualiza propiedades en el mapa con puntos de interés cercanos como escuelas, hospitales, transporte público y comercios.",
      image: "/placeholder.svg?height=300&width=500&text=Mapa+Interactivo",
    },
    {
      icon: <Calculator className="h-10 w-10 text-blue-800" />,
      title: "Calculadoras financieras",
      description:
        "Calcula hipotecas, retorno de inversión y compara diferentes escenarios financieros para tomar decisiones informadas.",
      image:
        "/placeholder.svg?height=300&width=500&text=Calculadora+Financiera",
    },
    {
      icon: <FileText className="h-10 w-10 text-blue-800" />,
      title: "Gestión documental",
      description:
        "Almacena, comparte y firma documentos digitalmente en un entorno seguro y centralizado para todas las partes.",
      image: "/placeholder.svg?height=300&width=500&text=Gestión+Documental",
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Características principales
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Herramientas diseñadas para simplificar y optimizar todo el proceso
            inmobiliario
          </p>
        </div>

        <div className="grid gap-12 md:gap-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid gap-6 lg:grid-cols-2 lg:gap-12 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div
                className={`space-y-4 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
              >
                <div className="inline-flex items-center justify-center rounded-lg bg-blue-100 p-3">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
              <div
                className={`relative h-[300px] overflow-hidden rounded-xl ${index % 2 === 1 ? "lg:col-start-1" : ""}`}
              >
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
