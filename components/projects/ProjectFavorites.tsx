"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  HeartOff, 
  Star, 
  StarOff, 
  Search,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { ProjectListView } from "@/types/project";

interface ProjectFavoritesProps {
  onToggleFavorite: (projectId: string) => void;
  onView: (projectId: string) => void;
  onEdit: (projectId: string) => void;
}

export function ProjectFavorites({ onToggleFavorite, onView, onEdit }: ProjectFavoritesProps) {
  const [favorites, setFavorites] = useState<ProjectListView[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/favorite`, {
        method: "PUT",
      });

      if (response.ok) {
        await loadFavorites();
        onToggleFavorite(projectId);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    }
  };

  const filteredFavorites = favorites.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "createdAt":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: "outline" as const, label: "Brouillon" },
      DEVELOPMENT: { variant: "secondary" as const, label: "Développement" },
      PRODUCTION: { variant: "default" as const, label: "Production" },
      TOUR: { variant: "default" as const, label: "Tournée" },
      ARCHIVED: { variant: "secondary" as const, label: "Archivé" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      CONCERT: "Concert",
      THEATRE: "Théâtre",
      DANSE: "Danse",
      CIRQUE: "Cirque",
      AUTRE: "Autre",
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des favoris...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Projets favoris</CardTitle>
          <CardDescription>
            {favorites.length} projet{favorites.length > 1 ? "s" : ""} en favori
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans les favoris..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="name">Nom</option>
                  <option value="createdAt">Date de création</option>
                  <option value="status">Statut</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites List */}
      {sortedFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFavorites.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getTypeLabel(project.type)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Status and Progress */}
                  <div className="flex items-center justify-between">
                    {getStatusBadge(project.status)}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{project.progress}%</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {project.venue && (
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Lieu:</span>
                        <span className="truncate">{project.venue}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Créé le:</span>
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                    {project.budget && (
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Budget:</span>
                        <span>{project.budget.toLocaleString()}€</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(project.id)}
                      className="flex-1"
                    >
                      Voir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(project.id)}
                      className="flex-1"
                    >
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <HeartOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun favori
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? "Aucun projet ne correspond à votre recherche"
                  : "Vous n'avez pas encore de projets favoris"
                }
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Effacer la recherche
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

