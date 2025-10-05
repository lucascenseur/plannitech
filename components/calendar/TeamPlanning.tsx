"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamPlanningView, CalendarEvent, Conflict } from "@/types/planning";
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Filter,
  Download,
  Share
} from "lucide-react";

interface TeamPlanningProps {
  onEventClick: (event: CalendarEvent) => void;
  onEventCreate: (teamMemberId: string, date: Date) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
  onConflictResolve: (conflictId: string) => void;
}

export function TeamPlanning({
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onConflictResolve,
}: TeamPlanningProps) {
  const [teamPlanning, setTeamPlanning] = useState<TeamPlanningView[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    loadTeamPlanning();
  }, [selectedDate, viewMode, filterRole, filterStatus]);

  const loadTeamPlanning = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        date: selectedDate.toISOString(),
        view: viewMode,
        role: filterRole,
        status: filterStatus,
      });
      
      const response = await fetch(`/api/planning/team?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTeamPlanning(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du planning équipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    const colors = {
      REHEARSAL: "bg-blue-100 text-blue-800 border-blue-200",
      PERFORMANCE: "bg-green-100 text-green-800 border-green-200",
      SETUP: "bg-orange-100 text-orange-800 border-orange-200",
      BREAKDOWN: "bg-red-100 text-red-800 border-red-200",
      MEETING: "bg-purple-100 text-purple-800 border-purple-200",
      OTHER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[event.type as keyof typeof colors] || colors.OTHER;
  };

  const getAvailabilityColor = (status: string) => {
    const colors = {
      AVAILABLE: "bg-green-100 text-green-800",
      BUSY: "bg-yellow-100 text-yellow-800",
      UNAVAILABLE: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.AVAILABLE;
  };

  const getConflictSeverity = (conflict: Conflict) => {
    const severities = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-orange-100 text-orange-800",
      CRITICAL: "bg-red-100 text-red-800",
    };
    return severities[conflict.severity as keyof typeof severities] || severities.MEDIUM;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      days.push({ date: dayDate, isCurrentMonth: true });
    }
    
    // Jours du mois suivant
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const dayDate = new Date(year, month + 1, day);
      days.push({ date: dayDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (events: CalendarEvent[], date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getAvailabilityForDate = (availabilities: any[], date: Date) => {
    return availabilities.find(availability => {
      const start = new Date(availability.start);
      const end = new Date(availability.end);
      return date >= start && date <= end;
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du planning équipe...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Planning équipe</h1>
          <p className="text-gray-600">
            Vue d'ensemble du planning de votre équipe
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => onEventCreate("", new Date())}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label>Date:</Label>
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label>Vue:</Label>
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label>Rôle:</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="TECHNICIAN">Technicien</SelectItem>
                  <SelectItem value="ARTIST">Artiste</SelectItem>
                  <SelectItem value="MANAGER">Gestionnaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label>Statut:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="AVAILABLE">Disponible</SelectItem>
                  <SelectItem value="BUSY">Occupé</SelectItem>
                  <SelectItem value="UNAVAILABLE">Indisponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Planning Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Membre de l'équipe
                  </th>
                  {viewMode === "week" ? (
                    getWeekDays(selectedDate).map((day) => (
                      <th key={day.toDateString()} className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        <div>{formatDate(day)}</div>
                      </th>
                    ))
                  ) : (
                    getMonthDays(selectedDate).map((day, index) => (
                      <th key={index} className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        <div className={day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}>
                          {day.date.getDate()}
                        </div>
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamPlanning.map((member) => (
                  <tr key={member.teamMember.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.teamMember.avatar} />
                          <AvatarFallback>
                            {member.teamMember.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.teamMember.name}</div>
                          <div className="text-sm text-gray-600">{member.teamMember.role}</div>
                        </div>
                      </div>
                    </td>
                    {viewMode === "week" ? (
                      getWeekDays(selectedDate).map((day) => {
                        const dayEvents = getEventsForDate(member.events, day);
                        const availability = getAvailabilityForDate(member.availability, day);
                        
                        return (
                          <td key={day.toDateString()} className="px-4 py-3">
                            <div className="space-y-2">
                              {availability && (
                                <Badge className={getAvailabilityColor(availability.status)}>
                                  {availability.status}
                                </Badge>
                              )}
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-2 rounded cursor-pointer hover:opacity-80 ${getEventColor(event)}`}
                                  onClick={() => onEventClick(event)}
                                >
                                  <div className="font-medium truncate">{event.title}</div>
                                  <div className="text-gray-600">
                                    {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        );
                      })
                    ) : (
                      getMonthDays(selectedDate).map((day, index) => {
                        const dayEvents = getEventsForDate(member.events, day.date);
                        const availability = getAvailabilityForDate(member.availability, day.date);
                        
                        return (
                          <td key={index} className="px-4 py-3">
                            <div className="space-y-1">
                              {availability && (
                                <Badge className={getAvailabilityColor(availability.status)}>
                                  {availability.status}
                                </Badge>
                              )}
                              {dayEvents.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getEventColor(event)}`}
                                  onClick={() => onEventClick(event)}
                                >
                                  <div className="truncate">{event.title}</div>
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{dayEvents.length - 2} autres
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Summary */}
      {teamPlanning.some(member => member.conflicts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Conflits détectés</CardTitle>
            <CardDescription>
              Conflits de planning dans votre équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPlanning.map((member) => (
                member.conflicts.length > 0 && (
                  <div key={member.teamMember.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.teamMember.avatar} />
                        <AvatarFallback>
                          {member.teamMember.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.teamMember.name}</span>
                      <Badge variant="secondary">{member.conflicts.length} conflit{member.conflicts.length > 1 ? "s" : ""}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {member.conflicts.map((conflict) => (
                        <div key={conflict.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">{conflict.description}</span>
                            <Badge className={getConflictSeverity(conflict)}>
                              {conflict.severity}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onConflictResolve(conflict.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Résoudre
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
