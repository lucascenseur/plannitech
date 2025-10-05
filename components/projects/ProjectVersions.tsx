"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  GitBranch, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Edit,
  Clock,
  User,
  Tag
} from "lucide-react";

interface ProjectVersionsProps {
  projectId: string;
  projectName: string;
}

interface ProjectVersion {
  id: string;
  version: string;
  description: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  isCurrent: boolean;
  changes: string[];
  files: {
    name: string;
    size: number;
    type: string;
  }[];
}

export function ProjectVersions({ projectId, projectName }: ProjectVersionsProps) {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVersion, setNewVersion] = useState({
    version: "",
    description: "",
    changes: "",
  });

  useEffect(() => {
    loadVersions();
  }, [projectId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/versions`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newVersion,
          changes: newVersion.changes.split("\n").filter(change => change.trim()),
        }),
      });

      if (response.ok) {
        setNewVersion({ version: "", description: "", changes: "" });
        setShowCreateForm(false);
        await loadVersions();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la version:", error);
    }
  };

  const handleSetCurrent = async (versionId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/versions/${versionId}/current`, {
        method: "PUT",
      });

      if (response.ok) {
        await loadVersions();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDownloadVersion = async (versionId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/versions/${versionId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `version-${versionId}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Versions du projet</CardTitle>
              <CardDescription>
                Gérez les versions du projet "{projectName}"
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle version
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Numéro de version</Label>
                  <Input
                    id="version"
                    placeholder="1.0.0"
                    value={newVersion.version}
                    onChange={(e) => setNewVersion({ ...newVersion, version: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Description de la version"
                    value={newVersion.description}
                    onChange={(e) => setNewVersion({ ...newVersion, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="changes">Changements</Label>
                <Textarea
                  id="changes"
                  placeholder="Liste des changements (un par ligne)"
                  rows={4}
                  value={newVersion.changes}
                  onChange={(e) => setNewVersion({ ...newVersion, changes: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleCreateVersion} disabled={!newVersion.version}>
                  <Tag className="h-4 w-4 mr-2" />
                  Créer la version
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Versions List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des versions</CardTitle>
          <CardDescription>
            {versions.length} version{versions.length > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {versions.map((version) => (
              <div key={version.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={version.isCurrent ? "default" : "outline"}>
                        {version.version}
                      </Badge>
                      {version.isCurrent && (
                        <Badge variant="secondary">Version actuelle</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(version.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{version.createdBy.name}</span>
                      </div>
                    </div>

                    {version.changes.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">Changements:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {version.changes.map((change, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-gray-400">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {version.files.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Fichiers:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {version.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                              <span className="truncate">{file.name}</span>
                              <span className="text-gray-500">{formatFileSize(file.size)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadVersion(version.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {!version.isCurrent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetCurrent(version.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}