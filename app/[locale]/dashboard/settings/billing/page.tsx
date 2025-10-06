"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Users, 
  FolderOpen, 
  UserPlus, 
  HardDrive,
  Check,
  X,
  Crown,
  Zap,
  Building2,
  Star
} from "lucide-react";

interface BillingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingCycle: string;
  organization: {
    id: string;
    name: string;
  };
}

interface UsageStats {
  plan: string;
  limits: {
    maxUsers: number;
    maxProjects: number;
    maxContacts: number;
    maxStorage: number;
    features: any;
  };
  usage: {
    users: number;
    projects: number;
    contacts: number;
    storage: number;
  };
  utilization: {
    users: number;
    projects: number;
    contacts: number;
    storage: number;
  };
}

const PLAN_FEATURES = {
  FREE: {
    name: 'Gratuit',
    description: 'Parfait pour commencer',
    price: { monthly: 0, yearly: 0 },
    icon: <Users className="w-6 h-6" />,
    color: 'bg-gray-100 text-gray-800',
    popular: false
  },
  STARTER: {
    name: 'Starter',
    description: 'Pour les petites équipes',
    price: { monthly: 29, yearly: 290 },
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-800',
    popular: false
  },
  PROFESSIONAL: {
    name: 'Professionnel',
    description: 'Pour les équipes en croissance',
    price: { monthly: 79, yearly: 790 },
    icon: <Star className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-800',
    popular: true
  },
  ENTERPRISE: {
    name: 'Entreprise',
    description: 'Pour les grandes organisations',
    price: { monthly: 199, yearly: 1990 },
    icon: <Building2 className="w-6 h-6" />,
    color: 'bg-gold-100 text-gold-800',
    popular: false
  }
};

