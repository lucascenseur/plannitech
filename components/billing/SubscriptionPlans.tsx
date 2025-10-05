"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Users, 
  Building, 
  Zap, 
  Shield, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  RefreshCw,
  Download,
  Upload,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { SubscriptionPlanListView, PlanLimits } from "@/types/billing";

interface SubscriptionPlansProps {
  plans: SubscriptionPlanListView[];
  currentPlan?: SubscriptionPlanListView | undefined;
  onSelectPlan: (planId: string) => void;
  onUpgrade: (planId: string) => void;
  onDowngrade: (planId: string) => void;
  onCancel: (planId: string) => void;
  onResume: (planId: string) => void;
  onBillingPortal: () => void;
  loading?: boolean;
}

export function SubscriptionPlans({
  plans,
  currentPlan,
  onSelectPlan,
  onUpgrade,
  onDowngrade,
  onCancel,
  onResume,
  onBillingPortal,
  loading = false,
}: SubscriptionPlansProps) {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "freelance":
        return <Users className="h-6 w-6" />;
      case "team":
        return <Building className="h-6 w-6" />;
      case "pro":
        return <Crown className="h-6 w-6" />;
      case "enterprise":
        return <Shield className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "freelance":
        return "bg-blue-100 text-blue-800";
      case "team":
        return "bg-green-100 text-green-800";
      case "pro":
        return "bg-purple-100 text-purple-800";
      case "enterprise":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanGradient = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "freelance":
        return "from-blue-500 to-blue-600";
      case "team":
        return "from-green-500 to-green-600";
      case "pro":
        return "from-purple-500 to-purple-600";
      case "enterprise":
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatPrice = (price: number, currency: string, interval: string) => {
    const formattedPrice = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(price);
    
    return `${formattedPrice}/${interval === "year" ? "an" : "mois"}`;
  };

  const getYearlyDiscount = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyYearly = monthlyPrice * 12;
    const discount = ((monthlyYearly - yearlyPrice) / monthlyYearly) * 100;
    return Math.round(discount);
  };

  const canUpgrade = (planId: string) => {
    if (!currentPlan) return true;
    const currentPlanIndex = plans.findIndex(p => p.id === currentPlan.id);
    const targetPlanIndex = plans.findIndex(p => p.id === planId);
    return targetPlanIndex > currentPlanIndex;
  };

  const canDowngrade = (planId: string) => {
    if (!currentPlan) return false;
    const currentPlanIndex = plans.findIndex(p => p.id === currentPlan.id);
    const targetPlanIndex = plans.findIndex(p => p.id === planId);
    return targetPlanIndex < currentPlanIndex;
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan?.id === planId;
  };

  const isPopular = (plan: SubscriptionPlanListView) => {
    return plan.isPopular;
  };

  const getPlanFeatures = (plan: SubscriptionPlanListView) => {
    const features = [
      {
        name: "Projets",
        value: plan.limits.projects === 0 ? "Illimité" : `${plan.limits.projects} projets`,
        icon: <Target className="h-4 w-4" />,
      },
      {
        name: "Utilisateurs",
        value: plan.limits.users === 0 ? "Illimité" : `${plan.limits.users} utilisateurs`,
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Stockage",
        value: plan.limits.storage === 0 ? "Illimité" : `${plan.limits.storage} GB`,
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        name: "Appels API",
        value: plan.limits.apiCalls === 0 ? "Illimité" : `${plan.limits.apiCalls} appels/mois`,
        icon: <Zap className="h-4 w-4" />,
      },
      {
        name: "Support",
        value: plan.limits.support === "email" ? "Email" : 
               plan.limits.support === "priority" ? "Prioritaire" : "Dédié",
        icon: <Shield className="h-4 w-4" />,
      },
    ];

    return features;
  };

  const getPlanBenefits = (plan: SubscriptionPlanListView) => {
    const benefits = [
      "Accès complet à toutes les fonctionnalités",
      "Support technique inclus",
      "Mises à jour automatiques",
      "Sauvegarde automatique",
      "Synchronisation en temps réel",
    ];

    if (plan.name.toLowerCase() === "pro" || plan.name.toLowerCase() === "enterprise") {
      benefits.push("API avancée", "Intégrations personnalisées", "Formation dédiée");
    }

    if (plan.name.toLowerCase() === "enterprise") {
      benefits.push("Support dédié", "SLA garanti", "Formation sur site");
    }

    return benefits;
  };

  const getPlanLimitations = (plan: SubscriptionPlanListView) => {
    const limitations = [];

    if (plan.limits.projects > 0) {
      limitations.push(`Maximum ${plan.limits.projects} projets`);
    }

    if (plan.limits.users > 0) {
      limitations.push(`Maximum ${plan.limits.users} utilisateurs`);
    }

    if (plan.limits.storage > 0) {
      limitations.push(`Maximum ${plan.limits.storage} GB de stockage`);
    }

    if (plan.limits.apiCalls > 0) {
      limitations.push(`Maximum ${plan.limits.apiCalls} appels API par mois`);
    }

    return limitations;
  };

  const getPlanAction = (plan: SubscriptionPlanListView) => {
    if (isCurrentPlan(plan.id)) {
      return (
        <Button variant="outline" className="w-full" disabled>
          Plan actuel
        </Button>
      );
    }

    if (canUpgrade(plan.id)) {
      return (
        <Button 
          className="w-full" 
          onClick={() => onUpgrade(plan.id)}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Upgrader"}
        </Button>
      );
    }

    if (canDowngrade(plan.id)) {
      return (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onDowngrade(plan.id)}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Downgrader"}
        </Button>
      );
    }

    return (
      <Button 
        className="w-full" 
        onClick={() => onSelectPlan(plan.id)}
        disabled={loading}
      >
        {loading ? "Chargement..." : "Sélectionner"}
      </Button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sélectionnez le plan qui correspond le mieux à vos besoins
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${billingInterval === "month" ? "text-gray-900" : "text-gray-500"}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === "month" ? "year" : "month")}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingInterval === "year" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingInterval === "year" ? "text-gray-900" : "text-gray-500"}`}>
            Annuel
          </span>
          {billingInterval === "year" && (
            <Badge variant="default" className="ml-2">
              -20% d'économie
            </Badge>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              isCurrentPlan(plan.id) 
                ? "ring-2 ring-blue-500 shadow-lg" 
                : isPopular(plan) 
                  ? "ring-2 ring-purple-500 shadow-lg" 
                  : "shadow-md"
            }`}
          >
            {isPopular(plan) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Populaire
                </Badge>
              </div>
            )}

            {isCurrentPlan(plan.id) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-3 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Actuel
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPlanGradient(plan.name)} text-white mb-4`}>
                {getPlanIcon(plan.name)}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600">
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold text-gray-900">
                  {formatPrice(plan.price, plan.currency, billingInterval)}
                </div>
                {billingInterval === "year" && plan.interval === "month" && (
                  <div className="text-sm text-gray-500 mt-1">
                    Économisez {getYearlyDiscount(plan.price, plan.price * 10)}%
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Fonctionnalités incluses</h4>
                <div className="space-y-2">
                  {getPlanFeatures(plan).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="text-green-500">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-600">{feature.name}</span>
                      <span className="text-sm font-medium text-gray-900">{feature.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Avantages</h4>
                <div className="space-y-2">
                  {getPlanBenefits(plan).map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="text-green-500">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limitations */}
              {getPlanLimitations(plan).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Limitations</h4>
                  <div className="space-y-2">
                    {getPlanLimitations(plan).map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="text-yellow-500">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-gray-600">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trial */}
              {plan.trialDays > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-900">
                      Essai gratuit {plan.trialDays} jours
                    </span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                {getPlanAction(plan)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Actions */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" onClick={onBillingPortal}>
            <Settings className="h-4 w-4 mr-2" />
            Gérer la facturation
          </Button>
          <Button variant="outline">
            <HelpCircle className="h-4 w-4 mr-2" />
            Aide
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Tous les plans incluent un essai gratuit de 14 jours</p>
          <p>Annulation possible à tout moment • Pas d'engagement</p>
        </div>
      </div>
    </div>
  );
}

