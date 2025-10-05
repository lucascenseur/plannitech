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
  Play,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Crown,
  Sparkles,
  Award,
  Timer,
  Headphones,
  Cloud,
  Database,
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
  ExternalLink,
  MessageCircle,
  Clock,
  Shield
} from "lucide-react";
import Link from "next/link";

interface DemoPageProps {
  params: {
    locale: string;
  };
}

// Note: generateMetadata ne peut pas être utilisé avec des composants client
// Les métadonnées SEO sont gérées au niveau du layout

export default async function DemoPage({ params }: DemoPageProps) {
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
      <MultilingualHeader currentPage="demo" locale={locale} />
      
      {/* Hero Section - Style Stripe */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Play className="w-4 h-4" />
            Démo
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="text-gray-900">
              Découvrez
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plannitech
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Testez toutes les fonctionnalités de notre plateforme en quelques minutes
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
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-12 py-4 text-xl font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <Play className="w-5 h-5 mr-2" />
              Voir la démo vidéo
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Features - Style Stripe */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Explorez nos fonctionnalités
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment Plannitech peut transformer votre gestion d'événements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Planning Demo */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Calendar className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">Planification</CardTitle>
                  <CardDescription className="text-lg">
                    Interface intuitive et puissante
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Concert Jazz</span>
                      </div>
                      <div className="text-xs text-gray-600">15 Mars 2024 - 20h00</div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Essayer la planification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Demo */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <DollarSign className="w-8 h-8 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">Budget</CardTitle>
                  <CardDescription className="text-lg">
                    Suivi financier en temps réel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Budget total</span>
                        <span className="font-semibold">€15,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Dépensé</span>
                        <span className="text-green-600">€8,500</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '57%' }}></div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Essayer le budget
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contacts Demo */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-8 h-8 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">Contacts</CardTitle>
                  <CardDescription className="text-lg">
                    Base de données centralisée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          JD
                        </div>
                        <div>
                          <div className="font-medium text-sm">Jean Dupont</div>
                          <div className="text-xs text-gray-600">Directeur Théâtre</div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Essayer les contacts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Démo interactive
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Testez Plannitech directement dans votre navigateur
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gray-900 text-white">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm">demo.plannitech.com</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Démo interactive disponible
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Explorez toutes les fonctionnalités de Plannitech avec notre démo interactive. 
                    Aucune inscription requise, testez immédiatement.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Lancer la démo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
                    >
                      Voir la vidéo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez pourquoi nos clients nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Plannitech a révolutionné notre façon de gérer les spectacles. L'interface est intuitive et les fonctionnalités sont complètes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold">Jean Dupont</div>
                    <div className="text-sm text-gray-600">Directeur, Théâtre National</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "La gestion budgétaire est exceptionnelle. Nous avons réduit nos coûts de 30% grâce aux outils de suivi de Plannitech."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    ML
                  </div>
                  <div>
                    <div className="font-semibold">Marie Leroy</div>
                    <div className="text-sm text-gray-600">Productrice, Festival d'Avignon</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "L'équipe support est réactive et les mises à jour régulières nous permettent d'être toujours à la pointe de la technologie."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    PC
                  </div>
                  <div>
                    <div className="font-semibold">Pierre Chen</div>
                    <div className="text-sm text-gray-600">Régisseur, Opéra de Paris</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <Link href={`/${locale}/contact`}>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 text-xl font-semibold rounded-lg"
              >
                Nous contacter
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