"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabCard } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Project } from "@/types/project";
import { 
  Edit, 
  Archive, 
  Download, 
  Share, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Tag,
  FileText,
  Wrench,
  BarChart3,
  Settings
} from "lucide-react";

interface ProjectDetailProps {
  project: Project;
  onEdit: () => void;
  onArchive: () => void;
  onExport: () => void;
  onShare: () => void;
}

export function ProjectDetail({
  project,
  onEdit,
  onArchive,
  onExport,
  onShare,
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const breadcrumbItems = [
    { label: "Projets", href: "/projects" },
    { label: project.name },
  ];

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabs = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      content: (
        <TabCard title="Informations générales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">
                  {project.description || "Aucune description fournie"}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Détails</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {formatDate(project.startDate)}
                      {project.endDate && ` - ${formatDate(project.endDate)}`}
                    </span>
                  </div>
                  
                  {project.venue && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{project.venue}</span>
                    </div>
                  )}
                  
                  {project.budget && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{project.budget.toLocaleString()}€</span>
                    </div>
                  )}
                  
                  {project.teamSize && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{project.teamSize} personnes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Statut et type</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Statut:</span>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Type:</span>
                    <Badge variant="outline">{getTypeLabel(project.type)}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Public:</span>
                    <Badge variant={project.isPublic ? "default" : "secondary"}>
                      {project.isPublic ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </div>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabCard>
      ),
    },
    {
      id: "team",
      label: "Équipe",
      content: (
        <TabCard title="Membres de l'équipe">
          <div className="space-y-4">
            {project.contacts && project.contacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.contacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{contact.contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.role}</p>
                        <p className="text-sm text-gray-500">{contact.contact.email}</p>
                        <Badge variant="outline" className="text-xs">
                          {contact.contact.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun membre d'équipe assigné</p>
              </div>
            )}
          </div>
        </TabCard>
      ),
    },
    {
      id: "planning",
      label: "Planning",
      content: (
        <TabCard title="Événements et planning">
          <div className="space-y-4">
            {project.planningItems && project.planningItems.length > 0 ? (
              <div className="space-y-3">
                {project.planningItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{formatDate(item.startDate)}</span>
                            {item.endDate && <span>au {formatDate(item.endDate)}</span>}
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                        </div>
                        <Badge variant="secondary">{item.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun événement planifié</p>
              </div>
            )}
          </div>
        </TabCard>
      ),
    },
    {
      id: "budget",
      label: "Budget",
      content: (
        <TabCard title="Gestion budgétaire">
          <div className="space-y-4">
            {project.budgetItems && project.budgetItems.length > 0 ? (
              <div className="space-y-3">
                {project.budgetItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{item.description}</h4>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(item.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.amount.toLocaleString()}€</p>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun élément budgétaire</p>
              </div>
            )}
          </div>
        </TabCard>
      ),
    },
    {
      id: "technical",
      label: "Technique",
      content: (
        <TabCard title="Fiches techniques">
          <div className="space-y-4">
            {project.technicalSheets && project.technicalSheets.length > 0 ? (
              <div className="space-y-3">
                {project.technicalSheets.map((sheet) => (
                  <Card key={sheet.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{sheet.title}</h4>
                          <p className="text-sm text-gray-600">{sheet.type}</p>
                          <p className="text-sm text-gray-500">
                            Modifié le {formatDate(sheet.lastModified)}
                          </p>
                        </div>
                        <Badge variant="outline">{sheet.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucune fiche technique</p>
              </div>
            )}
          </div>
        </TabCard>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <TabCard title="Documents et fichiers">
          <div className="space-y-4">
            {project.documents && project.documents.length > 0 ? (
              <div className="space-y-3">
                {project.documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div>
                            <h4 className="font-semibold">{doc.name}</h4>
                            <p className="text-sm text-gray-600">
                              {doc.type} • {(doc.size / 1024).toFixed(1)} KB
                            </p>
                            <p className="text-sm text-gray-500">
                              Ajouté le {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun document</p>
              </div>
            )}
          </div>
        </TabCard>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{project.name}</h1>
          <p className="text-gray-600 mt-1">
            Créé par {project.createdBy.name} le {formatDate(project.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" onClick={onArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archiver
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}

