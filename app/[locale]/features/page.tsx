import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "@/lib/translations";
import { generateSEOMetadata, generateStructuredData, pageSEOConfig } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultilingualHeader } from "@/components/layout/MultilingualHeader";
import { MultilingualFooter } from "@/components/layout/MultilingualFooter";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Globe,
  Headphones,
  Clock,
  Settings,
  Database,
  Smartphone,
  Cloud,
  Lock,
  TrendingUp,
  Target,
  Lightbulb,
  Wrench,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  Award,
  Timer,
  BarChart
} from "lucide-react";
import Link from "next/link";

interface FeaturesPageProps {
  params: {
    locale: string;
  };
}

// Note: generateMetadata ne peut pas être utilisé avec des composants client
// Les métadonnées SEO sont gérées au niveau du layout

export default async function FeaturesPage({ params }: FeaturesPageProps) {
  const { locale } = params;

  // Vérifier que la locale est supportée
  const supportedLocales = ['fr', 'en', 'es'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Charger les traductions
  const t = await getTranslations(locale as any, 'landing');

  return (
    <div className="min-h-screen bg-white">
      <MultilingualHeader currentPage="features" locale={locale} />
      
      {/* Hero Section - Style Stripe */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Fonctionnalités
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="text-gray-900">
              {t.features?.title || 'Tout ce dont vous avez besoin'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              pour réussir
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.features?.subtitle || 'Une plateforme complète pour gérer tous les aspects de vos spectacles'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/auth/signup`}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Commencer gratuitement
              </Button>
            </Link>
            <Link href={`/${locale}/demo`}>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-12 py-4 text-xl font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid - Style Stripe */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Planning Feature */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Calendar className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">{t.features?.planning?.title || 'Planification'}</CardTitle>
                  <CardDescription className="text-lg">
                    {t.features?.planning?.description || 'Organisez vos événements avec des outils intuitifs'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.features?.planning?.benefits?.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    )) || [
                      <li key="1" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Calendrier interactif</span>
                      </li>,
                      <li key="2" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Gestion des répétitions</span>
                      </li>,
                      <li key="3" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Planning technique</span>
                      </li>
                    ]}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Budget Feature */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <DollarSign className="w-8 h-8 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">{t.features?.budget?.title || 'Budget'}</CardTitle>
                  <CardDescription className="text-lg">
                    {t.features?.budget?.description || 'Contrôlez vos finances avec précision'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.features?.budget?.benefits?.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    )) || [
                      <li key="1" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Suivi des dépenses</span>
                      </li>,
                      <li key="2" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Rapports financiers</span>
                      </li>,
                      <li key="3" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Prévisions budgétaires</span>
                      </li>
                    ]}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contacts Feature */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-8 h-8 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">{t.features?.contacts?.title || 'Contacts'}</CardTitle>
                  <CardDescription className="text-lg">
                    {t.features?.contacts?.description || 'Centralisez tous vos contacts professionnels'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.features?.contacts?.benefits?.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    )) || [
                      <li key="1" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Base de données complète</span>
                      </li>,
                      <li key="2" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Historique des échanges</span>
                      </li>,
                      <li key="3" className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Segmentation avancée</span>
                      </li>
                    ]}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Fonctionnalités avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils professionnels pour optimiser votre gestion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">Tableaux de bord détaillés</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile</h3>
              <p className="text-gray-600">Application mobile native</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Cloud className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cloud</h3>
              <p className="text-gray-600">Synchronisation automatique</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
              <p className="text-gray-600">Chiffrement de bout en bout</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Style Stripe */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Prêt à découvrir toutes nos fonctionnalités ?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Commencez votre essai gratuit et explorez toutes les possibilités de Plannitech
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/auth/signup`}>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Commencer gratuitement
              </Button>
            </Link>
            <Link href={`/${locale}/demo`}>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 text-xl font-semibold rounded-lg"
              >
                Voir la démo
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>Essai gratuit 14 jours • Aucune carte requise • Support 24/7</p>
          </div>
        </div>
      </section>

      <MultilingualFooter locale={locale} />
    </div>
  );
}