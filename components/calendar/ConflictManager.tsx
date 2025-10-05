"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Conflict, Availability, Event } from "@/types/planning";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  MapPin,
  Calendar,
  RefreshCw
} from "lucide-react";

interface ConflictManagerProps {
  eventId: string;
  onResolve: (conflictId: string, resolution: string) => void;
  onIgnore: (conflictId: string) => void;
}

export function ConflictManager({ eventId, onResolve, onIgnore }: ConflictManagerProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    loadConflicts();
    loadAvailabilities();
  }, [eventId]);

  const loadConflicts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/planning/events/${eventId}/conflicts`);
      if (response.ok) {
        const data = await response.json();
        setConflicts(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des conflits:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailabilities = async () => {
    try {
      const response = await fetch(`/api/planning/events/${eventId}/availability`);
      if (response.ok) {
        const data = await response.json();
        setAvailabilities(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des disponibilités:", error);
    }
  };

  const handleResolve = async (conflictId: string, resolution: string) => {
    try {
      setResolving(conflictId);
      const response = await fetch(`/api/planning/conflicts/${conflictId}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution }),
      });

      if (response.ok) {
        await loadConflicts();
        onResolve(conflictId, resolution);
      }
    } catch (error) {
      console.error("Erreur lors de la résolution:", error);
    } finally {
      setResolving(null);
    }
  };

  const handleIgnore = async (conflictId: string) => {
    try {
      setResolving(conflictId);
      const response = await fetch(`/api/planning/conflicts/${conflictId}/ignore`, {
        method: "PUT",
      });

      if (response.ok) {
        await loadConflicts();
        onIgnore(conflictId);
      }
    } catch (error) {
      console.error("Erreur lors de l'ignorance:", error);
    } finally {
      setResolving(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-orange-100 text-orange-800",
      CRITICAL: "bg-red-100 text-red-800",
    };
    return colors[severity as keyof typeof colors] || colors.MEDIUM;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "LOW":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "MEDIUM":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "HIGH":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "CRITICAL":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConflictTypeLabel = (type: string) => {
    const labels = {
      SCHEDULE: "Conflit d'horaire",
      RESOURCE: "Conflit de ressource",
      TEAM: "Conflit d'équipe",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAvailabilityStatus = (status: string) => {
    const statuses = {
      AVAILABLE: "Disponible",
      BUSY: "Occupé",
      UNAVAILABLE: "Indisponible",
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getAvailabilityColor = (status: string) => {
    const colors = {
      AVAILABLE: "bg-green-100 text-green-800",
      BUSY: "bg-yellow-100 text-yellow-800",
      UNAVAILABLE: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.AVAILABLE;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des conflits...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conflits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conflits détectés</CardTitle>
              <CardDescription>
                {conflicts.length} conflit{conflicts.length > 1 ? "s" : ""} détecté{conflicts.length > 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadConflicts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {conflicts.length > 0 ? (
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(conflict.severity)}
                      <h4 className="font-medium">{getConflictTypeLabel(conflict.conflictType)}</h4>
                      <Badge className={getSeverityColor(conflict.severity)}>
                        {conflict.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(conflict.id, "RESOLVED")}
                        disabled={resolving === conflict.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Résoudre
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIgnore(conflict.id)}
                        disabled={resolving === conflict.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Ignorer
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{conflict.description}</p>
                  
                  {conflict.affectedEvents.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2">Événements affectés:</h5>
                      <div className="flex flex-wrap gap-2">
                        {conflict.affectedEvents.map((eventId) => (
                          <Badge key={eventId} variant="outline">
                            {eventId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {conflict.resolution && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <h5 className="text-sm font-medium text-green-800 mb-1">Résolution:</h5>
                      <p className="text-sm text-green-700">{conflict.resolution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun conflit
              </h3>
              <p className="text-gray-600">
                Aucun conflit n'a été détecté pour cet événement.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disponibilités */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilités de l'équipe</CardTitle>
          <CardDescription>
            Vérifiez la disponibilité des membres de l'équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availabilities.length > 0 ? (
            <div className="space-y-3">
              {availabilities.map((availability) => (
                <div key={availability.contactId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{availability.contactId}</span>
                    </div>
                    <Badge className={getAvailabilityColor(availability.status)}>
                      {getAvailabilityStatus(availability.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(availability.startDate).toLocaleDateString("fr-FR")} - {new Date(availability.endDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {availability.reason && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{availability.reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune disponibilité
              </h3>
              <p className="text-gray-600">
                Aucune information de disponibilité n'est disponible pour cet événement.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé des conflits */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé des conflits</CardTitle>
            <CardDescription>
              Vue d'ensemble des conflits détectés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(
                conflicts.reduce((acc, conflict) => {
                  acc[conflict.severity] = (acc[conflict.severity] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(severity)}
                    <span className="font-medium">{severity}</span>
                  </div>
                  <Badge className={getSeverityColor(severity)}>
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

