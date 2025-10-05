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
import { IntermittentListView, IntermittentFilters } from "@/types/budget";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  DollarSign,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Pending,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Copy,
  Send,
  Receipt
} from "lucide-react";

interface IntermittentManagerProps {
  intermittents: IntermittentListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  onApprove: (ids: string[]) => void;
  onReject: (ids: string[]) => void;
  onPay: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  loading?: boolean;
}

export function IntermittentManager({
  intermittents,
  onEdit,
  onView,
  onDelete,
  onExport,
  onImport,
  onCreate,
  onApprove,
  onReject,
  onPay,
  onDuplicate,
  loading = false,
}: IntermittentManagerProps) {
  const [selectedIntermittents, setSelectedIntermittents] = useState<string[]>([]);
  const [filters, setFilters] = useState<IntermittentFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "status",
      label: "Statut",
      type: "select" as const,
      options: [
        { value: "PENDING", label: "En attente" },
        { value: "APPROVED", label: "Approuvé" },
        { value: "PAID", label: "Payé" },
        { value: "CANCELLED", label: "Annulé" },
      ],
    },
    {
      key: "contactId",
      label: "Contact",
      type: "select" as const,
      options: [], // À remplir avec les contacts
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
      key: "contact" as keyof IntermittentListView,
      label: "Contact",
      sortable: true,
      render: (value: any, row: IntermittentListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedIntermittents.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedIntermittents([...selectedIntermittents, row.id]);
              } else {
                setSelectedIntermittents(selectedIntermittents.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value.name}</div>
            <div className="text-sm text-gray-500">
              {row.project.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role" as keyof IntermittentListView,
      label: "Rôle",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "hours" as keyof IntermittentListView,
      label: "Heures",
      sortable: true,
      render: (value: number, row: IntermittentListView) => (
        <div className="text-right">
          <div className="font-medium">{value}h</div>
          <div className="text-sm text-gray-500">
            {new Date(row.startDate).toLocaleDateString("fr-FR")} - {new Date(row.endDate).toLocaleDateString("fr-FR")}
          </div>
        </div>
      ),
    },
    {
      key: "hourlyRate" as keyof IntermittentListView,
      label: "Taux horaire",
      sortable: true,
      render: (value: number, row: IntermittentListView) => (
        <div className="text-right">
          <div className="font-medium">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: row.currency,
            }).format(value)}/h
          </div>
          <div className="text-sm text-gray-500">
            {row.hours}h × {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: row.currency,
            }).format(value)}
          </div>
        </div>
      ),
    },
    {
      key: "totalAmount" as keyof IntermittentListView,
      label: "Total",
      sortable: true,
      render: (value: number, row: IntermittentListView) => (
        <div className="text-right">
          <div className="font-medium text-lg">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: row.currency,
            }).format(value)}
          </div>
          <div className="text-sm text-gray-500">
            {row.hours}h × {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: row.currency,
            }).format(row.hourlyRate)}
          </div>
        </div>
      ),
    },
    {
      key: "status" as keyof IntermittentListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          PENDING: { variant: "secondary" as const, label: "En attente", icon: Pending },
          APPROVED: { variant: "default" as const, label: "Approuvé", icon: CheckCircle },
          PAID: { variant: "default" as const, label: "Payé", icon: CheckCircle },
          CANCELLED: { variant: "destructive" as const, label: "Annulé", icon: XCircle },
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
      key: "actions" as keyof IntermittentListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: IntermittentListView) => (
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
          {row.status === "APPROVED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPay([row.id])}
              className="text-blue-600 hover:text-blue-700"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer le cachet"
            description="Êtes-vous sûr de vouloir supprimer ce cachet ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedIntermittents.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedIntermittents);
        break;
      case "export":
        onExport(selectedIntermittents);
        break;
      case "approve":
        onApprove(selectedIntermittents);
        break;
      case "reject":
        onReject(selectedIntermittents);
        break;
      case "pay":
        onPay(selectedIntermittents);
        break;
      case "duplicate":
        selectedIntermittents.forEach(id => onDuplicate(id));
        break;
    }
    setSelectedIntermittents([]);
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== "" && value !== false)
    .map(([key, value]) => ({
      key,
      label: filterOptions.find(opt => opt.key === key)?.label || key,
      value: String(value),
    }));

  const totalIntermittents = intermittents.length;
  const totalHours = intermittents.reduce((sum, intermittent) => sum + intermittent.hours, 0);
  const totalAmount = intermittents.reduce((sum, intermittent) => sum + intermittent.totalAmount, 0);
  const averageHourlyRate = totalHours > 0 ? totalAmount / totalHours : 0;
  const pendingIntermittents = intermittents.filter(intermittent => intermittent.status === "PENDING").length;
  const approvedIntermittents = intermittents.filter(intermittent => intermittent.status === "APPROVED").length;
  const paidIntermittents = intermittents.filter(intermittent => intermittent.status === "PAID").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cachets intermittents</h1>
          <p className="text-gray-600">
            Gérez les cachets des intermittents du spectacle
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau cachet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{totalIntermittents}</p>
                <p className="text-sm text-gray-500">
                  {totalHours}h • {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Pending className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{pendingIntermittents}</p>
                <p className="text-sm text-gray-500">
                  {totalIntermittents > 0 ? ((pendingIntermittents / totalIntermittents) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                <p className="text-2xl font-bold">{approvedIntermittents}</p>
                <p className="text-sm text-gray-500">
                  {totalIntermittents > 0 ? ((approvedIntermittents / totalIntermittents) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Payés</p>
                <p className="text-2xl font-bold">{paidIntermittents}</p>
                <p className="text-sm text-gray-500">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(averageHourlyRate)}/h
                </p>
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
                placeholder="Rechercher un cachet..."
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
            delete newFilters[key as keyof IntermittentFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedIntermittents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedIntermittents.length} cachet{selectedIntermittents.length > 1 ? "s" : ""} sélectionné{selectedIntermittents.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIntermittents([])}
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
                  onClick={() => handleBulkAction("pay")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Payer
                </Button>
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
                  title="Supprimer les cachets"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedIntermittents.length} cachet${selectedIntermittents.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intermittents Table */}
      <DataTable
        data={intermittents}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

