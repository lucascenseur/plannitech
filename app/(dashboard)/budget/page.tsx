"use client";

import { useState, useEffect } from "react";
import { BudgetList } from "@/components/budget/BudgetList";
import { ExpenseTracker } from "@/components/budget/ExpenseTracker";
import { InvoiceGenerator } from "@/components/budget/InvoiceGenerator";
import { IntermittentManager } from "@/components/budget/IntermittentManager";
import { SocialChargesCalculator } from "@/components/budget/SocialChargesCalculator";
import { FinancialDashboard } from "@/components/budget/FinancialDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Receipt,
  Calculator,
  Building,
  Percent,
  Plus,
  Download,
  Upload,
  Settings
} from "lucide-react";
import { 
  BudgetListView, 
  ExpenseListView, 
  InvoiceListView, 
  QuoteListView, 
  IntermittentListView,
  SocialCharges,
  DashboardData,
  BudgetFormData,
  ExpenseFormData,
  InvoiceFormData,
  QuoteFormData,
  IntermittentFormData,
  SocialChargesFormData
} from "@/types/budget";

export default function BudgetPage() {
  const { canManageProjects } = usePermissions();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [budgets, setBudgets] = useState<BudgetListView[]>([]);
  const [expenses, setExpenses] = useState<ExpenseListView[]>([]);
  const [invoices, setInvoices] = useState<InvoiceListView[]>([]);
  const [quotes, setQuotes] = useState<QuoteListView[]>([]);
  const [intermittents, setIntermittents] = useState<IntermittentListView[]>([]);
  const [socialCharges, setSocialCharges] = useState<SocialCharges[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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
        budgetsResponse,
        expensesResponse,
        invoicesResponse,
        quotesResponse,
        intermittentsResponse,
        socialChargesResponse,
        dashboardResponse
      ] = await Promise.all([
        fetch("/api/budgets"),
        fetch("/api/expenses"),
        fetch("/api/invoices"),
        fetch("/api/quotes"),
        fetch("/api/intermittents"),
        fetch("/api/social-charges"),
        fetch("/api/dashboard/financial")
      ]);

      if (budgetsResponse.ok) {
        const data = await budgetsResponse.json();
        setBudgets(data);
      }

      if (expensesResponse.ok) {
        const data = await expensesResponse.json();
        setExpenses(data);
      }

      if (invoicesResponse.ok) {
        const data = await invoicesResponse.json();
        setInvoices(data);
      }

      if (quotesResponse.ok) {
        const data = await quotesResponse.json();
        setQuotes(data);
      }

      if (intermittentsResponse.ok) {
        const data = await intermittentsResponse.json();
        setIntermittents(data);
      }

      if (socialChargesResponse.ok) {
        const data = await socialChargesResponse.json();
        setSocialCharges(data);
      }

      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetEdit = (id: string) => {
    // Navigation vers la page d'édition du budget
    router.push(`/budget/budgets/${id}/edit`);
  };

  const handleBudgetView = (id: string) => {
    // Navigation vers la page de détail du budget
    router.push(`/budget/budgets/${id}`);
  };

  const handleBudgetDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/budgets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          budgetIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleBudgetExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/budgets/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budgetIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `budgets-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleBudgetCreate = () => {
    router.push("/budget/budgets/new");
  };

  const handleBudgetDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleExpenseEdit = (id: string) => {
    router.push(`/budget/expenses/${id}/edit`);
  };

  const handleExpenseView = (id: string) => {
    router.push(`/budget/expenses/${id}`);
  };

  const handleExpenseDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/expenses/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          expenseIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleExpenseExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/expenses/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenseIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleExpenseCreate = () => {
    router.push("/budget/expenses/new");
  };

  const handleExpenseApprove = async (ids: string[]) => {
    try {
      const response = await fetch("/api/expenses/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          expenseIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
    }
  };

  const handleExpenseReject = async (ids: string[]) => {
    try {
      const response = await fetch("/api/expenses/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          expenseIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
    }
  };

  const handleInvoiceEdit = (id: string) => {
    router.push(`/budget/invoices/${id}/edit`);
  };

  const handleInvoiceView = (id: string) => {
    router.push(`/budget/invoices/${id}`);
  };

  const handleInvoiceDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/invoices/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          invoiceIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleInvoiceExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/invoices/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleInvoiceCreate = () => {
    router.push("/budget/invoices/new");
  };

  const handleInvoiceSend = async (ids: string[]) => {
    try {
      const response = await fetch("/api/invoices/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND",
          invoiceIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  const handleInvoiceDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleQuoteEdit = (id: string) => {
    router.push(`/budget/quotes/${id}/edit`);
  };

  const handleQuoteView = (id: string) => {
    router.push(`/budget/quotes/${id}`);
  };

  const handleQuoteDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/quotes/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          quoteIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleQuoteExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/quotes/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `quotes-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleQuoteCreate = () => {
    router.push("/budget/quotes/new");
  };

  const handleQuoteSend = async (ids: string[]) => {
    try {
      const response = await fetch("/api/quotes/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND",
          quoteIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  const handleQuoteDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/quotes/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleQuoteConvert = async (id: string) => {
    try {
      const response = await fetch(`/api/quotes/${id}/convert`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la conversion:", error);
    }
  };

  const handleIntermittentEdit = (id: string) => {
    router.push(`/budget/intermittents/${id}/edit`);
  };

  const handleIntermittentView = (id: string) => {
    router.push(`/budget/intermittents/${id}`);
  };

  const handleIntermittentDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/intermittents/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          intermittentIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleIntermittentExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/intermittents/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intermittentIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `intermittents-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleIntermittentCreate = () => {
    router.push("/budget/intermittents/new");
  };

  const handleIntermittentApprove = async (ids: string[]) => {
    try {
      const response = await fetch("/api/intermittents/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          intermittentIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
    }
  };

  const handleIntermittentReject = async (ids: string[]) => {
    try {
      const response = await fetch("/api/intermittents/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          intermittentIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
    }
  };

  const handleIntermittentPay = async (ids: string[]) => {
    try {
      const response = await fetch("/api/intermittents/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PAY",
          intermittentIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
    }
  };

  const handleIntermittentDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/intermittents/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleSocialChargesEdit = (id: string) => {
    router.push(`/budget/social-charges/${id}/edit`);
  };

  const handleSocialChargesView = (id: string) => {
    router.push(`/budget/social-charges/${id}`);
  };

  const handleSocialChargesDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/social-charges/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          socialChargesIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleSocialChargesExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/social-charges/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialChargesIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `social-charges-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleSocialChargesCreate = () => {
    router.push("/budget/social-charges/new");
  };

  const handleSocialChargesCalculate = async (projectId: string, period: string) => {
    try {
      const response = await fetch("/api/social-charges/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          period,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors du calcul:", error);
    }
  };

  const handleSocialChargesDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/social-charges/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
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
                Vous n'avez pas les permissions nécessaires pour gérer le budget.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      content: (
        <FinancialDashboard
          data={dashboardData || {
            budgets: {
              totalBudgets: 0,
              totalAmount: 0,
              totalActual: 0,
              totalVariance: 0,
              averageVariance: 0,
              byStatus: {},
              byType: {},
              byProject: [],
              monthlyTrend: []
            },
            expenses: {
              totalExpenses: 0,
              totalAmount: 0,
              averageAmount: 0,
              byCategory: {},
              byType: {},
              byStatus: {},
              monthlyTrend: []
            },
            invoices: {
              totalInvoices: 0,
              totalAmount: 0,
              totalPaid: 0,
              totalOutstanding: 0,
              averageAmount: 0,
              byStatus: {},
              byClient: [],
              monthlyTrend: []
            },
            intermittents: {
              totalIntermittents: 0,
              totalHours: 0,
              totalAmount: 0,
              averageHourlyRate: 0,
              byStatus: {},
              byProject: [],
              monthlyTrend: []
            },
            charts: {
              budgetVsActual: { labels: [], datasets: [] },
              expensesByCategory: { labels: [], datasets: [] },
              invoicesByStatus: { labels: [], datasets: [] },
              monthlyTrend: { labels: [], datasets: [] }
            }
          }}
          onRefresh={loadData}
          loading={loading}
        />
      ),
    },
    {
      id: "budgets",
      label: "Budgets",
      content: (
        <BudgetList
          budgets={budgets}
          onEdit={handleBudgetEdit}
          onView={handleBudgetView}
          onDelete={handleBudgetDelete}
          onExport={handleBudgetExport}
          onImport={() => {}}
          onCreate={handleBudgetCreate}
          onDuplicate={handleBudgetDuplicate}
          loading={loading}
        />
      ),
    },
    {
      id: "expenses",
      label: "Dépenses",
      content: (
        <ExpenseTracker
          expenses={expenses}
          onEdit={handleExpenseEdit}
          onView={handleExpenseView}
          onDelete={handleExpenseDelete}
          onExport={handleExpenseExport}
          onImport={() => {}}
          onCreate={handleExpenseCreate}
          onApprove={handleExpenseApprove}
          onReject={handleExpenseReject}
          loading={loading}
        />
      ),
    },
    {
      id: "invoices",
      label: "Factures & Devis",
      content: (
        <InvoiceGenerator
          invoices={invoices}
          quotes={quotes}
          onInvoiceEdit={handleInvoiceEdit}
          onInvoiceView={handleInvoiceView}
          onInvoiceDelete={handleInvoiceDelete}
          onQuoteEdit={handleQuoteEdit}
          onQuoteView={handleQuoteView}
          onQuoteDelete={handleQuoteDelete}
          onExport={handleInvoiceExport}
          onImport={() => {}}
          onCreateInvoice={handleInvoiceCreate}
          onCreateQuote={handleQuoteCreate}
          onSend={handleInvoiceSend}
          onDuplicate={handleInvoiceDuplicate}
          onConvertQuote={handleQuoteConvert}
          loading={loading}
        />
      ),
    },
    {
      id: "intermittents",
      label: "Intermittents",
      content: (
        <IntermittentManager
          intermittents={intermittents}
          onEdit={handleIntermittentEdit}
          onView={handleIntermittentView}
          onDelete={handleIntermittentDelete}
          onExport={handleIntermittentExport}
          onImport={() => {}}
          onCreate={handleIntermittentCreate}
          onApprove={handleIntermittentApprove}
          onReject={handleIntermittentReject}
          onPay={handleIntermittentPay}
          onDuplicate={handleIntermittentDuplicate}
          loading={loading}
        />
      ),
    },
    {
      id: "social-charges",
      label: "Charges sociales",
      content: (
        <SocialChargesCalculator
          socialCharges={socialCharges}
          intermittents={intermittents}
          onEdit={handleSocialChargesEdit}
          onView={handleSocialChargesView}
          onDelete={handleSocialChargesDelete}
          onExport={handleSocialChargesExport}
          onImport={() => {}}
          onCreate={handleSocialChargesCreate}
          onCalculate={handleSocialChargesCalculate}
          onDuplicate={handleSocialChargesDuplicate}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-600">
            Gérez vos budgets, dépenses, factures et charges sociales
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="dashboard" />
    </div>
  );
}