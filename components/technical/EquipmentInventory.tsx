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
import { EquipmentListView, EquipmentFilters } from "@/types/technical";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  Package,
  Lightbulb,
  Volume2,
  Video,
  Theater,
  Shield,
  Settings,
  MapPin,
  Calendar,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Copy,
  Archive,
  History,
  Star
} from "lucide-react";

interface EquipmentInventoryProps {
  equipment: EquipmentListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onMaintenance: (id: string) => void;
  onAvailability: (id: string) => void;
  loading?: boolean | undefined;
}

export function EquipmentInventory({
  equipment,
  onEdit,
  onView,
  onDelete,
  onExport,
  onImport,
  onCreate,
  onDuplicate,
  onMaintenance,
  onAvailability,
  loading = false,
}: EquipmentInventoryProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [filters, setFilters] = useState<EquipmentFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "category",
      label: "Catégorie",
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
        { value: "AVAILABLE", label: "Disponible" },
        { value: "IN_USE", label: "En cours d'utilisation" },
        { value: "MAINTENANCE", label: "En maintenance" },
        { value: "RETIRED", label: "Retiré" },
      ],
    },
    {
      key: "location",
      label: "Localisation",
      type: "select" as const,
      options: [], // À remplir avec les localisations
    },
    {
      key: "brand",
      label: "Marque",
      type: "select" as const,
      options: [], // À remplir avec les marques
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
      key: "name" as keyof EquipmentListView,
      label: "Nom",
      sortable: true,
      render: (value: string, row: EquipmentListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedEquipment.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedEquipment([...selectedEquipment, row.id]);
              } else {
                setSelectedEquipment(selectedEquipment.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">
              {row.brand && row.model ? `${row.brand} ${row.model}` : row.type}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category" as keyof EquipmentListView,
      label: "Catégorie",
      sortable: true,
      render: (value: string) => {
        const categoryLabels = {
          LIGHTING: "Éclairage",
          SOUND: "Son",
          VIDEO: "Vidéo",
          STAGE: "Scène",
          SAFETY: "Sécurité",
          OTHER: "Autre",
        };
        const categoryColors = {
          LIGHTING: "bg-yellow-100 text-yellow-800",
          SOUND: "bg-blue-100 text-blue-800",
          VIDEO: "bg-purple-100 text-purple-800",
          STAGE: "bg-green-100 text-green-800",
          SAFETY: "bg-red-100 text-red-800",
          OTHER: "bg-gray-100 text-gray-800",
        };
        const categoryIcons = {
          LIGHTING: Lightbulb,
          SOUND: Volume2,
          VIDEO: Video,
          STAGE: Theater,
          SAFETY: Shield,
          OTHER: Settings,
        };
        const Icon = categoryIcons[value as keyof typeof categoryIcons] || Settings;
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-gray-400" />
            <Badge className={categoryColors[value as keyof typeof categoryColors]}>
              {categoryLabels[value as keyof typeof categoryLabels]}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "status" as keyof EquipmentListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          AVAILABLE: { variant: "default" as const, label: "Disponible", icon: CheckCircle },
          IN_USE: { variant: "secondary" as const, label: "En cours d'utilisation", icon: Clock },
          MAINTENANCE: { variant: "outline" as const, label: "En maintenance", icon: Wrench },
          RETIRED: { variant: "destructive" as const, label: "Retiré", icon: AlertTriangle },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.AVAILABLE;
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
      key: "location" as keyof EquipmentListView,
      label: "Localisation",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{value || "Non spécifiée"}</span>
        </div>
      ),
    },
    {
      key: "createdAt" as keyof EquipmentListView,
      label: "Ajouté le",
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
    {
      key: "actions" as keyof EquipmentListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: EquipmentListView) => (
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
          <Button size="sm" variant="outline" onClick={() => onMaintenance(row.id)}>
            <Wrench className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAvailability(row.id)}>
            <Calendar className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer l'équipement"
            description="Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedEquipment.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedEquipment);
        break;
      case "export":
        onExport(selectedEquipment);
        break;
      case "duplicate":
        selectedEquipment.forEach(id => onDuplicate(id));
        break;
    }
    setSelectedEquipment([]);
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== "" && value !== false)
    .map(([key, value]) => ({
      key,
      label: filterOptions.find(opt => opt.key === key)?.label || key,
      value: String(value),
    }));

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(e => e.status === "AVAILABLE").length;
  const inUseEquipment = equipment.filter(e => e.status === "IN_USE").length;
  const maintenanceEquipment = equipment.filter(e => e.status === "MAINTENANCE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventaire matériel</h1>
          <p className="text-gray-600">
            Gérez votre inventaire d'équipements techniques
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel équipement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{totalEquipment}</p>
                <p className="text-sm text-gray-500">équipements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold">{availableEquipment}</p>
                <p className="text-sm text-gray-500">
                  {totalEquipment > 0 ? ((availableEquipment / totalEquipment) * 100).toFixed(1) : 0}%
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
                <p className="text-sm font-medium text-gray-600">En cours d'utilisation</p>
                <p className="text-2xl font-bold">{inUseEquipment}</p>
                <p className="text-sm text-gray-500">
                  {totalEquipment > 0 ? ((inUseEquipment / totalEquipment) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En maintenance</p>
                <p className="text-2xl font-bold">{maintenanceEquipment}</p>
                <p className="text-sm text-gray-500">
                  {totalEquipment > 0 ? ((maintenanceEquipment / totalEquipment) * 100).toFixed(1) : 0}%
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
                placeholder="Rechercher un équipement..."
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
            delete newFilters[key as keyof EquipmentFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedEquipment.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedEquipment.length} équipement{selectedEquipment.length > 1 ? "s" : ""} sélectionné{selectedEquipment.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEquipment([])}
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
                  title="Supprimer les équipements"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedEquipment.length} équipement${selectedEquipment.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Table */}
      <DataTable
        data={equipment}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

