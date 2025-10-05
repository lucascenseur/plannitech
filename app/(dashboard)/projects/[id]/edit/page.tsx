"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Project, ProjectFormData } from "@/types/project";
import { usePermissions } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

export default function EditProjectPage() {
  const { canManageProjects } = usePermissions();
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push(`/projects/${params.id}`);
      } else {
        const error = await response.json();
        console.error("Erreur lors de la mise à jour:", error);
        alert("Erreur lors de la mise à jour du projet");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du projet");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/projects/${params.id}`);
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
                Vous n'avez pas les permissions nécessaires pour modifier ce projet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProjectForm
        initialData={{
          name: project.name,
          description: project.description || "",
          type: project.type,
          status: project.status,
          startDate: project.startDate.toISOString().split('T')[0],
          endDate: project.endDate ? project.endDate.toISOString().split('T')[0] : "",
          venue: project.venue || "",
          budget: project.budget || 0,
          teamSize: project.teamSize || 1,
          isPublic: project.isPublic,
          tags: project.tags || [],
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={saving}
        title="Modifier le projet"
        description="Modifiez les informations de votre projet"
      />
    </div>
  );
}

