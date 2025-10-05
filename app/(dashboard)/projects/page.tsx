"use client";

import { useState, useEffect } from "react";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectKanban } from "@/components/projects/ProjectKanban";
import { ProjectImportExport } from "@/components/projects/ProjectImportExport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  List, 
  Kanban, 
  Download, 
  Upload, 
  Plus,
  Settings
} from "lucide-react";
import { ProjectListView, ProjectKanbanView, ProjectCSVRow, ImportResult } from "@/types/project";

export default function ProjectsPage() {
  const { canManageProjects } = usePermissions();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectListView[]>([]);
  const [kanbanProjects, setKanbanProjects] = useState<ProjectKanbanView[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");

  // Charger les projets
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setKanbanProjects(data);
      } else {
        console.error("Erreur lors du chargement des projets");
        setProjects([]);
        setKanbanProjects([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
      setProjects([]);
      setKanbanProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    router.push("/projects/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/projects/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/projects/${id}`);
  };

  const handleDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/projects/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          projectIds: ids,
        }),
      });

      if (response.ok) {
        await loadProjects();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleArchive = async (ids: string[]) => {
    try {
      const response = await fetch("/api/projects/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ARCHIVE",
          projectIds: ids,
        }),
      });

      if (response.ok) {
        await loadProjects();
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  const handleExport = async (ids: string[]) => {
    try {
      const response = await fetch(`/api/projects/import-export/export?projectIds=${ids.join(",")}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `projets-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await loadProjects();
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  const handleImport = async (data: ProjectCSVRow[]): Promise<ImportResult> => {
    try {
      const response = await fetch("/api/projects/import-export/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const result = await response.json();
        await loadProjects();
        return result;
      } else {
        throw new Error("Erreur lors de l'import");
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      throw error;
    }
  };

  const tabs = [
    {
      id: "list",
      label: "Liste",
      content: (
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onExport={handleExport}
          onCreate={handleCreate}
          loading={loading}
        />
      ),
    },
    {
      id: "kanban",
      label: "Kanban",
      content: (
        <ProjectKanban
          projects={kanbanProjects}
          onView={handleView}
          onEdit={handleEdit}
          onArchive={(id) => handleArchive([id])}
          onStatusChange={handleStatusChange}
          onCreate={handleCreate}
        />
      ),
    },
    {
      id: "import-export",
      label: "Import/Export",
      content: (
        <ProjectImportExport
          onImport={handleImport}
          onExport={handleExport}
          projectIds={projects.map(p => p.id)}
        />
      ),
    },
  ];

  if (!canManageProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Accès non autorisé
              </h1>
              <p className="text-gray-600">
                Vous n'avez pas les permissions nécessaires pour gérer les projets.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push("/projects/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau projet
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="list" />
    </div>
  );
}
