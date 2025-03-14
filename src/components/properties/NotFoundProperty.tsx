import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundProperty({ locale }: { locale: string }) {
  return (
    <div className="container py-20 text-center">
      <div className="bg-yellow-50 text-yellow-600 p-6 rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Propiedad no encontrada</h2>
        <p className="mb-6">
          La propiedad que estás buscando no existe o ha sido eliminada.
        </p>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/propiedades`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a propiedades
          </Link>
        </Button>
      </div>
    </div>
  );
}
