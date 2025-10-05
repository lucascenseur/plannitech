import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { UserRole } from "@/types/auth";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Routes publiques
    const publicRoutes = [
      "/", 
      "/auth/signin", 
      "/auth/signup", 
      "/auth/error",
      "/landing",
      "/features", 
      "/pricing", 
      "/contact", 
      "/blog",
      "/demo",
      "/test-auth",
      "/auth-test"
    ];
    
    // Routes multilingues publiques
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || 
      pathname.startsWith(route + "/") ||
      pathname.match(/^\/[a-z]{2}$/) || // /fr, /en, /es
      pathname.match(/^\/[a-z]{2}\/(landing|features|pricing|contact|blog|demo|auth|test-auth|auth-test)/) // /fr/landing, /fr/auth/signin, etc.
    );
    
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Vérifier si l'utilisateur est connecté
    if (!token) {
      return NextResponse.redirect(new URL("/fr/auth/signin", req.url));
    }

    // Routes d'authentification - rediriger si déjà connecté
    if (pathname.startsWith("/auth/") || pathname.match(/^\/[a-z]{2}\/auth\//)) {
      return NextResponse.redirect(new URL("/fr/dashboard", req.url));
    }

    // En mode test, on ignore la vérification d'onboarding
    // Vérifier l'onboarding (désactivé en mode test)
    // if (pathname.startsWith("/dashboard") && !token.onboardingCompleted) {
    //   return NextResponse.redirect(new URL("/onboarding", req.url));
    // }

    // Routes d'onboarding - rediriger si déjà complété (désactivé en mode test)
    // if (pathname.startsWith("/onboarding") && token.onboardingCompleted) {
    //   return NextResponse.redirect(new URL("/dashboard", req.url));
    // }

    // Vérifier les permissions pour les routes admin
    if (pathname.startsWith("/admin") || pathname.match(/^\/[a-z]{2}\/admin/)) {
      const userRole = token.role as UserRole;
      if (!["OWNER", "ADMIN"].includes(userRole)) {
        return NextResponse.redirect(new URL("/fr/dashboard", req.url));
      }
    }

    // Vérifier les permissions pour les routes de gestion
    if (pathname.startsWith("/settings") || pathname.match(/^\/[a-z]{2}\/settings/)) {
      const userRole = token.role as UserRole;
      if (!["OWNER", "ADMIN", "MANAGER"].includes(userRole)) {
        return NextResponse.redirect(new URL("/fr/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Routes publiques
        const publicRoutes = [
          "/", 
          "/auth/signin", 
          "/auth/signup", 
          "/auth/error",
          "/landing",
          "/features", 
          "/pricing", 
          "/contact", 
          "/blog",
          "/demo",
          "/test-auth"
        ];
        
        // Routes multilingues publiques
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || 
          pathname.startsWith(route + "/") ||
          pathname.match(/^\/[a-z]{2}$/) || // /fr, /en, /es
          pathname.match(/^\/[a-z]{2}\/(landing|features|pricing|contact|blog|demo|auth|test-auth|auth-test)/) // /fr/landing, /fr/auth/signin, etc.
        );
        
        if (isPublicRoute) {
          return true;
        }

        // Toutes les autres routes nécessitent une authentification
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
