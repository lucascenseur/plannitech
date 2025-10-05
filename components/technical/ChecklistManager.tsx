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
import { ChecklistListView, ChecklistFilters } from "@/types/technical";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  CheckSquare,
  Wrench,
  Shield,
  Settings,
  Target,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Copy,
  Archive,
  History,
  Star,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface ChecklistManagerProps {
  checklists: ChecklistListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onComplete: (id: string) => void;
  onReset: (id: string) => void;
  loading?: boolean | undefined;
}

export function ChecklistManager({
  checklists,
  onEdit,
  onView,
  onDelete,
  onExport,
  onImport,
  onCreate,
  onDuplicate,
  onStart,
  onPause,
  onComplete,
  onReset,
  loading = false,
}: ChecklistManagerProps) {
  const [selectedChecklists, setSelectedChecklists] = useState<string[]>([]);
  const [filters, setFilters] = useState<ChecklistFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "SETUP", label: "Montage" },
        { value: "TEARDOWN", label: "Démontage" },
        { value: "MAINTENANCE", label: "Maintenance" },
        { value: "SAFETY", label: "Sécurité" },
        { value: "OTHER", label: "Autre" },
      ],
    },
    {
      key: "status",
      label: "Statut",
      type: "select" as const,
      options: [
        { value: "DRAFT", label: "Brouillon" },
        { value: "ACTIVE", label: "Actif" },
        { value: "COMPLETED", label: "Terminé" },
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
      key: "name" as keyof ChecklistListView,
      label: "Nom",
      sortable: true,
      render: (value: string, row: ChecklistListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedChecklists.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedChecklists([...selectedChecklists, row.id]);
              } else {
                setSelectedChecklists(selectedChecklists.filter(id => id !== row.id));
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
      key: "type" as keyof ChecklistListView,
      label: "Type",
      sortable: true,
      render: (value: string) => {
        const typeLabels = {
          SETUP: "Montage",
          TEARDOWN: "Démontage",
          MAINTENANCE: "Maintenance",
          SAFETY: "Sécurité",
          OTHER: "Autre",
        };
        const typeColors = {
          SETUP: "bg-green-100 text-green-800",
          TEARDOWN: "bg-red-100 text-red-800",
          MAINTENANCE: "bg-orange-100 text-orange-800",
          SAFETY: "bg-yellow-100 text-yellow-800",
          OTHER: "bg-gray-100 text-gray-800",
        };
        const typeIcons = {
          SETUP: TrendingUp,
          TEARDOWN: TrendingDown,
          MAINTENANCE: Wrench,
          SAFETY: Shield,
          OTHER: Settings,
        };
        const Icon = typeIcons[value as keyof typeof typeIcons] || Settings;
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-gray-400" />
            <Badge className={typeColors[value as keyof typeof typeColors]}>
              {typeLabels[value as keyof typeof typeLabels]}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "status" as keyof ChecklistListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          DRAFT: { variant: "secondary" as const, label: "Brouillon", icon: FileText },
          ACTIVE: { variant: "default" as const, label: "Actif", icon: Play },
          COMPLETED: { variant: "default" as const, label: "Terminé", icon: CheckCircle },
          ARCHIVED: { variant: "outline" as const, label: "Archivé", icon: Archive },
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
      key: "progress" as keyof ChecklistListView,
      label: "Progression",
      sortable: true,
      render: (value: number, row: ChecklistListView) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">
            {value}%
          </span>
        </div>
      ),
    },
    {
      key: "completedItems" as keyof ChecklistListView,
      label: "Items",
      sortable: true,
      render: (value: number, row: ChecklistListView) => (
        <div className="text-sm">
          <div className="font-medium">{value}/{row.totalItems}</div>
          <div className="text-gray-500">
            {row.totalItems > 0 ? ((value / row.totalItems) * 100).toFixed(1) : 0}% terminé
          </div>
        </div>
      ),
    },
    {
      key: "version" as keyof ChecklistListView,
      label: "Version",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="text-xs">
            v{value}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions" as keyof ChecklistListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: ChecklistListView) => (
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
          {row.status === "DRAFT" && (
            <Button size="sm" variant="outline" onClick={() => onStart(row.id)}>
              <Play className="h-4 w-4" />
            </Button>
          )}
          {row.status === "ACTIVE" && (
            <>
              <Button size="sm" variant="outline" onClick={() => onPause(row.id)}>
                <Pause className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onComplete(row.id)}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          {row.status === "COMPLETED" && (
            <Button size="sm" variant="outline" onClick={() => onReset(row.id)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer la check-list"
            description="Êtes-vous sûr de vouloir supprimer cette check-list ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedChecklists.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedChecklists);
        break;
      case "export":
        onExport(selectedChecklists);
        break;
      case "duplicate":
        selectedChecklists.forEach(id => onDuplicate(id));
        break;
    }
    setSelectedChecklists([]);
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== "" && value !== false)
    .map(([key, value]) => ({
      key,
      label: filterOptions.find(opt => opt.key === key)?.label || key,
      value: String(value),
    }));

  const totalChecklists = checklists.length;
  const activeChecklists = checklists.filter(c => c.status === "ACTIVE").length;
  const completedChecklists = checklists.filter(c => c.status === "COMPLETED").length;
  const draftChecklists = checklists.filter(c => c.status === "DRAFT").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-lists</h1>
          <p className="text-gray-600">
            Gérez vos check-lists de montage et démontage
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle check-list
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{totalChecklists}</p>
                <p className="text-sm text-gray-500">check-lists</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Play className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Actives</p>
                <p className="text-2xl font-bold">{activeChecklists}</p>
                <p className="text-sm text-gray-500">
                  {totalChecklists > 0 ? ((activeChecklists / totalChecklists) * 100).toFixed(1) : 0}%
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
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold">{completedChecklists}</p>
                <p className="text-sm text-gray-500">
                  {totalChecklists > 0 ? ((completedChecklists / totalChecklists) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold">{draftChecklists}</p>
                <p className="text-sm text-gray-500">
                  {totalChecklists > 0 ? ((draftChecklists / totalChecklists) * 100).toFixed(1) : 0}%
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
                placeholder="Rechercher une check-list..."
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
            delete newFilters[key as keyof ChecklistFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedChecklists.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedChecklists.length} check-list{selectedChecklists.length > 1 ? "s" : ""} sélectionnée{selectedChecklists.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedChecklists([])}
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
                  title="Supprimer les check-lists"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedChecklists.length} check-list${selectedChecklists.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklists Table */}
      <DataTable
        data={checklists}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

