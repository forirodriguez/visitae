import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=40&h=40&auto=format&fit=crop"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-white">Visitae</span>
            </Link>
            <p className="text-sm max-w-md">
              Plataforma inmobiliaria que conecta compradores y agentes en
              tiempo real. Encuentra tu hogar ideal y agenda visitas sin
              complicaciones.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              Para Compradores
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white">
                  Buscar propiedades
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Calculadora de hipoteca
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Guías de compra
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Agendar visitas
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Propiedades favoritas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              Para Vendedores
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white">
                  Listar propiedad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Panel de agente
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Gestión de agenda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Análisis de mercado
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Herramientas de marketing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">Acerca de</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Prensa
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Trabaja con nosotros
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Visitae. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm hover:text-white">
              Términos de servicio
            </Link>
            <Link href="#" className="text-sm hover:text-white">
              Política de privacidad
            </Link>
            <Link href="#" className="text-sm hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
