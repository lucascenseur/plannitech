"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface RedirectHandlerProps {
  children: React.ReactNode;
}

export function RedirectHandler({ children }: RedirectHandlerProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier si l'URL ne contient pas de locale
    const isRootRoute = pathname === "/";
    const isAuthRoute = pathname.startsWith("/auth/");
    const isPublicRoute = ["/landing", "/features", "/pricing", "/contact", "/blog", "/demo"].includes(pathname);
    
    // Si c'est une route racine ou publique sans locale, rediriger vers /fr/
    if (isRootRoute || isAuthRoute || isPublicRoute) {
      const targetPath = pathname === "/" ? "/fr" : `/fr${pathname}`;
      router.replace(targetPath);
    }
  }, [pathname, router]);

  // Si c'est une route qui nécessite une redirection, afficher un loader
  const needsRedirect = pathname === "/" || 
    pathname.startsWith("/auth/") || 
    ["/landing", "/features", "/pricing", "/contact", "/blog", "/demo"].includes(pathname);

  if (needsRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirection...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
