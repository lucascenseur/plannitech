"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  CheckCircle, 
  ArrowRight,
  Star,
  Zap,
  Shield,
  Headphones,
  Users,
  Database,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Freelance",
      description: "Parfait pour les indépendants",
      monthlyPrice: 19,
      annualPrice: 190,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      features: [
        "5 projets actifs",
        "100 contacts",
        "Planning illimité",
        "Gestion financière basique",
        "Support email",
        "1 utilisateur",
        "Stockage 5GB",
        "Intégrations de base"
      ],
      limitations: [
        "Pas d'API",
        "Rapports limités",
        "Pas de support prioritaire"
      ],
      popular: false
    },
    {
      name: "Team",
      description: "Idéal pour les petites équipes",
      monthlyPrice: 49,
      annualPrice: 490,
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50",
      features: [
        "25 projets actifs",
        "500 contacts",
        "Planning avancé",
        "Gestion financière complète",
        "Support prioritaire",
        "5 utilisateurs",
        "Stockage 25GB",
        "Toutes les intégrations",
        "API complète",
        "Rapports avancés",
        "Automatisation basique"
      ],
      limitations: [
        "Pas d'IA avancée",
        "Support limité aux heures ouvrées"
      ],
      popular: true
    },
    {
      name: "Pro",
      description: "Pour les organisations",
      monthlyPrice: 99,
      annualPrice: 990,
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      features: [
        "Projets illimités",
        "Contacts illimités",
        "Planning avec IA",
        "Gestion financière avancée",
        "Support dédié",
        "15 utilisateurs",
        "Stockage 100GB",
        "Intégrations personnalisées",
        "API complète + webhooks",
        "Rapports personnalisés",
        "Automatisation avancée",
        "IA pour optimisation",
        "Formation personnalisée"
      ],
      limitations: [],
      popular: false
    }
  ];

  const addOns = [
    {
      name: "Utilisateurs supplémentaires",
      description: "Ajoutez des utilisateurs à votre équipe",
      price: "5€/utilisateur/mois",
      icon: Users
    },
    {
      name: "Stockage supplémentaire",
      description: "Plus d'espace pour vos fichiers",
      price: "2€/GB/mois",
      icon: Database
    },
    {
      name: "Support premium",
      description: "Support 24/7 avec temps de réponse garanti",
      price: "50€/mois",
      icon: Headphones
    },
    {
      name: "Intégrations personnalisées",
      description: "Développement d'intégrations sur mesure",
      price: "Sur devis",
      icon: Globe
    }
  ];

  const faqs = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et sont proratisés."
    },
    {
      question: "Y a-t-il des frais de configuration ?",
      answer: "Non, il n'y a aucun frais de configuration. Vous payez uniquement l'abonnement mensuel ou annuel."
    },
    {
      question: "Que se passe-t-il si je dépasse mes limites ?",
      answer: "Nous vous notifierons avant d'atteindre vos limites. Vous pourrez upgrader votre plan ou acheter des add-ons selon vos besoins."
    },
    {
      question: "Proposez-vous des remises pour les ONG ?",
      answer: "Oui, nous offrons 20% de remise pour les organisations à but non lucratif. Contactez-nous pour plus d'informations."
    },
    {
      question: "Puis-je annuler à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Aucun engagement."
    },
    {
      question: "Vos données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et sommes conformes au RGPD. Vos données sont hébergées en Europe."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MarketingHeader currentPage="pricing" />

      {/* Hero Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <Badge className="mb-4" variant="secondary">
              💰 Économisez 2 mois avec l'abonnement annuel
            </Badge>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Tarifs simples et{" "}
              <span className="text-blue-600">transparents</span>
            </h1>
          </AnimatedText>
          <AnimatedText delay={0.6}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. 
              Tous les plans incluent un essai gratuit de 14 jours.
            </p>
          </AnimatedText>
          
          {/* Billing Toggle */}
          <AnimatedButton delay={0.8}>
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg ${!isAnnual ? 'font-semibold' : 'text-gray-500'}`}>
                Mensuel
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <span className={`text-lg ${isAnnual ? 'font-semibold' : 'text-gray-500'}`}>
                Annuel
              </span>
              {isAnnual && (
                <Badge variant="secondary" className="ml-2">
                  -17% d'économie
                </Badge>
              )}
            </div>
          </AnimatedButton>
        </div>
      </AnimatedSection>

      {/* Pricing Cards */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <AnimatedCard key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`} delay={0.1 * (index + 1)}>
                <Card>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2" variant="default">
                      <Star className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                  <CardHeader>
                    <AnimatedIcon delay={0.2 * (index + 1)}>
                      <div className={`w-16 h-16 ${plan.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                        <plan.icon className={`w-8 h-8 ${plan.color}`} />
                      </div>
                    </AnimatedIcon>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-lg">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="text-4xl font-bold">
                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}€
                        <span className="text-lg text-gray-500">
                          /{isAnnual ? 'an' : 'mois'}
                        </span>
                      </div>
                      {isAnnual && (
                        <div className="text-sm text-green-600 font-semibold">
                          Économisez {plan.monthlyPrice * 12 - plan.annualPrice}€/an
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Limitations :</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitationIndex) => (
                            <li key={limitationIndex} className="flex items-start text-sm text-gray-500">
                              <span className="mr-2">•</span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link href="/auth/signup">
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Commencer l'essai gratuit
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Add-ons Section */}
      <AnimatedSection className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Add-ons disponibles
            </h2>
            <p className="text-xl text-gray-600">
              Personnalisez votre plan selon vos besoins spécifiques
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {addOns.map((addon, index) => (
              <AnimatedCard key={index} className="text-center" delay={0.1 * (index + 1)}>
                <Card>
                  <CardHeader>
                    <AnimatedIcon delay={0.2 * (index + 1)}>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <addon.icon className="w-6 h-6 text-gray-600" />
                      </div>
                    </AnimatedIcon>
                    <CardTitle className="text-lg">{addon.name}</CardTitle>
                    <CardDescription>{addon.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      {addon.price}
                    </div>
                    <Button variant="outline" className="w-full">
                      En savoir plus
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur nos tarifs
            </p>
          </AnimatedText>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <AnimatedText key={index} className="space-y-2" delay={0.1 * (index + 1)}>
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </AnimatedText>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à commencer ?
            </h2>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Rejoignez des centaines d'organisateurs qui font confiance à Plannitech. 
              Essai gratuit de 14 jours, sans engagement.
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
