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
import { ProjectListView, ProjectFilters } from "@/types/project";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Archive, 
  Download, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Filter,
  MoreHorizontal
} from "lucide-react";

interface ProjectListProps {
  projects: ProjectListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onArchive: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onCreate: () => void;
  loading?: boolean | undefined;
}

export function ProjectList({
  projects,
  onEdit,
  onView,
  onDelete,
  onArchive,
  onExport,
  onCreate,
  loading = false,
}: ProjectListProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "CONCERT", label: "Concert" },
        { value: "THEATRE", label: "Théâtre" },
        { value: "DANSE", label: "Danse" },
        { value: "CIRQUE", label: "Cirque" },
        { value: "AUTRE", label: "Autre" },
      ],
    },
    {
      key: "status",
      label: "Statut",
      type: "select" as const,
      options: [
        { value: "DRAFT", label: "Brouillon" },
        { value: "DEVELOPMENT", label: "Développement" },
        { value: "PRODUCTION", label: "Production" },
        { value: "TOUR", label: "Tournée" },
        { value: "ARCHIVED", label: "Archivé" },
      ],
    },
    {
      key: "startDate",
      label: "Date de début",
      type: "date" as const,
    },
    {
      key: "venue",
      label: "Lieu",
      type: "text" as const,
    },
  ];

  const columns = [
    {
      key: "name" as keyof ProjectListView,
      label: "Nom",
      sortable: true,
      render: (value: string, row: ProjectListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedProjects.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedProjects([...selectedProjects, row.id]);
              } else {
                setSelectedProjects(selectedProjects.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">ID: #{row.id.slice(-8)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type" as keyof ProjectListView,
      label: "Type",
      sortable: true,
      render: (value: string) => {
        const typeLabels = {
          CONCERT: "Concert",
          THEATRE: "Théâtre",
          DANSE: "Danse",
          CIRQUE: "Cirque",
          AUTRE: "Autre",
        };
        return <Badge variant="outline">{typeLabels[value as keyof typeof typeLabels]}</Badge>;
      },
    },
    {
      key: "status" as keyof ProjectListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          DRAFT: { variant: "outline" as const, label: "Brouillon" },
          DEVELOPMENT: { variant: "secondary" as const, label: "Développement" },
          PRODUCTION: { variant: "default" as const, label: "Production" },
          TOUR: { variant: "default" as const, label: "Tournée" },
          ARCHIVED: { variant: "secondary" as const, label: "Archivé" },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.DRAFT;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "startDate" as keyof ProjectListView,
      label: "Date de début",
      sortable: true,
      render: (value: Date) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(value).toLocaleDateString("fr-FR")}</span>
        </div>
      ),
    },
    {
      key: "venue" as keyof ProjectListView,
      label: "Lieu",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="truncate">{value || "Non défini"}</span>
        </div>
      ),
    },
    {
      key: "budget" as keyof ProjectListView,
      label: "Budget",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span>{value ? `${value.toLocaleString()}€` : "Non défini"}</span>
        </div>
      ),
    },
    {
      key: "teamSize" as keyof ProjectListView,
      label: "Équipe",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{value || 0}</span>
        </div>
      ),
    },
    {
      key: "progress" as keyof ProjectListView,
      label: "Progression",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{value}%</span>
        </div>
      ),
    },
    {
      key: "actions" as keyof ProjectListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: ProjectListView) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(row.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer le projet"
            description="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedProjects.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedProjects);
        break;
      case "archive":
        onArchive(selectedProjects);
        break;
      case "export":
        onExport(selectedProjects);
        break;
    }
    setSelectedProjects([]);
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== "")
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
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600">
            Gérez tous vos projets et spectacles
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher un projet..."
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
            delete newFilters[key as keyof ProjectFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedProjects.length} projet{selectedProjects.length > 1 ? "s" : ""} sélectionné{selectedProjects.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProjects([])}
                >
                  Désélectionner tout
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver
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
                  title="Supprimer les projets"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedProjects.length} projet${selectedProjects.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Table */}
      <DataTable
        data={projects}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

