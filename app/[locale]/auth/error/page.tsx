import { getTranslations } from "@/lib/translations";
import { MultilingualHeader } from "@/components/layout/MultilingualHeader";
import { MultilingualFooter } from "@/components/layout/MultilingualFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AuthErrorPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'fr' },
    { locale: 'en' },
    { locale: 'es' }
  ];
}

export default async function AuthErrorPage({ params, searchParams }: AuthErrorPageProps) {
  const { locale } = await params;
  const { error } = await searchParams;

  // Vérifier que la locale est supportée
  const supportedLocales = ['fr', 'en', 'es'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Charger les traductions
  const t = await getTranslations(locale as any, 'auth');

  const errorMessage = t.error?.messages?.[error as keyof typeof t.error.messages] || t.error?.messages?.Default || 'Une erreur inattendue s\'est produite.';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-orange-100">
      <MultilingualHeader currentPage="auth" locale={locale} />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href={`/${locale}/landing`} className="inline-flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Plannitech</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {t.error?.title || 'Erreur d\'authentification'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t.error?.subtitle || 'Un problème est survenu lors de votre connexion'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg">Erreur de connexion</CardTitle>
              </div>
              <CardDescription>
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                  <Link href={`/${locale}/auth/signin`}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t.error?.retry || 'Réessayer'}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/${locale}/landing`}>
                    <Home className="mr-2 h-4 w-4" />
                    {t.error?.home || 'Retour à l\'accueil'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <MultilingualFooter 
        locale={locale}
        currentT={{
          product: {
            features: t.navigation?.features || 'Fonctionnalités',
            pricing: t.navigation?.pricing || 'Tarifs',
            demo: t.navigation?.demo || 'Démo',
            blog: t.navigation?.blog || 'Blog'
          },
          resources: {
            documentation: 'Documentation',
            guides: 'Guides',
            api: 'API',
            support: 'Support'
          },
          support: {
            help: 'Aide',
            contact: 'Contact',
            status: 'Statut',
            community: 'Communauté'
          },
          legal: {
            privacy: 'Confidentialité',
            terms: 'Conditions',
            cookies: 'Cookies',
            security: 'Sécurité'
          },
          newsletter: {
            title: 'Newsletter',
            subtitle: 'Recevez nos dernières actualités',
            placeholder: 'Votre email',
            button: 'S\'abonner'
          }
        }}
      />
    </div>
  );
}

