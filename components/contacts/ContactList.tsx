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
import { ContactListView, ContactFilters } from "@/types/contact";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff,
  Download, 
  Upload,
  Eye, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Tag,
  Heart,
  HeartOff
} from "lucide-react";

interface ContactListProps {
  contacts: ContactListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onToggleFavorite: (id: string) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  loading?: boolean;
}

export function ContactList({
  contacts,
  onEdit,
  onView,
  onDelete,
  onToggleFavorite,
  onExport,
  onImport,
  onCreate,
  loading = false,
}: ContactListProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filters, setFilters] = useState<ContactFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "ARTIST", label: "Artiste" },
        { value: "TECHNICIAN", label: "Technicien" },
        { value: "VENUE", label: "Lieu" },
        { value: "SUPPLIER", label: "Prestataire" },
        { value: "OTHER", label: "Autre" },
      ],
    },
    {
      key: "status",
      label: "Statut",
      type: "select" as const,
      options: [
        { value: "ACTIVE", label: "Actif" },
        { value: "INACTIVE", label: "Inactif" },
        { value: "BLOCKED", label: "Bloqué" },
      ],
    },
    {
      key: "isIntermittent",
      label: "Intermittent",
      type: "boolean" as const,
    },
    {
      key: "isFavorite",
      label: "Favori",
      type: "boolean" as const,
    },
    {
      key: "skills",
      label: "Compétences",
      type: "multiselect" as const,
      options: [
        { value: "MUSIC", label: "Musique" },
        { value: "DANCE", label: "Danse" },
        { value: "THEATER", label: "Théâtre" },
        { value: "TECHNICAL", label: "Technique" },
        { value: "MANAGEMENT", label: "Gestion" },
      ],
    },
  ];

  const columns = [
    {
      key: "name" as keyof ContactListView,
      label: "Nom",
      sortable: true,
      render: (value: string, row: ContactListView) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedContacts.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedContacts([...selectedContacts, row.id]);
              } else {
                setSelectedContacts(selectedContacts.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">
              {row.email && <span>{row.email}</span>}
              {row.phone && <span className="ml-2">{row.phone}</span>}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type" as keyof ContactListView,
      label: "Type",
      sortable: true,
      render: (value: string) => {
        const typeLabels = {
          ARTIST: "Artiste",
          TECHNICIAN: "Technicien",
          VENUE: "Lieu",
          SUPPLIER: "Prestataire",
          OTHER: "Autre",
        };
        const typeColors = {
          ARTIST: "bg-purple-100 text-purple-800",
          TECHNICIAN: "bg-blue-100 text-blue-800",
          VENUE: "bg-green-100 text-green-800",
          SUPPLIER: "bg-orange-100 text-orange-800",
          OTHER: "bg-gray-100 text-gray-800",
        };
        return (
          <Badge className={typeColors[value as keyof typeof typeColors]}>
            {typeLabels[value as keyof typeof typeLabels]}
          </Badge>
        );
      },
    },
    {
      key: "status" as keyof ContactListView,
      label: "Statut",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          ACTIVE: { variant: "default" as const, label: "Actif" },
          INACTIVE: { variant: "secondary" as const, label: "Inactif" },
          BLOCKED: { variant: "destructive" as const, label: "Bloqué" },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.ACTIVE;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "skills" as keyof ContactListView,
      label: "Compétences",
      sortable: false,
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {value.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "tags" as keyof ContactListView,
      label: "Tags",
      sortable: false,
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "isIntermittent" as keyof ContactListView,
      label: "Intermittent",
      sortable: true,
      render: (value: boolean) => (
        <div className="flex items-center space-x-1">
          {value ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Oui
            </Badge>
          ) : (
            <Badge variant="outline">
              Non
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "rating" as keyof ContactListView,
      label: "Note",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          {value ? (
            <>
              <span className="text-sm font-medium">{value.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(value) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "lastCollaboration" as keyof ContactListView,
      label: "Dernière collaboration",
      sortable: true,
      render: (value: Date) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{value ? new Date(value).toLocaleDateString("fr-FR") : "-"}</span>
        </div>
      ),
    },
    {
      key: "actions" as keyof ContactListView,
      label: "Actions",
      sortable: false,
      render: (value: any, row: ContactListView) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(row.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleFavorite(row.id)}
            className={row.isFavorite ? "text-yellow-600" : "text-gray-400"}
          >
            {row.isFavorite ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
          </Button>
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer le contact"
            description="Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedContacts.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedContacts);
        break;
      case "export":
        onExport(selectedContacts);
        break;
      case "favorite":
        selectedContacts.forEach(id => onToggleFavorite(id));
        break;
    }
    setSelectedContacts([]);
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
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">
            Gérez vos contacts : artistes, techniciens, lieux, prestataires
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher un contact..."
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
            delete newFilters[key as keyof ContactFilters];
            setFilters(newFilters);
          }}
          onClearAll={() => setFilters({})}
        />
      )}

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedContacts.length} contact{selectedContacts.length > 1 ? "s" : ""} sélectionné{selectedContacts.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedContacts([])}
                >
                  Désélectionner tout
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("favorite")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
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
                  title="Supprimer les contacts"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedContacts.length} contact${selectedContacts.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts Table */}
      <DataTable
        data={contacts}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}

