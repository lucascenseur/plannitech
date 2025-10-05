"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TestRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers le dashboard après 1 seconde
    const timer = setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Test de redirection
        </h1>
        <p className="text-gray-600 mb-4">
          Redirection vers le dashboard dans 2 secondes...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
