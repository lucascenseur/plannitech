"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

export function useLocale() {
  const pathname = usePathname();

  // Extraire la locale de l'URL
  const getCurrentLocale = useCallback(() => {
    const match = pathname.match(/^\/([a-z]{2})\//);
    return match?.[1] || 'fr';
  }, [pathname]);

  // Générer une URL avec la locale
  const getLocalizedUrl = useCallback((path: string, locale?: string) => {
    const currentLocale = locale || getCurrentLocale();
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${currentLocale}/${cleanPath}`;
  }, [getCurrentLocale]);

  // Vérifier si une route est multilingue
  const isMultilingualRoute = useCallback((path: string) => {
    return path.match(/^\/[a-z]{2}\//);
  }, []);

  return {
    currentLocale: getCurrentLocale(),
    getLocalizedUrl,
    isMultilingualRoute,
    pathname,
  };
}
