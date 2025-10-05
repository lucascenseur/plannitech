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
import { InvoiceListView, QuoteListView, InvoiceFilters, QuoteFilters } from "@/types/budget";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  Send,
  FileText,
  DollarSign,
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Copy,
  Mail
} from "lucide-react";

interface InvoiceGeneratorProps {
  invoices: InvoiceListView[];
  quotes: QuoteListView[];
  onInvoiceEdit: (id: string) => void;
  onInvoiceView: (id: string) => void;
  onInvoiceDelete: (ids: string[]) => void;
  onQuoteEdit: (id: string) => void;
  onQuoteView: (id: string) => void;
  onQuoteDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreateInvoice: () => void;
  onCreateQuote: () => void;
  onSend: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  onConvertQuote: (id: string) => void;
  loading?: boolean;
}

export function InvoiceGenerator({
  invoices,
  quotes,
  onInvoiceEdit,
  onInvoiceView,
  onInvoiceDelete,
  onQuoteEdit,
  onQuoteView,
  onQuoteDelete,
  onExport,
  onImport,
  onCreateInvoice,
  onCreateQuote,
  onSend,
  onDuplicate,
  onConvertQuote,
  loading = false,
}: InvoiceGeneratorProps) {
  const [activeTab, setActiveTab] = useState<"invoices" | "quotes">("invoices");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [filters, setFilters] = useState<InvoiceFilters | QuoteFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "status",
      label: "Statut",
      type: "select" as const,
      options: [
        { value: "DRAFT", label: "Brouillon" },
        { value: "SENT", label: "Envoyé" },
        { value: "PAID", label: "Payé" },
        { value: "OVERDUE", label: "En retard" },
        { value: "CANCELLED", label: "Annulé" },
      ],
    },
    {
      key: "clientId",
      label: "Client",
      type: "select" as const,
      options: [], // À remplir avec les clients
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

  const invoiceColumns = [
    {
      key: "number" as keyof InvoiceListView,
      label: "Numéro",
      sortable: true,
      render: (value: string, row: InvoiceListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedInvoices.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedInvoices([...selectedInvoices, row.id]);
              } else {
                setSelectedInvoices(selectedInvoices.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">
              {new Date(row.date).toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "client" as keyof InvoiceListView,
      label: "Client",
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
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
      key: "total" as keyof InvoiceListView,
      label: "Montant",
      sortable: true,
      render: (value: number, row: InvoiceListView) => (
        <div className="text-right">
          <div className="font-medium">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: row.currency,
            }).format(value)}
          </div>
          <div className="text-sm text-gray-500">
            {row.totalPaid > 0 && (
              <span className="text-green-600">
                Payé: {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: row.currency,
                }).format(row.totalPaid)}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "status" as keyof InvoiceListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          DRAFT: { variant: "secondary" as const, label: "Brouillon", icon: FileText },
          SENT: { variant: "default" as const, label: "Envoyé", icon: Send },
          PAID: { variant: "default" as const, label: "Payé", icon: CheckCircle },
          OVERDUE: { variant: "destructive" as const, label: "En retard", icon: XCircle },
          CANCELLED: { variant: "outline" as const, label: "Annulé", icon: XCircle },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.DRAFT;
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
      key: "dueDate" as keyof InvoiceListView,
      label: "Échéance",
      sortable: true,
      render: (value: Date, row: InvoiceListView) => {
        const isOverdue = new Date(value) < new Date() && row.status !== "PAID";
        return (
          <div className="flex items-center space-x-1 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-600"}>
              {new Date(value).toLocaleDateString("fr-FR")}
            </span>
          </div>
        );
      },
    },
    {
      key: "remainingAmount" as keyof InvoiceListView,
      label: "Restant",
      sortable: true,
      render: (value: number, row: InvoiceListView) => (
        <div className="text-right">
          <div className="font-medium">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: row.currency,
            }).format(value)}
          </div>
          <div className="text-sm text-gray-500">
            {((row.totalPaid / row.total) * 100).toFixed(1)}% payé
          </div>
        </div>
      ),
    },
    {
      key: "actions" as keyof InvoiceListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: InvoiceListView) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onInvoiceView(row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onInvoiceEdit(row.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(row.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          {row.status === "DRAFT" && (
            <Button size="sm" variant="outline" onClick={() => onSend([row.id])}>
              <Send className="h-4 w-4" />
            </Button>
          )}
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer la facture"
            description="Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onInvoiceDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const quoteColumns = [
    {
      key: "number" as keyof QuoteListView,
      label: "Numéro",
      sortable: true,
      render: (value: string, row: QuoteListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedQuotes.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedQuotes([...selectedQuotes, row.id]);
              } else {
                setSelectedQuotes(selectedQuotes.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">
              {new Date(row.date).toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "client" as keyof QuoteListView,
      label: "Client",
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
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
      key: "total" as keyof QuoteListView,
      label: "Montant",
      sortable: true,
      render: (value: number, row: QuoteListView) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: row.currency,
          }).format(value)}
        </div>
      ),
    },
    {
      key: "status" as keyof QuoteListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          DRAFT: { variant: "secondary" as const, label: "Brouillon", icon: FileText },
          SENT: { variant: "default" as const, label: "Envoyé", icon: Send },
          ACCEPTED: { variant: "default" as const, label: "Accepté", icon: CheckCircle },
          REJECTED: { variant: "destructive" as const, label: "Rejeté", icon: XCircle },
          EXPIRED: { variant: "outline" as const, label: "Expiré", icon: Clock },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.DRAFT;
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
      key: "validUntil" as keyof QuoteListView,
      label: "Valide jusqu'au",
      sortable: true,
      render: (value: Date, row: QuoteListView) => {
        const isExpired = new Date(value) < new Date() && row.status !== "ACCEPTED";
        return (
          <div className="flex items-center space-x-1 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className={isExpired ? "text-red-600 font-medium" : "text-gray-600"}>
              {new Date(value).toLocaleDateString("fr-FR")}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions" as keyof QuoteListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: QuoteListView) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onQuoteView(row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onQuoteEdit(row.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(row.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          {row.status === "DRAFT" && (
            <Button size="sm" variant="outline" onClick={() => onSend([row.id])}>
              <Send className="h-4 w-4" />
            </Button>
          )}
          {row.status === "ACCEPTED" && (
            <Button size="sm" variant="outline" onClick={() => onConvertQuote(row.id)}>
              <FileText className="h-4 w-4" />
            </Button>
          )}
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer le devis"
            description="Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onQuoteDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    const selectedIds = activeTab === "invoices" ? selectedInvoices : selectedQuotes;
    if (selectedIds.length === 0) return;

    switch (action) {
      case "delete":
        if (activeTab === "invoices") {
          onInvoiceDelete(selectedIds);
        } else {
          onQuoteDelete(selectedIds);
        }
        break;
      case "export":
        onExport(selectedIds);
        break;
      case "send":
        onSend(selectedIds);
        break;
      case "duplicate":
        selectedIds.forEach(id => onDuplicate(id));
        break;
    }
    
    if (activeTab === "invoices") {
      setSelectedInvoices([]);
    } else {
      setSelectedQuotes([]);
    }
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== "" && value !== false)
    .map(([key, value]) => ({
      key,
      label: filterOptions.find(opt => opt.key === key)?.label || key,
      value: String(value),
    }));

  const totalInvoices = invoices.length;
  const totalQuotes = quotes.length;
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalQuoteAmount = quotes.reduce((sum, quote) => sum + quote.total, 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === "PAID").length;
  const acceptedQuotes = quotes.filter(quote => quote.status === "ACCEPTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Devis et factures</h1>
          <p className="text-gray-600">
            Gérez vos devis et factures
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={onCreateQuote}>
            <FileText className="h-4 w-4 mr-2" />
            Nouveau devis
          </Button>
          <Button onClick={onCreateInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Factures</p>
                <p className="text-2xl font-bold">{totalInvoices}</p>
                <p className="text-sm text-gray-500">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalInvoiceAmount)}
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
                <p className="text-sm font-medium text-gray-600">Payées</p>
                <p className="text-2xl font-bold">{paidInvoices}</p>
                <p className="text-sm text-gray-500">
                  {totalInvoices > 0 ? ((paidInvoices / totalInvoices) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Devis</p>
                <p className="text-2xl font-bold">{totalQuotes}</p>
                <p className="text-sm text-gray-500">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalQuoteAmount)}
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
                <p className="text-sm font-medium text-gray-600">Acceptés</p>
                <p className="text-2xl font-bold">{acceptedQuotes}</p>
                <p className="text-sm text-gray-500">
                  {totalQuotes > 0 ? ((acceptedQuotes / totalQuotes) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-4">
        <Button
          variant={activeTab === "invoices" ? "default" : "outline"}
          onClick={() => setActiveTab("invoices")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Factures ({totalInvoices})
        </Button>
        <Button
          variant={activeTab === "quotes" ? "default" : "outline"}
          onClick={() => setActiveTab("quotes")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Devis ({totalQuotes})
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchBar
                placeholder={`Rechercher ${activeTab === "invoices" ? "une facture" : "un devis"}...`}
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
            delete newFilters[key as keyof (InvoiceFilters | QuoteFilters)];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {(activeTab === "invoices" ? selectedInvoices : selectedQuotes).length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {(activeTab === "invoices" ? selectedInvoices : selectedQuotes).length} {activeTab === "invoices" ? "facture" : "devis"}{(activeTab === "invoices" ? selectedInvoices : selectedQuotes).length > 1 ? "s" : ""} sélectionné{(activeTab === "invoices" ? selectedInvoices : selectedQuotes).length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeTab === "invoices") {
                      setSelectedInvoices([]);
                    } else {
                      setSelectedQuotes([]);
                    }
                  }}
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
                  onClick={() => handleBulkAction("send")}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
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
                  title={`Supprimer ${activeTab === "invoices" ? "les factures" : "les devis"}`}
                  description={`Êtes-vous sûr de vouloir supprimer ${(activeTab === "invoices" ? selectedInvoices : selectedQuotes).length} ${activeTab === "invoices" ? "facture" : "devis"}${(activeTab === "invoices" ? selectedInvoices : selectedQuotes).length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <DataTable
        data={activeTab === "invoices" ? invoices : quotes}
        columns={activeTab === "invoices" ? invoiceColumns : quoteColumns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

