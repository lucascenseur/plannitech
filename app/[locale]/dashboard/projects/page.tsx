"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface ProjectsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const [locale, setLocale] = useState('fr');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  React.useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les projets
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleEdit = (id: string) => {
    console.log("Éditer le projet:", id);
    // TODO: Implémenter l'édition
  };

  const handleView = (id: string) => {
    console.log("Voir le projet:", id);
    // TODO: Implémenter la visualisation
  };

  const handleDelete = (ids: string[]) => {
    console.log("Supprimer les projets:", ids);
    // TODO: Implémenter la suppression
  };

  const handleArchive = (ids: string[]) => {
    console.log("Archiver les projets:", ids);
    // TODO: Implémenter l'archivage
  };

  const handleExport = (ids: string[]) => {
    console.log("Exporter les projets:", ids);
    // TODO: Implémenter l'export
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Projects' : locale === 'es' ? 'Proyectos' : 'Projets'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage your projects' 
              : locale === 'es' 
              ? 'Gestiona tus proyectos'
              : 'Gérez vos projets'
            }
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Create Project' : locale === 'es' ? 'Crear Proyecto' : 'Créer un projet'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {locale === 'en' ? 'Create Project' : locale === 'es' ? 'Crear Proyecto' : 'Créer un projet'}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm 
              onSubmit={async (data) => {
                try {
                  const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                  });

                  if (response.ok) {
                    const result = await response.json();
                    setProjects(prev => [...prev, result.project]);
                    setShowCreateDialog(false);
                    alert('Projet créé avec succès !');
                  } else {
                    alert('Erreur lors de la création du projet');
                  }
                } catch (error) {
                  console.error('Erreur:', error);
                  alert('Erreur lors de la création du projet');
                }
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
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
    </div>
  );
}
