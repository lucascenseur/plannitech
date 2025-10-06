"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectTasks } from "@/components/projects/ProjectTasks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TabsRoot as Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

interface ProjectsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const [locale, setLocale] = useState('fr');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
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
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
      setShowEditDialog(true);
    }
  };

  const handleView = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
      setShowViewDialog(true);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (confirm(locale === 'en' ? 'Are you sure you want to delete these projects?' : locale === 'es' ? '¿Estás seguro de que quieres eliminar estos proyectos?' : 'Êtes-vous sûr de vouloir supprimer ces projets ?')) {
      try {
        for (const id of ids) {
          const response = await fetch(`/api/projects?id=${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            setProjects(prev => prev.filter(p => p.id !== id));
          }
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleUpdateProject = async (projectData: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProject.id, ...projectData }),
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? result.project : p));
        setShowEditDialog(false);
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleQuickStatusChange = async (projectId: string, status: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId, status }),
      });

      if (response.ok) {
        setProjects(prev => prev.map(p => 
          p.id === projectId ? { ...p, status } : p
        ));
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

      {/* Dialog d'édition */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Edit Project' : locale === 'es' ? 'Editar Proyecto' : 'Modifier le projet'}
            </DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm 
              initialData={selectedProject}
              onSubmit={handleUpdateProject}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedProject(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject?.name || (locale === 'en' ? 'Project Details' : locale === 'es' ? 'Detalles del Proyecto' : 'Détails du projet')}
            </DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">
                  {locale === 'en' ? 'Overview' : locale === 'es' ? 'Resumen' : 'Aperçu'}
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  {locale === 'en' ? 'Tasks' : locale === 'es' ? 'Tareas' : 'Tâches'}
                </TabsTrigger>
                <TabsTrigger value="details">
                  {locale === 'en' ? 'Details' : locale === 'es' ? 'Detalles' : 'Détails'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {locale === 'en' ? 'Project Information' : locale === 'es' ? 'Información del Proyecto' : 'Informations du projet'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>{locale === 'en' ? 'Name:' : locale === 'es' ? 'Nombre:' : 'Nom :'}</strong> {selectedProject.name}</p>
                      <p><strong>{locale === 'en' ? 'Type:' : locale === 'es' ? 'Tipo:' : 'Type :'}</strong> {selectedProject.type}</p>
                      <p><strong>{locale === 'en' ? 'Status:' : locale === 'es' ? 'Estado:' : 'Statut :'}</strong> {selectedProject.status}</p>
                      <p><strong>{locale === 'en' ? 'Budget:' : locale === 'es' ? 'Presupuesto:' : 'Budget :'}</strong> €{selectedProject.budget?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {locale === 'en' ? 'Timeline' : locale === 'es' ? 'Cronograma' : 'Planning'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedProject.startDate && (
                        <p><strong>{locale === 'en' ? 'Start:' : locale === 'es' ? 'Inicio:' : 'Début :'}</strong> {new Date(selectedProject.startDate).toLocaleDateString()}</p>
                      )}
                      {selectedProject.endDate && (
                        <p><strong>{locale === 'en' ? 'End:' : locale === 'es' ? 'Fin:' : 'Fin :'}</strong> {new Date(selectedProject.endDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
                {selectedProject.description && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      {locale === 'en' ? 'Description' : locale === 'es' ? 'Descripción' : 'Description'}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedProject.description}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tasks">
                <ProjectTasks projectId={selectedProject.id} locale={locale} />
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {locale === 'en' ? 'Creation Info' : locale === 'es' ? 'Info de Creación' : 'Informations de création'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>{locale === 'en' ? 'Created:' : locale === 'es' ? 'Creado:' : 'Créé :'}</strong> {new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                      <p><strong>{locale === 'en' ? 'Updated:' : locale === 'es' ? 'Actualizado:' : 'Modifié :'}</strong> {new Date(selectedProject.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {locale === 'en' ? 'Actions' : locale === 'es' ? 'Acciones' : 'Actions'}
                    </h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setShowViewDialog(false);
                          handleEdit(selectedProject.id);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      
      <ProjectList 
        projects={projects}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onExport={handleExport}
        onCreate={handleCreate}
        onStatusChange={handleQuickStatusChange}
        loading={loading}
        locale={locale}
      />
    </div>
  );
}
