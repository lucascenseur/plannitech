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
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Globe,
  Shield,
  Zap,
  Award,
  Sparkles,
  Crown,
  Timer,
  BarChart3,
  Smartphone,
  Cloud,
  Database,
  Lock,
  TrendingUp,
  Target,
  Lightbulb,
  Wrench,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface ContactPageProps {
  params: {
    locale: string;
  };
}

// Note: generateMetadata ne peut pas être utilisé avec des composants client
// Les métadonnées SEO sont gérées au niveau du layout

export default async function ContactPage({ params }: ContactPageProps) {
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
      <MultilingualHeader currentPage="contact" locale={locale} />
      
      {/* Hero Section - Style Stripe */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <MessageCircle className="w-4 h-4" />
            Contact
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="text-gray-900">
              Contactez
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              notre équipe
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.
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

      {/* Contact Methods - Style Stripe */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Email Contact */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Mail className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">Email</CardTitle>
                  <CardDescription className="text-lg">
                    Réponse sous 24h
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">support@plannitech.com</p>
                  <Button variant="outline" className="w-full">
                    Envoyer un email
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Phone Contact */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Phone className="w-8 h-8 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">Téléphone</CardTitle>
                  <CardDescription className="text-lg">
                    Support direct
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">+33 1 23 45 67 89</p>
                  <Button variant="outline" className="w-full">
                    Appeler maintenant
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Chat Contact */}
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl">Chat</CardTitle>
                  <CardDescription className="text-lg">
                    Support en temps réel
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Disponible 24/7</p>
                  <Button variant="outline" className="w-full">
                    Ouvrir le chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Envoyez-nous un message
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Formulaire de contact</CardTitle>
                  <CardDescription>
                    Dites-nous comment nous pouvons vous aider
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Support technique</option>
                        <option>Question commerciale</option>
                        <option>Demande de démo</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Décrivez votre demande..."
                      ></textarea>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Adresse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      123 Rue de la Scène<br />
                      75001 Paris, France
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      Horaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-600">
                      <p>Lundi - Vendredi: 9h - 18h</p>
                      <p>Samedi: 10h - 16h</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-purple-600" />
                      Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-600">
                      <p>Support technique: 24/7</p>
                      <p>Support commercial: 9h - 18h</p>
                      <p>Formation: Sur demande</p>
                    </div>
                  </CardContent>
                </Card>
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
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">Comment puis-je commencer ?</h3>
              <p className="text-gray-600">Créez votre compte gratuitement en quelques minutes. Aucune carte de crédit requise pour commencer.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Quel support proposez-vous ?</h3>
              <p className="text-gray-600">Nous offrons un support par email, chat en temps réel et téléphone. Plus de 95% de nos clients sont satisfaits.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Puis-je migrer mes données ?</h3>
              <p className="text-gray-600">Oui, notre équipe vous aide gratuitement à migrer vos données depuis votre système actuel.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Proposez-vous des formations ?</h3>
              <p className="text-gray-600">Nous organisons des sessions de formation gratuites pour tous nos clients, en ligne et en personne.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Style Stripe */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Commencez votre essai gratuit dès aujourd'hui
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