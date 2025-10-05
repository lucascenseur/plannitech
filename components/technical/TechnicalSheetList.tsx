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
import { TechnicalSheetListView, TechnicalSheetFilters } from "@/types/technical";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  FileText,
  Lightbulb,
  Volume2,
  Video,
  Theater,
  Shield,
  Settings,
  Copy,
  Archive,
  History,
  Star
} from "lucide-react";

interface TechnicalSheetListProps {
  sheets: TechnicalSheetListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onArchive: (ids: string[]) => void;
  onVersion: (id: string) => void;
  loading?: boolean | undefined;
}

export function TechnicalSheetList({
  sheets,
  onEdit,
  onView,
  onDelete,
  onExport,
  onImport,
  onCreate,
  onDuplicate,
  onArchive,
  onVersion,
  loading = false,
}: TechnicalSheetListProps) {
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [filters, setFilters] = useState<TechnicalSheetFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "LIGHTING", label: "Éclairage" },
        { value: "SOUND", label: "Son" },
        { value: "VIDEO", label: "Vidéo" },
        { value: "STAGE", label: "Scène" },
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
        { value: "REVIEW", label: "En révision" },
        { value: "APPROVED", label: "Approuvé" },
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
      key: "name" as keyof TechnicalSheetListView,
      label: "Nom",
      sortable: true,
      render: (value: string, row: TechnicalSheetListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedSheets.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedSheets([...selectedSheets, row.id]);
              } else {
                setSelectedSheets(selectedSheets.filter(id => id !== row.id));
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
      key: "type" as keyof TechnicalSheetListView,
      label: "Type",
      sortable: true,
      render: (value: string) => {
        const typeLabels = {
          LIGHTING: "Éclairage",
          SOUND: "Son",
          VIDEO: "Vidéo",
          STAGE: "Scène",
          SAFETY: "Sécurité",
          OTHER: "Autre",
        };
        const typeColors = {
          LIGHTING: "bg-yellow-100 text-yellow-800",
          SOUND: "bg-blue-100 text-blue-800",
          VIDEO: "bg-purple-100 text-purple-800",
          STAGE: "bg-green-100 text-green-800",
          SAFETY: "bg-red-100 text-red-800",
          OTHER: "bg-gray-100 text-gray-800",
        };
        const typeIcons = {
          LIGHTING: Lightbulb,
          SOUND: Volume2,
          VIDEO: Video,
          STAGE: Theater,
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
      key: "status" as keyof TechnicalSheetListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          DRAFT: { variant: "secondary" as const, label: "Brouillon" },
          REVIEW: { variant: "outline" as const, label: "En révision" },
          APPROVED: { variant: "default" as const, label: "Approuvé" },
          ARCHIVED: { variant: "outline" as const, label: "Archivé" },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.DRAFT;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "version" as keyof TechnicalSheetListView,
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
      key: "createdAt" as keyof TechnicalSheetListView,
      label: "Créé le",
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
    {
      key: "updatedAt" as keyof TechnicalSheetListView,
      label: "Modifié le",
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
    {
      key: "actions" as keyof TechnicalSheetListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: TechnicalSheetListView) => (
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
          <Button size="sm" variant="outline" onClick={() => onVersion(row.id)}>
            <History className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer la fiche technique"
            description="Êtes-vous sûr de vouloir supprimer cette fiche technique ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedSheets.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedSheets);
        break;
      case "export":
        onExport(selectedSheets);
        break;
      case "duplicate":
        selectedSheets.forEach(id => onDuplicate(id));
        break;
      case "archive":
        onArchive(selectedSheets);
        break;
    }
    setSelectedSheets([]);
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
          <h1 className="text-3xl font-bold text-gray-900">Fiches techniques</h1>
          <p className="text-gray-600">
            Gérez vos fiches techniques par projet
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle fiche
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher une fiche technique..."
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
            delete newFilters[key as keyof TechnicalSheetFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedSheets.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedSheets.length} fiche{selectedSheets.length > 1 ? "s" : ""} sélectionnée{selectedSheets.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSheets([])}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  }
                  title="Supprimer les fiches techniques"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedSheets.length} fiche${selectedSheets.length > 1 ? "s" : ""} technique${selectedSheets.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Sheets Table */}
      <DataTable
        data={sheets}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

