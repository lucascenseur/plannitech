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
  Users, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Zap,
  Globe,
  FileText,
  Clock,
  Target,
  Smartphone,
  Database,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      category: "Gestion d'événements",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        "Création et organisation d'événements",
        "Planning interactif et intuitif",
        "Gestion des répétitions et représentations",
        "Synchronisation calendrier",
        "Notifications automatiques",
        "Gestion des conflits d'agenda"
      ]
    },
    {
      category: "Base de données contacts",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        "Fiche complète par contact",
        "Gestion des compétences et spécialités",
        "Suivi des disponibilités",
        "Historique des collaborations",
        "Import/Export CSV",
        "Recherche avancée et filtres"
      ]
    },
    {
      category: "Gestion financière",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        "Budgets prévisionnels par projet",
        "Suivi des dépenses en temps réel",
        "Génération automatique de devis",
        "Gestion des factures et paiements",
        "Calcul des charges sociales",
        "Rapports financiers détaillés"
      ]
    },
    {
      category: "Outils techniques",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      items: [
        "Fiches techniques complètes",
        "Plans de feu interactifs",
        "Inventaire matériel avec disponibilités",
        "Checklists de montage/démontage",
        "Conducteurs techniques",
        "Templates réutilisables"
      ]
    },
    {
      category: "Analytics & Rapports",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      items: [
        "Tableaux de bord personnalisables",
        "Métriques de performance",
        "Analyse des tendances",
        "Rapports automatisés",
        "Export PDF/Excel",
        "Alertes intelligentes"
      ]
    },
    {
      category: "Automatisation",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      items: [
        "Workflows personnalisables",
        "Notifications intelligentes",
        "Intégrations tierces",
        "Synchronisation multi-plateforme",
        "Templates automatisés",
        "IA pour l'optimisation"
      ]
    }
  ];

  const integrations = [
    { name: "Google Calendar", icon: Calendar },
    { name: "Stripe", icon: DollarSign },
    { name: "Mailchimp", icon: Globe },
    { name: "Slack", icon: Settings },
    { name: "WhatsApp", icon: Smartphone },
    { name: "Excel", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MarketingHeader currentPage="features" />

      {/* Hero Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <Badge className="mb-4" variant="secondary">
              🚀 Plus de 50 fonctionnalités avancées
            </Badge>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Découvrez toutes nos{" "}
              <span className="text-blue-600">fonctionnalités</span>
            </h1>
          </AnimatedText>
          <AnimatedText delay={0.6}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Une suite complète d'outils professionnels pour gérer efficacement 
              tous les aspects de vos événements culturels.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Voir la démo
              </Button>
            </div>
          </AnimatedButton>
        </div>
      </AnimatedSection>

      {/* Features Grid */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <AnimatedCard key={index} className="h-full" delay={0.1 * (index + 1)}>
                <Card>
                  <CardHeader>
                    <AnimatedIcon delay={0.2 * (index + 1)}>
                      <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                    </AnimatedIcon>
                    <CardTitle className="text-2xl">{feature.category}</CardTitle>
                    <CardDescription className="text-lg">
                      Découvrez tous les outils pour {feature.category.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Advanced Features */}
      <AnimatedSection className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités avancées
            </h2>
            <p className="text-xl text-gray-600">
              Des outils professionnels pour les besoins complexes
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard delay={0.1}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.2}>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                  </AnimatedIcon>
                  <CardTitle>Base de données centralisée</CardTitle>
                  <CardDescription>
                    Toutes vos données en un seul endroit, synchronisées en temps réel
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.3}>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                  </AnimatedIcon>
                  <CardTitle>IA intégrée</CardTitle>
                  <CardDescription>
                    Optimisation automatique des plannings et suggestions intelligentes
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Card>
                <CardHeader>
                  <AnimatedIcon delay={0.4}>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </AnimatedIcon>
                  <CardTitle>Automatisation</CardTitle>
                  <CardDescription>
                    Workflows automatisés pour gagner du temps sur les tâches répétitives
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Integrations */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Intégrations populaires
            </h2>
            <p className="text-xl text-gray-600">
              Connectez Plannitech à vos outils préférés
            </p>
          </AnimatedText>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <AnimatedCard key={index} className="text-center p-6 hover:shadow-lg transition-shadow" delay={0.1 * (index + 1)}>
                <Card>
                  <AnimatedIcon delay={0.2 * (index + 1)}>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <integration.icon className="w-6 h-6 text-gray-600" />
                    </div>
                  </AnimatedIcon>
                  <h3 className="font-semibold">{integration.name}</h3>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à découvrir toutes ces fonctionnalités ?
            </h2>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Commencez votre essai gratuit de 14 jours et explorez toutes les fonctionnalités 
              de Plannitech sans engagement.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Commencer l'essai gratuit
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                Demander une démo
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
