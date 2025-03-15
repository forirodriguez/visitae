"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "es";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // Nueva variable de carga

  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === "development";

    const authStatus = localStorage.getItem("isAuthenticated") === "true";

    if (isDevelopment) {
      setIsAuthenticated(true);
      if (!authStatus) {
        localStorage.setItem("isAuthenticated", "true");
      }
      setCheckingAuth(false);
    } else {
      setIsAuthenticated(authStatus);
      setCheckingAuth(false);

      if (!authStatus) {
        setTimeout(() => {
          router.replace(`/${locale}/login`);
        }, 100);
      }
    }
  }, [router, locale]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
