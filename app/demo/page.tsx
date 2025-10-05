"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { 
  AnimatedSection, 
  AnimatedText, 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedIcon,
  AnimatedGrid,
  AnimatedGridItem
} from "@/components/ui/animations";
import { 
  Calendar, 
  Play,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DemoPage() {
  const [selectedDemo, setSelectedDemo] = useState("overview");

  const demos = [
    {
      id: "overview",
      title: "Vue d'ensemble",
      description: "Découvrez les fonctionnalités principales de Plannitech",
      duration: "5 min",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "planning",
      title: "Gestion d'événements",
      description: "Créez et organisez vos spectacles avec le planning interactif",
      duration: "3 min",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "contacts",
      title: "Base de données contacts",
      description: "Gérez vos artistes et techniciens efficacement",
      duration: "4 min",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: "finance",
      title: "Gestion financière",
      description: "Budgets, devis et suivi des dépenses en temps réel",
      duration: "6 min",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const features = [
    {
      title: "Interface intuitive",
      description: "Une interface moderne et facile à utiliser",
      icon: Zap
    },
    {
      title: "Données sécurisées",
      description: "Chiffrement de niveau bancaire et conformité RGPD",
      icon: Shield
    },
    {
      title: "Synchronisation temps réel",
      description: "Toutes vos données synchronisées instantanément",
      icon: Clock
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice, Théâtre Municipal",
      content: "Plannitech a révolutionné notre gestion d'événements. L'interface est intuitive et nous fait gagner des heures chaque semaine.",
      rating: 5
    },
    {
      name: "Jean Martin",
      role: "Producteur, Tech Events",
      content: "La gestion financière intégrée est un game-changer. Plus besoin de plusieurs outils, tout est centralisé.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MarketingHeader currentPage="demo" />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">
            🎬 Démonstrations interactives
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Découvrez{" "}
            <span className="text-blue-600">Plannitech</span> en action
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explorez nos démonstrations interactives et découvrez comment Plannitech 
            peut transformer votre gestion d'événements culturels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Démarrer la démo
            </Button>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Essai gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Selection */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez votre démo
            </h2>
            <p className="text-xl text-gray-600">
              Sélectionnez la fonctionnalité que vous souhaitez découvrir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {demos.map((demo) => (
              <Card 
                key={demo.id} 
                className={`cursor-pointer transition-all ${
                  selectedDemo === demo.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedDemo(demo.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${demo.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <demo.icon className={`w-6 h-6 ${demo.color}`} />
                  </div>
                  <CardTitle className="text-lg">{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {demo.duration}
                    </div>
                    {selectedDemo === demo.id && (
                      <Badge variant="default">Sélectionné</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Player */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {demos.find(d => d.id === selectedDemo)?.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {demos.find(d => d.id === selectedDemo)?.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {demos.find(d => d.id === selectedDemo)?.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Demo Video Placeholder */}
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-75" />
                    <p className="text-lg">Démonstration interactive</p>
                    <p className="text-sm opacity-75">Cliquez pour lancer la démo</p>
                  </div>
                </div>

                {/* Demo Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button>
                      <Play className="mr-2 h-4 w-4" />
                      Lancer la démo
                    </Button>
                    <Button variant="outline">
                      Plein écran
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                      Suivant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Plannitech ?
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les avantages qui font la différence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Rejoignez des centaines d'organisateurs satisfaits
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à essayer Plannitech ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Commencez votre essai gratuit de 14 jours et découvrez par vous-même 
            comment Plannitech peut transformer votre gestion d'événements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Commencer l'essai gratuit
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
              Planifier une démo personnalisée
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
