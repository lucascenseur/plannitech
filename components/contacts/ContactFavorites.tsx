"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Contact, ContactFilters } from "@/types/contact";
import { 
  Star, 
  StarOff, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Grid,
  List,
  Heart,
  HeartOff,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Tag,
  Award
} from "lucide-react";

interface ContactFavoritesProps {
  favorites: Contact[];
  onRemoveFavorite: (contactId: string) => void;
  onView: (contactId: string) => void;
  onEdit: (contactId: string) => void;
  onToggleFavorite: (contactId: string) => void;
  loading?: boolean;
}

export function ContactFavorites({
  favorites,
  onRemoveFavorite,
  onView,
  onEdit,
  onToggleFavorite,
  loading = false,
}: ContactFavoritesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "type" | "rating" | "lastActivity">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredFavorites = favorites
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || contact.type === filterType;
      const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case "lastActivity":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des favoris...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Favoris</h1>
          <p className="text-gray-600">
            {favorites.length} contact{favorites.length > 1 ? "s" : ""} en favori{favorites.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les favoris..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="ARTIST">Artiste</SelectItem>
                <SelectItem value="TECHNICIAN">Technicien</SelectItem>
                <SelectItem value="VENUE">Lieu</SelectItem>
                <SelectItem value="SUPPLIER">Prestataire</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
                <SelectItem value="BLOCKED">Bloqué</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="rating">Note</SelectItem>
                <SelectItem value="lastActivity">Dernière activité</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredFavorites.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                {viewMode === "grid" ? (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getTypeColor(contact.type)}>
                              {getTypeLabel(contact.type)}
                            </Badge>
                            <Badge className={getStatusColor(contact.status)}>
                              {contact.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleFavorite(contact.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      {contact.email && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{contact.address.city}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {contact.skills && contact.skills.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Compétences</h4>
                        <div className="flex flex-wrap gap-1">
                          {contact.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {contact.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{contact.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {contact.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                        <span className="text-sm font-medium">{contact.rating}/5</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onView(contact.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onEdit(contact.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(contact.updatedAt)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getTypeColor(contact.type)}>
                            {getTypeLabel(contact.type)}
                          </Badge>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                          {contact.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
                              <span className="text-xs">{contact.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onView(contact.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onEdit(contact.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleFavorite(contact.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun favori
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Aucun contact ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore de contacts en favori."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

