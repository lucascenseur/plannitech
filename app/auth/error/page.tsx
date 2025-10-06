"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthErrorRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page d'erreur en français par défaut
    router.replace("/fr/auth/error");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}
