"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { SearchBar } from "@/components/ui/search";
import { FilterPanel, QuickFilters } from "@/components/ui/filter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BudgetListView, BudgetFilters } from "@/types/budget";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  FileText,
  Copy
} from "lucide-react";

interface BudgetListProps {
  budgets: BudgetListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  loading?: boolean;
}

export function BudgetList({
  budgets,
  onEdit,
  onView,
  onDelete,
  onExport,
  onImport,
  onCreate,
  onDuplicate,
  loading = false,
}: BudgetListProps) {
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [filters, setFilters] = useState<BudgetFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "PREVIEW", label: "Prévisionnel" },
        { value: "ACTUAL", label: "Réel" },
        { value: "REVISED", label: "Révisé" },
      ],
    },
    {
      key: "status",
      label: "Statut",
      type: "select" as const,
      options: [
        { value: "DRAFT", label: "Brouillon" },
        { value: "APPROVED", label: "Approuvé" },
        { value: "REJECTED", label: "Rejeté" },
        { value: "ARCHIVED", label: "Archivé" },
      ],
    },
    {
      key: "projectId",
      label: "Projet",
      type: "select" as const,
      options: [], // À remplir avec les projets
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
      key: "name" as keyof BudgetListView,
      label: "Nom",
      sortable: true,
      render: (value: string, row: BudgetListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedBudgets.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedBudgets([...selectedBudgets, row.id]);
              } else {
                setSelectedBudgets(selectedBudgets.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">
              {row.project.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type" as keyof BudgetListView,
      label: "Type",
      sortable: true,
      render: (value: string) => {
        const typeLabels = {
          PREVIEW: "Prévisionnel",
          ACTUAL: "Réel",
          REVISED: "Révisé",
        };
        const typeColors = {
          PREVIEW: "bg-blue-100 text-blue-800",
          ACTUAL: "bg-green-100 text-green-800",
          REVISED: "bg-orange-100 text-orange-800",
        };
        return (
          <Badge className={typeColors[value as keyof typeof typeColors]}>
            {typeLabels[value as keyof typeof typeLabels]}
          </Badge>
        );
      },
    },
    {
      key: "status" as keyof BudgetListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          DRAFT: { variant: "secondary" as const, label: "Brouillon" },
          APPROVED: { variant: "default" as const, label: "Approuvé" },
          REJECTED: { variant: "destructive" as const, label: "Rejeté" },
          ARCHIVED: { variant: "outline" as const, label: "Archivé" },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.DRAFT;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "totalAmount" as keyof BudgetListView,
      label: "Montant prévu",
      sortable: true,
      render: (value: number, row: BudgetListView) => (
        <div className="text-right">
          <div className="font-medium">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(value)}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(row.startDate).toLocaleDateString("fr-FR")} - {new Date(row.endDate).toLocaleDateString("fr-FR")}
          </div>
        </div>
      ),
    },
    {
      key: "actualAmount" as keyof BudgetListView,
      label: "Montant réel",
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value)}
        </div>
      ),
    },
    {
      key: "variance" as keyof BudgetListView,
      label: "Écart",
      sortable: true,
      render: (value: number, row: BudgetListView) => {
        const isPositive = value >= 0;
        const percentage = row.variancePercentage || 0;
        
        return (
          <div className="text-right">
            <div className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : ""}{new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(value)}
            </div>
            <div className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : ""}{percentage.toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: "variancePercentage" as keyof BudgetListView,
      label: "Progression",
      sortable: true,
      render: (value: number, row: BudgetListView) => {
        const percentage = (row.actualAmount / row.totalAmount) * 100;
        const isOverBudget = percentage > 100;
        
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${isOverBudget ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium">
              {percentage.toFixed(1)}%
            </span>
          </div>
        );
      },
    },
    {
      key: "actions" as keyof BudgetListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: BudgetListView) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(row.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(row.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer le budget"
            description="Êtes-vous sûr de vouloir supprimer ce budget ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedBudgets.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedBudgets);
        break;
      case "export":
        onExport(selectedBudgets);
        break;
      case "duplicate":
        selectedBudgets.forEach(id => onDuplicate(id));
        break;
    }
    setSelectedBudgets([]);
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== "" && value !== false)
    .map(([key, value]) => ({
      key,
      label: filterOptions.find(opt => opt.key === key)?.label || key,
      value: String(value),
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">
            Gérez vos budgets prévisionnels et réels
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau budget
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher un budget..."
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
            delete newFilters[key as keyof BudgetFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedBudgets.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedBudgets.length} budget{selectedBudgets.length > 1 ? "s" : ""} sélectionné{selectedBudgets.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBudgets([])}
                >
                  Désélectionner tout
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("duplicate")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Dupliquer
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
                  title="Supprimer les budgets"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedBudgets.length} budget${selectedBudgets.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budgets Table */}
      <DataTable
        data={budgets}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

