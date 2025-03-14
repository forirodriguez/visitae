// src/components/common/LocaleSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Locale = "es" | "en";

const locales: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    // Reemplazar el locale actual en la URL con el nuevo
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <Select defaultValue={currentLocale} onValueChange={handleChange}>
      <SelectTrigger className="w-[110px]">
        <SelectValue placeholder="Idioma" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(locales).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
