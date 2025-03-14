import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            ¿Listo para encontrar tu hogar ideal?
          </h2>
          <p className="text-xl text-blue-100">
            Regístrate y agenda visitas en tiempo real
          </p>

          <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
            Comenzar ahora
          </Button>

          <p className="text-blue-200">
            Más de 10,000 propiedades disponibles en toda España
          </p>
        </div>
      </div>
    </section>
  );
}
