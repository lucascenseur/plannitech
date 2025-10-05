import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "@/lib/translations";
import { generateSEOMetadata, generateStructuredData, pageSEOConfig } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultilingualHeader } from "@/components/layout/MultilingualHeader";
import { MultilingualFooter } from "@/components/layout/MultilingualFooter";
import { ExitIntentPopup } from "@/components/ui/ExitIntentPopup";
import { 
  AnimatedSection, 
  AnimatedCard, 
  AnimatedText, 
  AnimatedButton, 
  AnimatedGrid, 
  AnimatedGridItem
} from "@/components/ui/animations";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Clock,
  X,
  Gift,
  Timer
} from "lucide-react";
import Link from "next/link";

interface LandingPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { locale } = params;
  const seoConfig = pageSEOConfig.landing[locale as keyof typeof pageSEOConfig.landing];

  return generateSEOMetadata({
    locale: locale as any,
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    path: '/landing',
    ogTitle: seoConfig.title,
    ogDescription: seoConfig.description,
    ogImage: `https://plannitech.com/images/og-landing-${locale}.jpg`,
    twitterTitle: seoConfig.title,
    twitterDescription: seoConfig.description,
    twitterImage: `https://plannitech.com/images/twitter-landing-${locale}.jpg`,
    structuredData: generateStructuredData({
      locale: locale as any,
      type: 'software',
      title: seoConfig.title,
      description: seoConfig.description,
      url: `https://plannitech.com/${locale}/landing`,
      additionalData: {
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": locale === 'fr' ? "Essai gratuit 14 jours" : 
                        locale === 'en' ? "14-day free trial" : 
                        "Prueba gratuita de 14 días"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "127",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    })
  });
}

