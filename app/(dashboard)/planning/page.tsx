"use client";

import { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventForm } from "@/components/calendar/EventForm";
import { ConflictManager } from "@/components/calendar/ConflictManager";
import { NotificationManager } from "@/components/calendar/NotificationManager";
import { CalendarExport as CalendarExportComponent } from "@/components/calendar/CalendarExport";
import { TeamPlanning } from "@/components/calendar/TeamPlanning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Users, 
  Download, 
  Share, 
  Plus,
  Settings,
  Bell,
  AlertTriangle
} from "lucide-react";
import { CalendarEvent, Event, EventFormData, CalendarExport as CalendarExportType } from "@/types/planning";

export default function PlanningPage() {
  const { canManageProjects } = usePermissions();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showConflictManager, setShowConflictManager] = useState(false);
  const [showNotificationManager, setShowNotificationManager] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTeamPlanning, setShowTeamPlanning] = useState(false);

  // Charger les événements
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/planning/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    // Convertir CalendarEvent en Event
    const eventData: Event = {
      id: event.id,
      title: event.title,
      description: "",
      startDate: event.start.toISOString(),
      endDate: event.end.toISOString(),
      isAllDay: event.allDay,
      type: event.type as "REHEARSAL" | "PERFORMANCE" | "MEETING" | "SETUP" | "BREAKDOWN" | "OTHER",
      status: event.status as "CONFIRMED" | "TENTATIVE" | "CANCELLED",
      priority: event.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      location: "",
      notes: "",
      isRecurring: false,
      recurrenceRule: null,
      reminders: [],
      project: event.project,
      contacts: event.contacts,
      team: [],
      conflicts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      organizationId: "",
      createdById: "",
      createdBy: {
        id: "",
        name: "",
        email: ""
      }
    };
    setSelectedEvent(eventData);
    setShowEventForm(true);
  };

  const handleEventCreate = (date: Date) => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEventUpdate = (event: CalendarEvent) => {
    // Logique de mise à jour
    console.log("Mise à jour de l'événement:", event);
  };

  const handleEventDelete = (eventId: string) => {
    // Logique de suppression
    console.log("Suppression de l'événement:", eventId);
  };

  const handleEventSubmit = async (data: EventFormData) => {
    try {
      const response = await fetch("/api/planning/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await loadEvents();
        setShowEventForm(false);
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
    }
  };

  const handleExport = () => {
    setShowExport(true);
  };

  const handleShare = () => {
    // Logique de partage
    console.log("Partage du planning");
  };

  const handleFiltersChange = (filters: any) => {
    // Logique de filtrage
    console.log("Filtres appliqués:", filters);
  };

  const handleExportSubmit = (exportData: CalendarExportType) => {
    // Logique d'export
    console.log("Export du planning:", exportData);
  };

  const handleShareSubmit = (exportData: CalendarExportType) => {
    // Logique de partage
    console.log("Partage du planning:", exportData);
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
                Vous n'avez pas les permissions nécessaires pour gérer le planning.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: "calendar",
      label: "Calendrier",
      content: (
        <CalendarView
          events={events}
          onEventClick={handleEventClick}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          onShare={handleShare}
          loading={loading}
        />
      ),
    },
    {
      id: "team",
      label: "Planning équipe",
      content: (
        <TeamPlanning
          onEventClick={handleEventClick}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onConflictResolve={(conflictId) => console.log("Résolution du conflit:", conflictId)}
        />
      ),
    },
    {
      id: "export",
      label: "Export",
      content: (
        <CalendarExportComponent
          events={events}
          onExport={handleExportSubmit}
          onShare={handleShareSubmit}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning</h1>
          <p className="text-gray-600">
            Gérez votre planning et vos événements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowTeamPlanning(true)}>
            <Users className="h-4 w-4 mr-2" />
            Planning équipe
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button onClick={() => handleEventCreate(new Date())}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="calendar" />

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <EventForm
              initialData={selectedEvent ? {
                title: selectedEvent.title,
                description: selectedEvent.description || "",
                startDate: selectedEvent.start.toISOString().split('T')[0],
                endDate: selectedEvent.end.toISOString().split('T')[0],
                allDay: selectedEvent.allDay,
                location: selectedEvent.location || "",
                type: selectedEvent.type,
                status: selectedEvent.status,
                priority: selectedEvent.priority,
                projectId: selectedEvent.project?.id || "",
                contactIds: selectedEvent.contacts?.map(c => c.id) || [],
                teamIds: selectedEvent.team?.map(t => t.id) || [],
                isRecurring: false,
                reminders: [],
              } : undefined}
              onSubmit={handleEventSubmit}
              onCancel={() => setShowEventForm(false)}
              title={selectedEvent ? "Modifier l'événement" : "Nouvel événement"}
              description={selectedEvent ? "Modifiez les informations de votre événement" : "Créez un nouvel événement dans votre planning"}
            />
          </div>
        </div>
      )}

      {/* Conflict Manager Modal */}
      {showConflictManager && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ConflictManager
              eventId={selectedEvent.id}
              onResolve={(conflictId, resolution) => console.log("Résolution:", conflictId, resolution)}
              onIgnore={(conflictId) => console.log("Ignorer:", conflictId)}
            />
          </div>
        </div>
      )}

      {/* Notification Manager Modal */}
      {showNotificationManager && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <NotificationManager
              eventId={selectedEvent.id}
              event={selectedEvent}
              onNotificationSent={(notification) => console.log("Notification envoyée:", notification)}
            />
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CalendarExportComponent
              events={events}
              onExport={handleExportSubmit}
              onShare={handleShareSubmit}
            />
          </div>
        </div>
      )}

      {/* Team Planning Modal */}
      {showTeamPlanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <TeamPlanning
              onEventClick={handleEventClick}
              onEventCreate={handleEventCreate}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
              onConflictResolve={(conflictId) => console.log("Résolution du conflit:", conflictId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}