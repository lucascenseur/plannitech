import { getTranslations } from "@/lib/translations";
import { MultilingualHeader } from "@/components/layout/MultilingualHeader";
import { MultilingualFooter } from "@/components/layout/MultilingualFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Calendar, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'fr' },
    { locale: 'en' },
    { locale: 'es' }
  ];
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  // Vérifier que la locale est supportée
  const supportedLocales = ['fr', 'en', 'es'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Charger les traductions
  const t = await getTranslations(locale as any, 'dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <MultilingualHeader currentPage="dashboard" locale={locale} />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t.title || 'Tableau de bord'}
            </h1>
            <p className="text-gray-600">
              {t.welcome || 'Bienvenue'} sur votre tableau de bord Plannitech
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.stats?.projects || 'Projets actifs'}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +2 ce mois-ci
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.stats?.events || 'Événements à venir'}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +4 cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.stats?.contacts || 'Contacts'}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +12 nouveaux
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.stats?.budget || 'Budget total'}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€45,231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% vs mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.projects?.title || 'Mes projets'}</CardTitle>
                <CardDescription>
                  Gérez vos projets de spectacle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Festival d'été 2024</h4>
                      <p className="text-sm text-gray-600">3 événements programmés</p>
                    </div>
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                      Actif
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Tournée nationale</h4>
                      <p className="text-sm text-gray-600">12 dates confirmées</p>
                    </div>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      En cours
                    </span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/${locale}/projects`}>
                    {t.projects?.viewAll || 'Voir tous les projets'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.events?.title || 'Événements à venir'}</CardTitle>
                <CardDescription>
                  Vos prochains événements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Concert Jazz</h4>
                      <p className="text-sm text-gray-600">15 Janvier 2024 - 20h00</p>
                    </div>
                    <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Bientôt
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Spectacle de danse</h4>
                      <p className="text-sm text-gray-600">22 Janvier 2024 - 19h30</p>
                    </div>
                    <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Bientôt
                    </span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/${locale}/planning`}>
                    {t.events?.viewAll || 'Voir tous les événements'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Test Authentication */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Test d'authentification</span>
              </CardTitle>
              <CardDescription>
                Vérifiez que l'authentification fonctionne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Cette page est protégée par l'authentification. Si vous pouvez la voir, 
                  l'authentification fonctionne correctement.
                </p>
                <div className="flex space-x-2">
                  <Button asChild>
                    <Link href={`/${locale}/auth/signin`}>
                      Se connecter
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/${locale}/landing`}>
                      Retour à l'accueil
                    </Link>
                  </Button>
                </div>
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