export default function BillingPage({ params }: BillingPageProps) {
  const [locale, setLocale] = useState('fr');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données d'abonnement
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const response = await fetch('/api/billing/subscription');
        if (response.ok) {
          const data = await response.json();
          setSubscription(data.subscription);
          setUsageStats(data.usage);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de facturation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const handleUpgrade = async (plan: string) => {
    setUpgrading(true);
    try {
      const response = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingCycle: 'MONTHLY' }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        setUsageStats(data.usage);
        alert(locale === 'en' ? 'Plan upgraded successfully!' : locale === 'es' ? '¡Plan actualizado con éxito!' : 'Plan mis à jour avec succès !');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la mise à jour du plan');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du plan');
    } finally {
      setUpgrading(false);
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Illimité' : limit.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          {locale === 'en' ? 'Loading billing information...' : locale === 'es' ? 'Cargando información de facturación...' : 'Chargement des informations de facturation...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Billing & Plans' : locale === 'es' ? 'Facturación y Planes' : 'Facturation et Plans'}
        </h1>
        <p className="text-gray-600 mt-1">
          {locale === 'en' ? 'Manage your subscription and usage' : locale === 'es' ? 'Gestiona tu suscripción y uso' : 'Gérez votre abonnement et votre utilisation'}
        </p>
      </div>

      {/* Plan actuel et utilisation */}
      {subscription && usageStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan actuel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>
                  {locale === 'en' ? 'Current Plan' : locale === 'es' ? 'Plan Actual' : 'Plan Actuel'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {PLAN_FEATURES[subscription.plan as keyof typeof PLAN_FEATURES]?.icon}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {PLAN_FEATURES[subscription.plan as keyof typeof PLAN_FEATURES]?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {PLAN_FEATURES[subscription.plan as keyof typeof PLAN_FEATURES]?.description}
                    </p>
                  </div>
                </div>
                <Badge className={PLAN_FEATURES[subscription.plan as keyof typeof PLAN_FEATURES]?.color}>
                  {subscription.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    {locale === 'en' ? 'Billing cycle:' : locale === 'es' ? 'Ciclo de facturación:' : 'Cycle de facturation :'}
                  </span>
                  <span className="font-medium">
                    {subscription.billingCycle === 'MONTHLY' 
                      ? (locale === 'en' ? 'Monthly' : locale === 'es' ? 'Mensual' : 'Mensuel')
                      : (locale === 'en' ? 'Yearly' : locale === 'es' ? 'Anual' : 'Annuel')
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {locale === 'en' ? 'Next billing:' : locale === 'es' ? 'Próxima facturación:' : 'Prochaine facturation :'}
                  </span>
                  <span className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilisation */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Usage Overview' : locale === 'es' ? 'Resumen de Uso' : 'Aperçu de l\'utilisation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Utilisateurs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {locale === 'en' ? 'Users' : locale === 'es' ? 'Usuarios' : 'Utilisateurs'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageStats.usage.users} / {formatLimit(usageStats.limits.maxUsers)}
                    </span>
                  </div>
                  <Progress 
                    value={usageStats.utilization.users} 
                    className="h-2"
                  />
                </div>

                {/* Projets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {locale === 'en' ? 'Projects' : locale === 'es' ? 'Proyectos' : 'Projets'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageStats.usage.projects} / {formatLimit(usageStats.limits.maxProjects)}
                    </span>
                  </div>
                  <Progress 
                    value={usageStats.utilization.projects} 
                    className="h-2"
                  />
                </div>

                {/* Contacts */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageStats.usage.contacts} / {formatLimit(usageStats.limits.maxContacts)}
                    </span>
                  </div>
                  <Progress 
                    value={usageStats.utilization.contacts} 
                    className="h-2"
                  />
                </div>

                {/* Stockage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {locale === 'en' ? 'Storage' : locale === 'es' ? 'Almacenamiento' : 'Stockage'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageStats.usage.storage} MB / {formatLimit(usageStats.limits.maxStorage)} MB
                    </span>
                  </div>
                  <Progress 
                    value={usageStats.utilization.storage} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plans disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === 'en' ? 'Available Plans' : locale === 'es' ? 'Planes Disponibles' : 'Plans Disponibles'}
          </CardTitle>
          <CardDescription>
            {locale === 'en' ? 'Choose the plan that best fits your needs' : locale === 'es' ? 'Elige el plan que mejor se adapte a tus necesidades' : 'Choisissez le plan qui correspond le mieux à vos besoins'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(PLAN_FEATURES).map(([planKey, plan]) => {
              const isCurrentPlan = subscription?.plan === planKey;
              const isUpgrading = upgrading && planKey !== subscription?.plan;
              
              return (
                <div
                  key={planKey}
                  className={`relative p-6 border rounded-lg ${
                    plan.popular ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
                  } ${isCurrentPlan ? 'bg-gray-50' : 'bg-white'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">
                        {locale === 'en' ? 'Popular' : locale === 'es' ? 'Popular' : 'Populaire'}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${plan.color}`}>
                        {plan.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-3xl font-bold">
                        €{plan.price.monthly}
                        <span className="text-sm font-normal text-gray-500">
                          {locale === 'en' ? '/month' : locale === 'es' ? '/mes' : '/mois'}
                        </span>
                      </div>
                      {plan.price.yearly > 0 && (
                        <div className="text-sm text-gray-500">
                          €{plan.price.yearly} {locale === 'en' ? '/year' : locale === 'es' ? '/año' : '/an'}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isCurrentPlan || isUpgrading}
                      onClick={() => handleUpgrade(planKey)}
                    >
                      {isCurrentPlan 
                        ? (locale === 'en' ? 'Current Plan' : locale === 'es' ? 'Plan Actual' : 'Plan Actuel')
                        : isUpgrading
                        ? (locale === 'en' ? 'Upgrading...' : locale === 'es' ? 'Actualizando...' : 'Mise à jour...')
                        : (locale === 'en' ? 'Upgrade' : locale === 'es' ? 'Actualizar' : 'Mettre à jour')
                      }
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
