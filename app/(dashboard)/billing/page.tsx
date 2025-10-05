"use client";

import { useState, useEffect } from "react";
import { SubscriptionPlans } from "@/components/billing/SubscriptionPlans";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Tabs } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Building,
  Percent,
  Plus,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2,
  Copy,
  Archive,
  History,
  Star,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  RefreshCw,
  MoreHorizontal
} from "lucide-react";
import { 
  SubscriptionPlanListView, 
  SubscriptionListView, 
  InvoiceListView, 
  PaymentMethodListView, 
  UsageListView,
  BillingStats,
  UsageStats
} from "@/types/billing";

export default function BillingPage() {
  const { canManageProjects } = usePermissions();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [plans, setPlans] = useState<SubscriptionPlanListView[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionListView[]>([]);
  const [invoices, setInvoices] = useState<InvoiceListView[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodListView[]>([]);
  const [usage, setUsage] = useState<UsageListView[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Charger toutes les données en parallèle
      const [
        plansResponse,
        subscriptionsResponse,
        invoicesResponse,
        paymentMethodsResponse,
        usageResponse,
        billingStatsResponse,
        usageStatsResponse
      ] = await Promise.all([
        fetch("/api/billing/plans"),
        fetch("/api/billing/subscriptions"),
        fetch("/api/billing/invoices"),
        fetch("/api/billing/payment-methods"),
        fetch("/api/billing/usage"),
        fetch("/api/billing/stats"),
        fetch("/api/billing/usage-stats")
      ]);

      if (plansResponse.ok) {
        const data = await plansResponse.json();
        setPlans(data);
      }

      if (subscriptionsResponse.ok) {
        const data = await subscriptionsResponse.json();
        setSubscriptions(data);
      }

      if (invoicesResponse.ok) {
        const data = await invoicesResponse.json();
        setInvoices(data);
      }

      if (paymentMethodsResponse.ok) {
        const data = await paymentMethodsResponse.json();
        setPaymentMethods(data);
      }

      if (usageResponse.ok) {
        const data = await usageResponse.json();
        setUsage(data);
      }

      if (billingStatsResponse.ok) {
        const data = await billingStatsResponse.json();
        setBillingStats(data);
      }

      if (usageStatsResponse.ok) {
        const data = await usageStatsResponse.json();
        setUsageStats(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      const response = await fetch("/api/billing/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la sélection du plan:", error);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      const response = await fetch("/api/billing/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'upgrade:", error);
    }
  };

  const handleDowngrade = async (planId: string) => {
    try {
      const response = await fetch("/api/billing/subscriptions/downgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors du downgrade:", error);
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    }
  };

  const handleResume = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscriptionId}/resume`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la reprise:", error);
    }
  };

  const handleBillingPortal = async () => {
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture du portail:", error);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/download`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  const handleViewInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/view`);
      
      if (response.ok) {
        const { url } = await response.json();
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture:", error);
    }
  };

  if (!canManageProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Accès non autorisé
              </h1>
              <p className="text-gray-600">
                Vous n'avez pas les permissions nécessaires pour gérer la facturation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSubscription = subscriptions.find(s => s.status === "active");
  const currentPlan = currentSubscription ? plans.find(p => p.id === currentSubscription.plan.id) : null;

  const tabs = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      content: (
        <div className="space-y-6">
          {/* Current Subscription */}
          {currentSubscription && currentPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Abonnement actuel</span>
                </CardTitle>
                <CardDescription>
                  Votre abonnement actuel et ses détails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentPlan.name}</h3>
                    <p className="text-sm text-gray-600">{currentPlan.description}</p>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: currentPlan.currency,
                        }).format(currentPlan.price)}
                      </span>
                      <span className="text-gray-600">/{currentPlan.interval === "year" ? "an" : "mois"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Prochaine facturation</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
                    </p>
                    <div className="mt-2">
                      <Badge variant={currentSubscription.cancelAtPeriodEnd ? "destructive" : "default"}>
                        {currentSubscription.cancelAtPeriodEnd ? "Annulé" : "Actif"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleBillingPortal}>
                      <Settings className="h-4 w-4 mr-2" />
                      Gérer
                    </Button>
                    {currentSubscription.cancelAtPeriodEnd && (
                      <Button onClick={() => handleResume(currentSubscription.id)}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reprendre
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Stats */}
          {billingStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenus mensuels</p>
                      <p className="text-2xl font-bold">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(billingStats.monthlyRecurringRevenue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Abonnements actifs</p>
                      <p className="text-2xl font-bold">{billingStats.activeSubscriptions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taux de churn</p>
                      <p className="text-2xl font-bold">{billingStats.churnRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">ARPU</p>
                      <p className="text-2xl font-bold">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(billingStats.averageRevenuePerUser)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Usage Stats */}
          {usageStats && (
            <Card>
              <CardHeader>
                <CardTitle>Utilisation actuelle</CardTitle>
                <CardDescription>
                  Votre utilisation par rapport aux limites de votre plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Projets</h4>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span>{usageStats.totalProjects}</span>
                        <span>{currentPlan?.limits.projects === 0 ? "Illimité" : currentPlan?.limits.projects}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ 
                            width: `${currentPlan?.limits.projects === 0 ? 0 : (usageStats.totalProjects / (currentPlan?.limits.projects || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Utilisateurs</h4>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span>{usageStats.totalUsers}</span>
                        <span>{currentPlan?.limits.users === 0 ? "Illimité" : currentPlan?.limits.users}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ 
                            width: `${currentPlan?.limits.users === 0 ? 0 : (usageStats.totalUsers / (currentPlan?.limits.users || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Stockage</h4>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span>{usageStats.totalStorage} GB</span>
                        <span>{currentPlan?.limits.storage === 0 ? "Illimité" : `${currentPlan?.limits.storage} GB`}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ 
                            width: `${currentPlan?.limits.storage === 0 ? 0 : (usageStats.totalStorage / (currentPlan?.limits.storage || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Appels API</h4>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span>{usageStats.totalApiCalls}</span>
                        <span>{currentPlan?.limits.apiCalls === 0 ? "Illimité" : currentPlan?.limits.apiCalls}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ 
                            width: `${currentPlan?.limits.apiCalls === 0 ? 0 : (usageStats.totalApiCalls / (currentPlan?.limits.apiCalls || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: "plans",
      label: "Plans",
      content: (
        <SubscriptionPlans
          plans={plans}
          currentPlan={currentPlan ?? undefined}
          onSelectPlan={handleSelectPlan}
          onUpgrade={handleUpgrade}
          onDowngrade={handleDowngrade}
          onCancel={handleCancel}
          onResume={handleResume}
          onBillingPortal={handleBillingPortal}
          loading={loading}
        />
      ),
    },
    {
      id: "invoices",
      label: "Factures",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
              <p className="text-gray-600">
                Historique de vos factures et paiements
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {invoices.length > 0 ? (
                  <div className="space-y-2">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{invoice.number}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <Badge variant={
                            invoice.status === "paid" ? "default" :
                            invoice.status === "open" ? "secondary" :
                            invoice.status === "void" ? "outline" : "destructive"
                          }>
                            {invoice.status === "paid" ? "Payé" :
                             invoice.status === "open" ? "En attente" :
                             invoice.status === "void" ? "Annulé" : "Impayé"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: invoice.currency,
                              }).format(invoice.total)}
                            </div>
                            {invoice.paidAt && (
                              <div className="text-sm text-gray-600">
                                Payé le {new Date(invoice.paidAt).toLocaleDateString("fr-FR")}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewInvoice(invoice.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(invoice.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucune facture trouvée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "usage",
      label: "Utilisation",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Utilisation</h1>
              <p className="text-gray-600">
                Suivi de votre utilisation des ressources
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>

          {/* Usage Table */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {usage.length > 0 ? (
                  <div className="space-y-2">
                    {usage.map((usageItem) => (
                      <div key={usageItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{usageItem.period}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(usageItem.createdAt).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium">{usageItem.projects}</div>
                            <div className="text-gray-600">Projets</div>
                          </div>
                          <div>
                            <div className="font-medium">{usageItem.users}</div>
                            <div className="text-gray-600">Utilisateurs</div>
                          </div>
                          <div>
                            <div className="font-medium">{usageItem.storage} GB</div>
                            <div className="text-gray-600">Stockage</div>
                          </div>
                          <div>
                            <div className="font-medium">{usageItem.apiCalls}</div>
                            <div className="text-gray-600">API</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucune donnée d'utilisation trouvée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturation</h1>
          <p className="text-gray-600">
            Gérez votre abonnement et vos factures
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}

