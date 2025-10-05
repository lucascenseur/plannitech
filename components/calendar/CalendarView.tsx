"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { CalendarEvent, CalendarView, PlanningFilters } from "@/types/planning";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users,
  Plus,
  Filter,
  Download,
  Share
} from "lucide-react";

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventCreate: (date: Date) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
  onFiltersChange: (filters: PlanningFilters) => void;
  onExport: () => void;
  onShare: () => void;
  loading?: boolean | undefined;
}

export function CalendarView({
  events,
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onFiltersChange,
  onExport,
  onShare,
  loading = false,
}: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<CalendarView["type"]>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: "border-l-green-500",
      MEDIUM: "border-l-blue-500",
      HIGH: "border-l-orange-500",
      URGENT: "border-l-red-500",
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getViewTitle = () => {
    const options = {
      year: "numeric",
      month: "long",
    };
    
    if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${endOfWeek.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    
    if (currentView === "day") {
      return formatDate(currentDate);
    }
    
    return currentDate.toLocaleDateString("fr-FR", options);
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    
    switch (currentView) {
      case "month":
        newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "day":
        newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onEventCreate(date);
  };

  const tabs = [
    {
      id: "month",
      label: "Mois",
      content: (
        <MonthView
          date={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateClick={handleDateClick}
          onEventUpdate={onEventUpdate}
          onEventDelete={onEventDelete}
        />
      ),
    },
    {
      id: "week",
      label: "Semaine",
      content: (
        <WeekView
          date={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateClick={handleDateClick}
          onEventUpdate={onEventUpdate}
          onEventDelete={onEventDelete}
        />
      ),
    },
    {
      id: "day",
      label: "Jour",
      content: (
        <DayView
          date={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateClick={handleDateClick}
          onEventUpdate={onEventUpdate}
          onEventDelete={onEventDelete}
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
          <Button variant="outline" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => onEventCreate(new Date())}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Aujourd'hui
              </Button>
            </div>
            
            <h2 className="text-xl font-semibold">{getViewTitle()}</h2>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={currentView === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("month")}
              >
                Mois
              </Button>
              <Button
                variant={currentView === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("week")}
              >
                Semaine
              </Button>
              <Button
                variant={currentView === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("day")}
              >
                Jour
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      <Tabs tabs={tabs} defaultTab={currentView} />
    </div>
  );
}

// Composant pour la vue mensuelle
function MonthView({
  date,
  events,
  onEventClick,
  onDateClick,
  onEventUpdate,
  onEventDelete,
}: {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(date);

  const getDaysInMonth = (date: Date) => {
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

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* En-têtes des jours */}
          {weekDays.map((day) => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
          
          {/* Jours du mois */}
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-[120px] ${
                  day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                } ${isToday ? "bg-blue-50" : ""}`}
                onClick={() => onDateClick(day.date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>
                    {day.date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayEvents.length}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="truncate font-medium">{event.title}</div>
                      {!event.allDay && (
                        <div className="text-gray-500">
                          {formatTime(new Date(event.start))}
                        </div>
                      )}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour la vue hebdomadaire
function WeekView({
  date,
  events,
  onEventClick,
  onDateClick,
  onEventUpdate,
  onEventDelete,
}: {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}) {
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

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = getWeekDays(date);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {/* En-tête des heures */}
          <div className="bg-gray-50 p-2 text-sm font-medium text-gray-700">
            Heure
          </div>
          
          {/* En-têtes des jours */}
          {weekDays.map((day) => (
            <div key={day.toDateString()} className="bg-gray-50 p-2 text-center">
              <div className="text-sm font-medium text-gray-900">
                {day.toLocaleDateString("fr-FR", { weekday: "short" })}
              </div>
              <div className="text-xs text-gray-600">
                {day.getDate()}
              </div>
            </div>
          ))}
          
          {/* Grille des heures */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="bg-gray-50 p-2 text-sm text-gray-700 border-r">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const hourEvents = dayEvents.filter(event => {
                  const eventHour = new Date(event.start).getHours();
                  return eventHour === hour;
                });
                
                return (
                  <div
                    key={`${day.toDateString()}-${hour}`}
                    className="bg-white p-1 min-h-[60px] border-r border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => onDateClick(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour))}
                  >
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="truncate font-medium">{event.title}</div>
                        <div className="text-gray-500">
                          {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour la vue journalière
function DayView({
  date,
  events,
  onEventClick,
  onDateClick,
  onEventUpdate,
  onEventDelete,
}: {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}) {
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = getEventsForDate(date);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-px bg-gray-200">
          {/* En-tête des heures */}
          <div className="bg-gray-50 p-2 text-sm font-medium text-gray-700">
            Heure
          </div>
          
          {/* En-tête du jour */}
          <div className="bg-gray-50 p-2 text-center">
            <div className="text-sm font-medium text-gray-900">
              {date.toLocaleDateString("fr-FR", { weekday: "long" })}
            </div>
            <div className="text-xs text-gray-600">
              {date.getDate()} {date.toLocaleDateString("fr-FR", { month: "long" })}
            </div>
          </div>
          
          {/* Grille des heures */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="bg-gray-50 p-2 text-sm text-gray-700 border-r">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div
                className="bg-white p-1 min-h-[60px] border-r border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onDateClick(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour))}
              >
                {dayEvents
                  .filter(event => {
                    const eventHour = new Date(event.start).getHours();
                    return eventHour === hour;
                  })
                  .map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="truncate font-medium">{event.title}</div>
                      <div className="text-gray-500">
                        {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                      </div>
                    </div>
                  ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

