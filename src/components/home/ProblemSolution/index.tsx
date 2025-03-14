import { Check, Clock, FileSearch, Phone } from "lucide-react";

export default function ProblemSolution() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
              <span>El problema</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              El proceso inmobiliario tradicional es ineficiente
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">
                    Tiempo perdido en coordinación
                  </h3>
                  <p className="text-muted-foreground">
                    Múltiples llamadas y mensajes para coordinar una simple
                    visita a una propiedad.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <FileSearch className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">
                    Dificultad para encontrar propiedades adecuadas
                  </h3>
                  <p className="text-muted-foreground">
                    Filtros limitados y falta de información detallada sobre las
                    propiedades y su entorno.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Comunicación fragmentada</h3>
                  <p className="text-muted-foreground">
                    Información dispersa entre correos, llamadas y mensajes sin
                    un seguimiento centralizado.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-100 px-4 py-1 text-sm font-medium text-teal-800">
              <span>La solución</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Visitae simplifica todo el proceso
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Agendamiento en tiempo real</h3>
                  <p className="text-muted-foreground">
                    Reserva visitas instantáneamente según la disponibilidad
                    real de los agentes, sin intermediarios.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">
                    Búsqueda inteligente y personalizada
                  </h3>
                  <p className="text-muted-foreground">
                    Filtros avanzados y mapas interactivos con puntos de interés
                    para encontrar la propiedad ideal.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Gestión centralizada</h3>
                  <p className="text-muted-foreground">
                    Toda la información, documentos y comunicación en un solo
                    lugar, accesible para todas las partes.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
