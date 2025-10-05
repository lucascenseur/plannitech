"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { Project } from "@/types/project";
import { usePermissions } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

export default function ProjectDetailPage() {
  const { canManageProjects } = usePermissions();
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadProject(params.id as string);
    }
  }, [params.id]);

  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        setError("Projet non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du projet:", error);
      setError("Erreur lors du chargement du projet");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/projects/${params.id}/edit`);
  };

  const handleArchive = async () => {
    try {
      const response = await fetch("/api/projects/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ARCHIVE",
          projectIds: [params.id],
        }),
      });

      if (response.ok) {
        router.push("/projects");
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/projects/import-export/export?projectIds=${params.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `projet-${project?.name}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.name,
        text: `Découvrez le projet ${project?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papiers");
    }
  };

  if (loading) {
    return <Loading text="Chargement du projet..." />;
  }

  if (error) {
    return (
      <Error
        title="Erreur"
        message={error}
        onRetry={() => loadProject(params.id as string)}
      />
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Projet non trouvé
              </h1>
              <p className="text-gray-600">
                Le projet demandé n'existe pas ou a été supprimé.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProjectDetail
      project={project}
      onEdit={handleEdit}
      onArchive={handleArchive}
      onExport={handleExport}
      onShare={handleShare}
    />
  );
}

