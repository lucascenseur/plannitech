"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/project";
import { usePermissions } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProjectPage() {
  const { canManageProjects } = usePermissions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const project = await response.json();
        router.push(`/projects/${project.id}`);
      } else {
        const error = await response.json();
        console.error("Erreur lors de la création:", error);
        alert("Erreur lors de la création du projet");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création du projet");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/projects");
  };

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
                Vous n'avez pas les permissions nécessaires pour créer des projets.
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
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        title="Nouveau projet"
        description="Créez un nouveau projet de spectacle"
      />
    </div>
  );
}

