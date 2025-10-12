"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  show?: {
    title: string;
  };
  venue?: {
    name: string;
  };
  assignedTo: any[];
  status: string;
}

interface CalendarProps {
  showId?: string;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
}

export function Calendar({ showId, onDateClick, onEventClick, onEventEdit, onEventDelete }: CalendarProps) {
  const { t } = useLocale();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [showId, currentDate]);

  const fetchEvents = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const url = showId 
        ? `/api/planning?showId=${showId}&startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`
        : `/api/planning?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.planningItems || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'setup':
        return 'bg-blue-500';
      case 'rehearsal':
        return 'bg-green-500';
      case 'performance':
        return 'bg-purple-500';
      case 'breakdown':
        return 'bg-orange-500';
      case 'transport':
        return 'bg-yellow-500';
      case 'catering':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'setup':
      case 'breakdown':
        return <Clock className="h-3 w-3" />;
      case 'performance':
        return <CalendarIcon className="h-3 w-3" />;
      case 'transport':
        return <MapPin className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateEvents = getEventsForDate(current);
      const isCurrentMonth = current.getMonth() === month;
      const isCurrentDay = isToday(current);
      const isSelectedDay = isSelected(current);
      
      days.push(
        <div
          key={current.toISOString()}
          className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          } ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''} ${
            isSelectedDay ? 'bg-blue-100 border-blue-400' : ''
          }`}
          onClick={() => handleDateClick(current)}
        >
          <div className={`text-sm font-medium mb-1 ${
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          } ${isCurrentDay ? 'text-blue-600' : ''}`}>
            {current.getDate()}
          </div>
          
          <div className="space-y-1">
            {dateEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 ${getEventColor(event.type)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
              >
                <div className="flex items-center gap-1">
                  {getEventIcon(event.type)}
                  <span className="truncate">{event.title}</span>
                </div>
              </div>
            ))}
            {dateEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dateEvents.length - 3} {t('calendar.more_events')}
              </div>
            )}
          </div>
        </div>
      );
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePreviousMonth}
            className="bg-white text-gray-900 border-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </h2>
          <Button
            variant="outline"
            onClick={handleNextMonth}
            className="bg-white text-gray-900 border-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          onClick={() => onDateClick?.(new Date())}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('calendar.add_event')}
        </Button>
      </div>

      {/* Calendar */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {t('calendar.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0">
            {/* Week days header */}
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">{t('calendar.legend.setup')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">{t('calendar.legend.rehearsal')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm">{t('calendar.legend.performance')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm">{t('calendar.legend.breakdown')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">{t('calendar.legend.transport')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span className="text-sm">{t('calendar.legend.catering')}</span>
        </div>
      </div>
    </div>
  );
}
