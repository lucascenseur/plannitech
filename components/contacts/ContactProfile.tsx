"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Contact, Collaboration, Rate, Availability, Skill } from "@/types/contact";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star,
  Edit,
  Heart,
  HeartOff,
  Calendar,
  DollarSign,
  Award,
  Clock,
  Users,
  FileText,
  Download,
  Share,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface ContactProfileProps {
  contact: Contact;
  onEdit: () => void;
  onToggleFavorite: () => void;
  onAddCollaboration: () => void;
  onAddRate: () => void;
  onAddAvailability: () => void;
  onExport: () => void;
  onShare: () => void;
}

export function ContactProfile({
  contact,
  onEdit,
  onToggleFavorite,
  onAddCollaboration,
  onAddRate,
  onAddAvailability,
  onExport,
  onShare,
}: ContactProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getTypeLabel = (type: string) => {
    const labels = {
      ARTIST: "Artiste",
      TECHNICIAN: "Technicien",
      VENUE: "Lieu",
      SUPPLIER: "Prestataire",
      OTHER: "Autre",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      ARTIST: "bg-purple-100 text-purple-800",
      TECHNICIAN: "bg-blue-100 text-blue-800",
      VENUE: "bg-green-100 text-green-800",
      SUPPLIER: "bg-orange-100 text-orange-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type as keyof typeof colors] || colors.OTHER;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-yellow-100 text-yellow-800",
      BLOCKED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.ACTIVE;
  };

  const getAvailabilityColor = (status: string) => {
    const colors = {
      AVAILABLE: "bg-green-100 text-green-800",
      BUSY: "bg-yellow-100 text-yellow-800",
      UNAVAILABLE: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.AVAILABLE;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const tabs = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      content: (
        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Email</span>
                  </div>
                  <p className="text-sm">{contact.email || "Non renseigné"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Téléphone</span>
                  </div>
                  <p className="text-sm">{contact.phone || "Non renseigné"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Site web</span>
                  </div>
                  <p className="text-sm">
                    {contact.website ? (
                      <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {contact.website}
                      </a>
                    ) : (
                      "Non renseigné"
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Adresse</span>
                  </div>
                  <p className="text-sm">
                    {contact.address ? (
                      `${contact.address.street || ""} ${contact.address.city || ""} ${contact.address.postalCode || ""} ${contact.address.country || ""}`.trim()
                    ) : (
                      "Non renseignée"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compétences */}
          {contact.skills && contact.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contact.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags et groupes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contact.tags && contact.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {contact.groups && contact.groups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Groupes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contact.groups.map((group) => (
                      <Badge key={group} variant="default">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "collaborations",
      label: "Collaborations",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Historique des collaborations</h3>
            <Button onClick={onAddCollaboration}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle collaboration
            </Button>
          </div>

          {contact.collaborations && contact.collaborations.length > 0 ? (
            <div className="space-y-4">
              {contact.collaborations.map((collaboration) => (
                <Card key={collaboration.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{collaboration.project.name}</h4>
                          <Badge variant="outline">{collaboration.project.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Rôle : {collaboration.role}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(collaboration.startDate)}
                              {collaboration.endDate && ` - ${formatDate(collaboration.endDate)}`}
                            </span>
                          </div>
                          <Badge
                            variant={
                              collaboration.status === "COMPLETED" ? "default" :
                              collaboration.status === "IN_PROGRESS" ? "secondary" :
                              collaboration.status === "PLANNED" ? "outline" : "destructive"
                            }
                          >
                            {collaboration.status}
                          </Badge>
                        </div>
                        {collaboration.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                            <span className="text-sm font-medium">{collaboration.rating}/5</span>
                          </div>
                        )}
                      </div>
                      {collaboration.feedback && (
                        <div className="text-sm text-gray-600 max-w-md">
                          <p className="font-medium mb-1">Commentaire :</p>
                          <p>{collaboration.feedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune collaboration
              </h3>
              <p className="text-gray-600">
                Ce contact n'a pas encore de collaboration enregistrée.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "rates",
      label: "Tarifs",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tarifs et conditions</h3>
            <Button onClick={onAddRate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau tarif
            </Button>
          </div>

          {contact.rates && contact.rates.length > 0 ? (
            <div className="space-y-4">
              {contact.rates.map((rate, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <h4 className="font-medium">{rate.type}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(rate.amount, rate.currency)} / {rate.unit}
                        </p>
                        {rate.conditions && (
                          <p className="text-sm text-gray-500">{rate.conditions}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Valide du {formatDate(rate.validFrom)}
                          {rate.validTo && ` au ${formatDate(rate.validTo)}`}
                        </p>
                        <Badge variant={rate.isActive ? "default" : "secondary"}>
                          {rate.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun tarif
              </h3>
              <p className="text-gray-600">
                Aucun tarif n'a été défini pour ce contact.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "availability",
      label: "Disponibilités",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Calendrier des disponibilités</h3>
            <Button onClick={onAddAvailability}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle disponibilité
            </Button>
          </div>

          {contact.availability && contact.availability.length > 0 ? (
            <div className="space-y-4">
              {contact.availability.map((avail, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <h4 className="font-medium">
                            {formatDate(new Date(avail.startDate))} - {formatDate(new Date(avail.endDate))}
                          </h4>
                        </div>
                        {avail.reason && (
                          <p className="text-sm text-gray-600">{avail.reason}</p>
                        )}
                        {avail.location && (
                          <p className="text-sm text-gray-500">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            {avail.location}
                          </p>
                        )}
                      </div>
                      <Badge className={getAvailabilityColor(avail.status)}>
                        {avail.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune disponibilité
              </h3>
              <p className="text-gray-600">
                Aucune disponibilité n'a été renseignée pour ce contact.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Documents et fichiers</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </div>

          {contact.documents && contact.documents.length > 0 ? (
            <div className="space-y-4">
              {contact.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-600">
                            {doc.type} • {(doc.size / 1024).toFixed(1)} KB
                          </p>
                          <p className="text-sm text-gray-500">
                            Ajouté le {formatDate(doc.uploadedAt)} par {doc.uploadedBy.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun document
              </h3>
              <p className="text-gray-600">
                Aucun document n'a été ajouté pour ce contact.
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="text-lg">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getTypeColor(contact.type)}>
                {getTypeLabel(contact.type)}
              </Badge>
              <Badge className={getStatusColor(contact.status)}>
                {contact.status}
              </Badge>
              {contact.isIntermittent && (
                <Badge variant="outline">
                  Intermittent
                </Badge>
              )}
              {contact.isFavorite && (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Favori
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onToggleFavorite}>
            {contact.isFavorite ? (
              <Heart className="h-4 w-4 mr-2 text-red-600" />
            ) : (
              <HeartOff className="h-4 w-4 mr-2" />
            )}
            {contact.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Description */}
      {contact.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-700">{contact.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}

