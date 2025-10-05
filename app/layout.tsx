import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { AlternateLinks } from "@/components/seo/AlternateLinks";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plannitech - Gestion du spectacle vivant",
  description: "Plateforme SaaS pour la gestion complète du spectacle vivant",
  keywords: ["spectacle", "gestion", "événement", "billet", "réservation", "plannitech"],
  alternates: {
    canonical: "https://plannitech.com",
    languages: {
      'fr': 'https://plannitech.com/fr',
      'en': 'https://plannitech.com/en',
      'es': 'https://plannitech.com/es',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <AlternateLinks />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
