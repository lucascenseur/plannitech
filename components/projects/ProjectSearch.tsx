"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  MapPin, 
  Tag,
  DollarSign,
  Users
} from "lucide-react";
import { ProjectFilters } from "@/types/project";

interface ProjectSearchProps {
  onSearch: (filters: ProjectFilters) => void;
  onClear: () => void;
  initialFilters?: ProjectFilters;
}

export function ProjectSearch({ onSearch, onClear, initialFilters = {} }: ProjectSearchProps) {
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof ProjectFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== "" && value !== false
  ).length;

  const projectTypes = [
    { value: "CONCERT", label: "Concert" },
    { value: "THEATRE", label: "Théâtre" },
    { value: "DANSE", label: "Danse" },
    { value: "CIRQUE", label: "Cirque" },
    { value: "AUTRE", label: "Autre" },
  ];

  const projectStatuses = [
    { value: "DRAFT", label: "Brouillon" },
    { value: "DEVELOPMENT", label: "Développement" },
    { value: "PRODUCTION", label: "Production" },
    { value: "TOUR", label: "Tournée" },
    { value: "ARCHIVED", label: "Archivé" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recherche et filtres</CardTitle>
            <CardDescription>
              Trouvez rapidement vos projets
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? "Masquer" : "Avancé"}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche principale */}
        <div className="space-y-2">
          <Label>Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, description, lieu..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtres de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={filters.type || ""}
              onValueChange={(value) => handleFilterChange("type", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {projectTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {projectStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lieu</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par lieu..."
                value={filters.venue || ""}
                onChange={(e) => handleFilterChange("venue", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par tags..."
                value={filters.tags?.join(",") || ""}
                onChange={(e) => handleFilterChange("tags", e.target.value ? e.target.value.split(",") : undefined)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Filtres avancés</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) => handleFilterChange("startDate", e.target.value || undefined)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date de fin</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) => handleFilterChange("endDate", e.target.value || undefined)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget minimum</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.budget || ""}
                    onChange={(e) => handleFilterChange("budget", e.target.value ? parseInt(e.target.value) : undefined)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Taille d'équipe minimum</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.teamSize || ""}
                    onChange={(e) => handleFilterChange("teamSize", e.target.value ? parseInt(e.target.value) : undefined)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
