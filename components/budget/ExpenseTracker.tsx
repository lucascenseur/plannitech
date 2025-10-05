"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { SearchBar } from "@/components/ui/search";
import { FilterPanel, QuickFilters } from "@/components/ui/filter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ExpenseListView, ExpenseFilters } from "@/types/budget";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  DollarSign,
  Calendar,
  Receipt,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";

interface ExpenseTrackerProps {
  expenses: ExpenseListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  onApprove: (ids: string[]) => void;
  onReject: (ids: string[]) => void;
  loading?: boolean | undefined;
}

export function ExpenseTracker({
  expenses,
  onEdit,
  onView,
  onDelete,
  onExport,
  onImport,
  onCreate,
  onApprove,
  onReject,
  loading = false,
}: ExpenseTrackerProps) {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "EXPENSE", label: "Dépense" },
        { value: "INCOME", label: "Recette" },
        { value: "TRANSFER", label: "Virement" },
      ],
    },
    {
      key: "status",
      label: "Statut",
      type: "select" as const,
      options: [
        { value: "PENDING", label: "En attente" },
        { value: "APPROVED", label: "Approuvé" },
        { value: "REJECTED", label: "Rejeté" },
        { value: "PAID", label: "Payé" },
      ],
    },
    {
      key: "budgetId",
      label: "Budget",
      type: "select" as const,
      options: [], // À remplir avec les budgets
    },
    {
      key: "categoryId",
      label: "Catégorie",
      type: "select" as const,
      options: [], // À remplir avec les catégories
    },
    {
      key: "paymentMethod",
      label: "Méthode de paiement",
      type: "select" as const,
      options: [
        { value: "CASH", label: "Espèces" },
        { value: "BANK_TRANSFER", label: "Virement" },
        { value: "CHECK", label: "Chèque" },
        { value: "CARD", label: "Carte" },
        { value: "STRIPE", label: "Stripe" },
      ],
    },
    {
      key: "minAmount",
      label: "Montant minimum",
      type: "number" as const,
    },
    {
      key: "maxAmount",
      label: "Montant maximum",
      type: "number" as const,
    },
    {
      key: "startDate",
      label: "Date de début",
      type: "date" as const,
    },
    {
      key: "endDate",
      label: "Date de fin",
      type: "date" as const,
    },
  ];

  const columns = [
    {
      key: "name" as keyof ExpenseListView,
      label: "Nom",
      sortable: true,
      render: (value: string, row: ExpenseListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedExpenses.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedExpenses([...selectedExpenses, row.id]);
              } else {
                setSelectedExpenses(selectedExpenses.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">
              {row.budget.project.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type" as keyof ExpenseListView,
      label: "Type",
      sortable: true,
      render: (value: string) => {
        const typeLabels = {
          EXPENSE: "Dépense",
          INCOME: "Recette",
          TRANSFER: "Virement",
        };
        const typeColors = {
          EXPENSE: "bg-red-100 text-red-800",
          INCOME: "bg-green-100 text-green-800",
          TRANSFER: "bg-blue-100 text-blue-800",
        };
        return (
          <Badge className={typeColors[value as keyof typeof typeColors]}>
            {typeLabels[value as keyof typeof typeColors]}
          </Badge>
        );
      },
    },
    {
      key: "status" as keyof ExpenseListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          PENDING: { variant: "secondary" as const, label: "En attente", icon: Clock },
          APPROVED: { variant: "default" as const, label: "Approuvé", icon: CheckCircle },
          REJECTED: { variant: "destructive" as const, label: "Rejeté", icon: XCircle },
          PAID: { variant: "default" as const, label: "Payé", icon: CheckCircle },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.PENDING;
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="flex items-center space-x-1">
            <Icon className="h-3 w-3" />
            <span>{config.label}</span>
          </Badge>
        );
      },
    },
    {
      key: "amount" as keyof ExpenseListView,
      label: "Montant",
      sortable: true,
      render: (value: number, row: ExpenseListView) => {
        const isIncome = row.type === "INCOME";
        return (
          <div className="text-right">
            <div className={`font-medium ${isIncome ? "text-green-600" : "text-red-600"}`}>
              {isIncome ? "+" : "-"}{new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: row.currency,
              }).format(value)}
            </div>
            <div className="text-sm text-gray-500">
              {row.category.name}
            </div>
          </div>
        );
      },
    },
    {
      key: "date" as keyof ExpenseListView,
      label: "Date",
      sortable: true,
      render: (value: Date) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date(value).toLocaleDateString("fr-FR")}</span>
        </div>
      ),
    },
    {
      key: "paymentMethod" as keyof ExpenseListView,
      label: "Paiement",
      sortable: true,
      render: (value: string) => {
        const methodIcons = {
          CASH: Banknote,
          BANK_TRANSFER: CreditCard,
          CHECK: Receipt,
          CARD: CreditCard,
          STRIPE: CreditCard,
        };
        const methodLabels = {
          CASH: "Espèces",
          BANK_TRANSFER: "Virement",
          CHECK: "Chèque",
          CARD: "Carte",
          STRIPE: "Stripe",
        };
        const Icon = methodIcons[value as keyof typeof methodIcons] || CreditCard;
        return (
          <div className="flex items-center space-x-1">
            <Icon className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{methodLabels[value as keyof typeof methodLabels]}</span>
          </div>
        );
      },
    },
    {
      key: "actions" as keyof ExpenseListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: ExpenseListView) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(row.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          {row.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApprove([row.id])}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject([row.id])}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer la dépense"
            description="Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedExpenses.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedExpenses);
        break;
      case "export":
        onExport(selectedExpenses);
        break;
      case "approve":
        onApprove(selectedExpenses);
        break;
      case "reject":
        onReject(selectedExpenses);
        break;
    }
    setSelectedExpenses([]);
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== "" && value !== false)
    .map(([key, value]) => ({
      key,
      label: filterOptions.find(opt => opt.key === key)?.label || key,
      value: String(value),
    }));

  const totalExpenses = expenses.reduce((sum, expense) => {
    return expense.type === "EXPENSE" ? sum + expense.amount : sum - expense.amount;
  }, 0);

  const pendingExpenses = expenses.filter(expense => expense.status === "PENDING").length;
  const approvedExpenses = expenses.filter(expense => expense.status === "APPROVED").length;
  const paidExpenses = expenses.filter(expense => expense.status === "PAID").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suivi des dépenses</h1>
          <p className="text-gray-600">
            Gérez vos dépenses et recettes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle dépense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{pendingExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold">{approvedExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Payées</p>
                <p className="text-2xl font-bold">{paidExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher une dépense..."
                onSearch={(query) => setFilters({ ...filters, search: query })}
              />
            </div>
            <FilterPanel
              options={filterOptions}
              onApply={setFilters}
              onClear={() => setFilters({})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      {activeFilters.length > 0 && (
        <QuickFilters
          filters={activeFilters}
          onRemove={(key) => {
            const newFilters = { ...filters };
            delete newFilters[key as keyof ExpenseFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedExpenses.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedExpenses.length} dépense{selectedExpenses.length > 1 ? "s" : ""} sélectionnée{selectedExpenses.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExpenses([])}
                >
                  Désélectionner tout
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("approve")}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("reject")}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  }
                  title="Supprimer les dépenses"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedExpenses.length} dépense${selectedExpenses.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <DataTable
        data={expenses}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

