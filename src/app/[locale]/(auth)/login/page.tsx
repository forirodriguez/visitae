import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Visitae Admin",
  description: "Inicia sesión en el panel de administración de Visitae",
};

type PageParams = Promise<{ locale: string }>;

export default async function LoginPage(props: { params: PageParams }) {
  // Espera a que se resuelvan los parámetros
  const { locale } = await props.params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <LoginForm locale={locale} />
      </div>
    </main>
  );
}
