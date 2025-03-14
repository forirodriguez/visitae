import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-20 bg-blue-800 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Transforma tu negocio inmobiliario hoy mismo
            </h2>
            <p className="text-blue-100 md:text-xl max-w-[600px]">
              Únete a miles de agentes inmobiliarios que ya están ahorrando
              tiempo y cerrando más ventas con Visitae.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
            <Button
              size="lg"
              className="bg-white text-blue-800 hover:bg-blue-50"
            >
              Comenzar ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
            >
              Solicitar demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
