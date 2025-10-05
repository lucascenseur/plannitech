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
  CheckCircle, 
  Star,
  ArrowRight,
  Zap,
  Crown,
  Sparkles,
  Award,
  Timer,
  Users,
  Shield,
  Headphones,
  Cloud,
  Database,
  BarChart3,
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  Target,
  Lightbulb,
  Wrench,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface PricingPageProps {
  params: {
    locale: string;
  };
}

// Note: generateMetadata ne peut pas être utilisé avec des composants client
// Les métadonnées SEO sont gérées au niveau du layout

export default async function PricingPage({ params }: PricingPageProps) {
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
      <MultilingualHeader currentPage="pricing" locale={locale} />
      
      {/* Hero Section - Style Stripe */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Crown className="w-4 h-4" />
            Tarifs
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="text-gray-900">
              Tarifs
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              transparents
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
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

      {/* Pricing Cards - Style Stripe */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription className="text-lg">
                    Parfait pour les artistes indépendants
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">29€</span>
                    <span className="text-gray-600">/mois</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Jusqu'à 5 événements</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Gestion des contacts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Planning basique</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Support email</span>
                    </li>
                  </ul>
                  <Link href={`/${locale}/auth/signup`} className="block mt-6">
                    <Button className="w-full">
                      Commencer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Professional Plan - Featured */}
            <div className="group relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 mr-1" />
                  Populaire
                </Badge>
              </div>
              <Card className="h-full border-2 border-blue-200 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-100"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Crown className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription className="text-lg">
                    Idéal pour les compagnies et organisateurs
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">79€</span>
                    <span className="text-gray-600">/mois</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Événements illimités</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Gestion budgétaire avancée</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Analytics détaillés</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Support prioritaire</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Intégrations API</span>
                    </li>
                  </ul>
                  <Link href={`/${locale}/auth/signup`} className="block mt-6">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Commencer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Enterprise Plan */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription className="text-lg">
                    Solution complète pour les grandes structures
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">199€</span>
                    <span className="text-gray-600">/mois</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Tout Professional</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Gestion multi-équipes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Formation personnalisée</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Support dédié 24/7</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Développements sur mesure</span>
                    </li>
                  </ul>
                  <Link href={`/${locale}/contact`} className="block mt-6">
                    <Button variant="outline" className="w-full">
                      Nous contacter
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Comparaison des fonctionnalités
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez ce qui est inclus dans chaque plan
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-8">Fonctionnalités</h3>
              <div className="space-y-4 text-left">
                <p className="font-medium">Événements</p>
                <p className="font-medium">Contacts</p>
                <p className="font-medium">Budget</p>
                <p className="font-medium">Analytics</p>
                <p className="font-medium">Support</p>
                <p className="font-medium">API</p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-8">Starter</h3>
              <div className="space-y-4">
                <p className="text-green-600">5 max</p>
                <p className="text-green-600">✓</p>
                <p className="text-red-600">✗</p>
                <p className="text-red-600">✗</p>
                <p className="text-green-600">Email</p>
                <p className="text-red-600">✗</p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-8">Professional</h3>
              <div className="space-y-4">
                <p className="text-green-600">Illimité</p>
                <p className="text-green-600">✓</p>
                <p className="text-green-600">✓</p>
                <p className="text-green-600">✓</p>
                <p className="text-green-600">Prioritaire</p>
                <p className="text-green-600">✓</p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-8">Enterprise</h3>
              <div className="space-y-4">
                <p className="text-green-600">Illimité</p>
                <p className="text-green-600">✓</p>
                <p className="text-green-600">✓</p>
                <p className="text-green-600">✓</p>
                <p className="text-green-600">Dédié 24/7</p>
                <p className="text-green-600">✓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur nos tarifs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">Puis-je changer de plan à tout moment ?</h3>
              <p className="text-gray-600">Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Y a-t-il des frais de configuration ?</h3>
              <p className="text-gray-600">Non, il n'y a aucun frais de configuration. Vous payez uniquement votre abonnement mensuel.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Que se passe-t-il si j'annule ?</h3>
              <p className="text-gray-600">Vous gardez accès à votre compte jusqu'à la fin de votre période de facturation. Vos données sont conservées 30 jours.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Proposez-vous des remises ?</h3>
              <p className="text-gray-600">Oui, nous offrons des remises pour les paiements annuels et les organisations à but non lucratif.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Style Stripe */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Rejoignez des centaines de professionnels qui font confiance à Plannitech
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