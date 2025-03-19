"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

// Nuevo contexto para controlar cuándo el tema está listo para evitar problemas de hidratación
const ThemeContext = createContext({ themeReady: false });

export const useThemeReady = () => useContext(ThemeContext);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [themeReady, setThemeReady] = useState(false);

  // Solo activamos el tema cuando el componente está montado en el cliente
  useEffect(() => {
    setThemeReady(true);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeReady }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}
