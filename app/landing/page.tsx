"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { 
  AnimatedSection, 
  AnimatedCard, 
  AnimatedText, 
  AnimatedButton, 
  AnimatedGrid, 
  AnimatedGridItem,
  AnimatedIcon,
  AnimatedTestimonial,
  AnimatedCounter
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
  Shield,
  Zap,
  Globe,
  Headphones
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MarketingHeader currentPage="home" />

      {/* Hero Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <Badge className="mb-4" variant="secondary">
              🎉 Nouveau : IA intégrée pour l'optimisation des plannings
            </Badge>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              La solution complète pour la gestion du{" "}
              <span className="text-blue-600">spectacle vivant</span>
            </h1>
          </AnimatedText>
          <AnimatedText delay={0.6}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Organisez, planifiez et monétisez vos événements culturels avec une plateforme 
              moderne et intuitive. De la création à la billetterie, tout en un seul endroit.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>
          </AnimatedButton>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <AnimatedText className="text-center" delay={1.0}>
              <div className="text-3xl font-bold text-blue-600">
                <AnimatedCounter end={500} />+
              </div>
              <div className="text-gray-600">Organisateurs</div>
            </AnimatedText>
            <AnimatedText className="text-center" delay={1.1}>
              <div className="text-3xl font-bold text-blue-600">
                <AnimatedCounter end={10} />k+
              </div>
              <div className="text-gray-600">Événements</div>
            </AnimatedText>
            <AnimatedText className="text-center" delay={1.2}>
              <div className="text-3xl font-bold text-blue-600">
                <AnimatedCounter end={50} />k+
              </div>
              <div className="text-gray-600">Billets vendus</div>
            </AnimatedText>
            <AnimatedText className="text-center" delay={1.3}>
              <div className="text-3xl font-bold text-blue-600">
                <AnimatedCounter end={98} />%
              </div>
              <div className="text-gray-600">Satisfaction</div>
            </AnimatedText>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une suite complète d'outils pour gérer efficacement vos événements culturels
            </p>
          </AnimatedText>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard delay={0.1}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.2}>
                    <Calendar className="w-12 h-12 text-blue-600 mb-4" />
                  </AnimatedIcon>
                  <CardTitle>Gestion d'événements</CardTitle>
                  <CardDescription>
                    Créez et organisez vos spectacles, concerts et représentations avec un planning intuitif.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.3}>
                    <Users className="w-12 h-12 text-green-600 mb-4" />
                  </AnimatedIcon>
                  <CardTitle>Base de données artistes</CardTitle>
                  <CardDescription>
                    Gérez vos contacts, artistes et techniciens avec leurs compétences et disponibilités.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.4}>
                    <DollarSign className="w-12 h-12 text-purple-600 mb-4" />
                  </AnimatedIcon>
                  <CardTitle>Gestion financière</CardTitle>
                  <CardDescription>
                    Budgets, devis, factures et suivi des dépenses pour une gestion financière complète.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.5}>
                    <BarChart3 className="w-12 h-12 text-orange-600 mb-4" />
                  </AnimatedIcon>
                  <CardTitle>Analytics & Rapports</CardTitle>
                  <CardDescription>
                    Tableaux de bord et rapports détaillés pour suivre vos performances.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.5}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.6}>
                    <Shield className="w-12 h-12 text-red-600 mb-4" />
                  </AnimatedIcon>
                  <CardTitle>Outils techniques</CardTitle>
                  <CardDescription>
                    Fiches techniques, plans de feu, inventaire matériel et checklists.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.6}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.7}>
                    <Zap className="w-12 h-12 text-yellow-600 mb-4" />
                  </AnimatedIcon>
                  <CardTitle>Automatisation</CardTitle>
                  <CardDescription>
                    Workflows automatisés, notifications et intégrations pour gagner du temps.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedCard delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>Freelance</CardTitle>
                  <CardDescription>Parfait pour les indépendants</CardDescription>
                  <div className="text-4xl font-bold">19€<span className="text-lg text-gray-500">/mois</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      5 projets actifs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      100 contacts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Planning illimité
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Support email
                    </li>
                  </ul>
                  <Button className="w-full mt-6">Commencer</Button>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card className="border-blue-500 relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2" variant="default">
                  Populaire
                </Badge>
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>Idéal pour les petites équipes</CardDescription>
                  <div className="text-4xl font-bold">49€<span className="text-lg text-gray-500">/mois</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      25 projets actifs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      500 contacts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      5 utilisateurs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Intégrations avancées
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Support prioritaire
                    </li>
                  </ul>
                  <Button className="w-full mt-6">Commencer</Button>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>Pour les organisations</CardDescription>
                  <div className="text-4xl font-bold">99€<span className="text-lg text-gray-500">/mois</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Projets illimités
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Contacts illimités
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      15 utilisateurs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      API complète
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Support dédié
                    </li>
                  </ul>
                  <Button className="w-full mt-6">Commencer</Button>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>

          <AnimatedText className="text-center mt-12" delay={0.6}>
            <p className="text-gray-600 mb-4">Besoin d'un plan personnalisé ?</p>
            <Button variant="outline">Contactez-nous</Button>
          </AnimatedText>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Rejoignez des centaines d'organisateurs qui nous font confiance
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedTestimonial delay={0.1}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Plannitech a révolutionné notre gestion d'événements. L'interface est intuitive 
                    et nous fait gagner des heures chaque semaine."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">MD</span>
                    </div>
                    <div>
                      <div className="font-semibold">Marie Dubois</div>
                      <div className="text-sm text-gray-500">Directrice, Théâtre Municipal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedTestimonial>

            <AnimatedTestimonial delay={0.2}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "La gestion financière intégrée est un game-changer. Plus besoin de plusieurs 
                    outils, tout est centralisé."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold">JM</span>
                    </div>
                    <div>
                      <div className="font-semibold">Jean Martin</div>
                      <div className="text-sm text-gray-500">Producteur, Tech Events</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedTestimonial>

            <AnimatedTestimonial delay={0.3}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "L'équipe support est exceptionnelle. Ils comprennent nos besoins et nous 
                    accompagnent parfaitement."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-semibold">SL</span>
                    </div>
                    <div>
                      <div className="font-semibold">Sophie Leroy</div>
                      <div className="text-sm text-gray-500">Organisatrice, Festival d'Été</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedTestimonial>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à transformer votre gestion d'événements ?
            </h2>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Rejoignez les professionnels du spectacle qui font confiance à Plannitech. 
              Essai gratuit de 14 jours, sans engagement.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Commencer maintenant
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                <Headphones className="mr-2 h-5 w-5" />
                Parler à un expert
              </Button>
            </div>
          </AnimatedButton>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
