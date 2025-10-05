"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  X,
  Check
} from "lucide-react";

interface ProjectTagsProps {
  projectId: string;
  projectName: string;
}

interface ProjectTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  usageCount: number;
  createdAt: Date;
}

export function ProjectTags({ projectId, projectName }: ProjectTagsProps) {
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<ProjectTag | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTag, setNewTag] = useState({
    name: "",
    color: "#3b82f6",
    description: "",
  });

  const predefinedColors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f97316", // Orange
    "#ec4899", // Pink
    "#6b7280", // Gray
  ];

  useEffect(() => {
    loadTags();
  }, [projectId]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/tags`);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });

      if (response.ok) {
        setNewTag({ name: "", color: "#3b82f6", description: "" });
        setShowCreateForm(false);
        await loadTags();
      }
    } catch (error) {
      console.error("Erreur lors de la création du tag:", error);
    }
  };

  const handleUpdateTag = async (tagId: string, updates: Partial<ProjectTag>) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tags/${tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setEditingTag(null);
        await loadTags();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tags/${tagId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadTags();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <p className="text-gray-600">Chargement des tags...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tags du projet</CardTitle>
              <CardDescription>
                Gérez les tags pour le projet "{projectName}"
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher des tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-name">Nom du tag</Label>
                    <Input
                      id="tag-name"
                      placeholder="Nom du tag"
                      value={newTag.name}
                      onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tag-description">Description</Label>
                    <Input
                      id="tag-description"
                      placeholder="Description du tag"
                      value={newTag.description}
                      onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Couleur</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            newTag.color === color ? "border-gray-400" : "border-gray-200"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewTag({ ...newTag, color })}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={newTag.color}
                      onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                      className="w-16 h-8"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={handleCreateTag} disabled={!newTag.name}>
                    <Check className="h-4 w-4 mr-2" />
                    Créer le tag
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags List */}
      <Card>
        <CardHeader>
          <CardTitle>Tags disponibles</CardTitle>
          <CardDescription>
            {filteredTags.length} tag{filteredTags.length > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTags.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTags.map((tag) => (
                <div key={tag.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingTag(tag)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {tag.description && (
                    <p className="text-sm text-gray-600 mb-3">{tag.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Utilisé {tag.usageCount} fois</span>
                    <span>Créé le {formatDate(tag.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun tag
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? "Aucun tag ne correspond à votre recherche"
                  : "Vous n'avez pas encore de tags pour ce projet"
                }
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Effacer la recherche
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