export default async function LandingPage({ params }: LandingPageProps) {
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
      <MultilingualHeader currentPage="home" locale={locale} />
      
      {/* Hero Section avec effets waou */}
      <AnimatedSection className="py-24 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          {/* Titre principal avec effet waou */}
          <AnimatedText 
            as="h1" 
            className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight relative"
            delay={0.1}
          >
            <span className="text-gray-900">
              {t.hero?.title || 'Gérez vos spectacles'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.hero?.subtitle || 'avec simplicité'}
            </span>
          </AnimatedText>
          
          <AnimatedText 
            as="p" 
            className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            delay={0.2}
          >
            {t.hero?.description || 'La plateforme complète pour organiser, planifier et gérer tous vos événements culturels.'}
          </AnimatedText>

          {/* CTA Buttons avec effets waou */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={`/${locale}/auth/signup`}>
              <AnimatedButton 
                size="lg" 
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group overflow-hidden"
                delay={0.3}
              >
                <span className="relative z-10">{t.hero?.cta || 'Commencer gratuitement'}</span>
              </AnimatedButton>
            </Link>
            <Link href={`/${locale}/demo`}>
              <AnimatedButton 
                variant="outline" 
                size="lg" 
                className="relative border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-12 py-4 text-xl font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
                delay={0.4}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t.hero?.demo || 'Voir la démo'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </AnimatedButton>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t.hero?.trust?.trial || 'Essai gratuit 14 jours'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t.hero?.trust?.card || 'Aucune carte requise'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t.hero?.trust?.support || 'Support 24/7'}</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Demo Section */}
      <AnimatedSection className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <AnimatedText 
            as="h2" 
            className="text-4xl font-bold text-gray-900 mb-8"
            delay={0.1}
          >
            {t.demo?.title || 'Voir Plannitech en action'}
          </AnimatedText>
          <AnimatedText 
            as="p" 
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            delay={0.2}
          >
            {t.demo?.subtitle || 'Découvrez comment nos clients organisent leurs spectacles avec Plannitech'}
          </AnimatedText>
          
          {/* Demo Video/Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Démonstration Plannitech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section avec effets waou */}
      <AnimatedSection className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText 
              as="h2" 
              className="text-4xl font-bold text-gray-900 mb-8"
              delay={0.1}
            >
              {t.features?.title || 'Tout ce dont vous avez besoin'}
            </AnimatedText>
            <AnimatedText 
              as="p" 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              delay={0.2}
            >
              {t.features?.subtitle || 'Une plateforme complète pour gérer tous les aspects de vos spectacles'}
            </AnimatedText>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up group">
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

            <div className="animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
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
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Suivi des dépenses</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Rapports financiers</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Prévisions budgétaires</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
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
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Base de données complète</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Historique des échanges</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Segmentation avancée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section avec effets waou */}
      <AnimatedSection className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <AnimatedText 
            as="h2" 
            className="text-4xl font-bold text-white mb-16 relative"
            delay={0.1}
          >
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {t.stats?.title || 'Des résultats qui parlent'}
            </span>
          </AnimatedText>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in-up group">
              <div className="relative">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  500+
                </div>
              </div>
              <div className="text-blue-200 group-hover:text-white transition-colors duration-300">Professionnels</div>
            </div>
            <div className="text-center animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
              <div className="relative">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  10k+
                </div>
              </div>
              <div className="text-blue-200 group-hover:text-white transition-colors duration-300">Événements</div>
            </div>
            <div className="text-center animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  98%
                </div>
              </div>
              <div className="text-blue-200 group-hover:text-white transition-colors duration-300">Satisfaction</div>
            </div>
            <div className="text-center animate-fade-in-up group" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  24/7
                </div>
              </div>
              <div className="text-blue-200 group-hover:text-white transition-colors duration-300">Support</div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section avec effets waou */}
      <AnimatedSection className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText 
              as="h2" 
              className="text-4xl font-bold text-gray-900 mb-8"
              delay={0.1}
            >
              {t.testimonials?.title || 'Ce que disent nos clients'}
            </AnimatedText>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "Plannitech a révolutionné notre façon de gérer les spectacles. 
                    L'interface est intuitive et les fonctionnalités sont complètes."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">JD</span>
                    </div>
                    <div>
                      <div className="font-semibold">Jean Dupont</div>
                      <div className="text-sm text-gray-500">Directeur, Théâtre National</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "La gestion budgétaire est exceptionnelle. Nous avons réduit nos coûts de 30% 
                    grâce aux outils de suivi de Plannitech."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">ML</span>
                    </div>
                    <div>
                      <div className="font-semibold">Marie Leroy</div>
                      <div className="text-sm text-gray-500">Productrice, Festival d'Avignon</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "L'équipe support est réactive et les mises à jour régulières 
                    nous permettent d'être toujours à la pointe de la technologie."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">PC</span>
                    </div>
                    <div>
                      <div className="font-semibold">Pierre Chen</div>
                      <div className="text-sm text-gray-500">Régisseur, Opéra de Paris</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Final Section avec effets waou */}
      <AnimatedSection className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <AnimatedText 
            as="h2" 
            className="text-4xl font-bold text-white mb-8"
            delay={0.1}
          >
            {t.cta?.title || 'Prêt à transformer votre gestion de spectacles ?'}
          </AnimatedText>
          <AnimatedText 
            as="p" 
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            delay={0.2}
          >
            {t.cta?.subtitle || 'Rejoignez des centaines de professionnels qui font confiance à Plannitech'}
          </AnimatedText>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/auth/signup`}>
              <AnimatedButton 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                delay={0.3}
              >
                {t.cta?.primary || 'Commencer gratuitement'}
              </AnimatedButton>
            </Link>
            <Link href={`/${locale}/demo`}>
              <AnimatedButton 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 text-xl font-semibold rounded-lg"
                delay={0.4}
              >
                {t.cta?.secondary || 'Voir la démo'}
              </AnimatedButton>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>Essai gratuit 14 jours • Aucune carte requise • Support 24/7</p>
          </div>
        </div>
      </AnimatedSection>

      <MultilingualFooter locale={locale} />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup locale={locale} />
    </div>
  );
}