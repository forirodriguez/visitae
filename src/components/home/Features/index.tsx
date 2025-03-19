import { Calendar, Calculator, Map, FileText } from "lucide-react";
import Image from "next/image";

export default function Features() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-blue-800" />,
      title: "Agendamiento en tiempo real",
      description:
        "Programa visitas físicas o virtuales según la disponibilidad real de los agentes, con sincronización automática con Google Calendar.",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=500&h=300&auto=format&fit=crop",
    },
    {
      icon: <Map className="h-10 w-10 text-blue-800" />,
      title: "Mapas interactivos",
      description:
        "Visualiza propiedades en el mapa con puntos de interés cercanos como escuelas, hospitales, transporte público y comercios.",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=500&h=300&auto=format&fit=crop",
    },
    {
      icon: <Calculator className="h-10 w-10 text-blue-800" />,
      title: "Calculadoras financieras",
      description:
        "Calcula hipotecas, retorno de inversión y compara diferentes escenarios financieros para tomar decisiones informadas.",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&h=300&auto=format&fit=crop",
    },
    {
      icon: <FileText className="h-10 w-10 text-blue-800" />,
      title: "Gestión documental",
      description:
        "Almacena, comparte y firma documentos digitalmente en un entorno seguro y centralizado para todas las partes.",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=500&h=300&auto=format&fit=crop",
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
                  src={feature.image}
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
