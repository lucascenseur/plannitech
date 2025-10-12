"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n';
import { 
  Clock, 
  Calendar, 
  Users, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TimelineItem {
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
  description?: string;
}

interface TimelineProps {
  showId?: string;
  onItemClick?: (item: TimelineItem) => void;
  onItemEdit?: (item: TimelineItem) => void;
  onItemDelete?: (item: TimelineItem) => void;
}

export function Timeline({ showId, onItemClick, onItemEdit, onItemDelete }: TimelineProps) {
  const { t } = useLocale();
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState({ start: 6, end: 24 });

  useEffect(() => {
    fetchTimelineItems();
  }, [showId]);

  const fetchTimelineItems = async () => {
    try {
      const url = showId ? `/api/planning?showId=${showId}` : '/api/planning';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline items');
      }
      const data = await response.json();
      setItems(data.planningItems || []);
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      toast({
        title: t('timeline.error_title'),
        description: t('timeline.error_description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getItemColor = (type: string) => {
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

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'setup':
      case 'breakdown':
        return <Clock className="h-4 w-4" />;
      case 'performance':
        return <Calendar className="h-4 w-4" />;
      case 'transport':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getItemPosition = (item: TimelineItem) => {
    const startTime = new Date(item.startTime);
    const endTime = new Date(item.endTime);
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours
    
    const top = ((startHour - timeRange.start) / (timeRange.end - timeRange.start)) * 100;
    const height = (duration / (timeRange.end - timeRange.start)) * 100;
    
    return {
      top: `${Math.max(0, top)}%`,
      height: `${Math.min(100, height)}%`,
    };
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handlePreviousDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const filteredItems = items.filter(item => {
    const itemDate = new Date(item.startTime);
    return itemDate.toDateString() === currentDate.toDateString();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="bg-white text-gray-900 border-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold">
            {currentDate.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="bg-white text-gray-900 border-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="bg-white text-gray-900 border-gray-300"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="bg-white text-gray-900 border-gray-300"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('timeline.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Time grid */}
            <div className="absolute inset-0">
              {Array.from({ length: timeRange.end - timeRange.start }, (_, i) => {
                const hour = timeRange.start + i;
                const top = (i / (timeRange.end - timeRange.start)) * 100;
                return (
                  <div
                    key={hour}
                    className="absolute w-full border-t border-gray-200"
                    style={{ top: `${top}%` }}
                  >
                    <div className="absolute -left-12 -top-2 text-xs text-gray-500">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Timeline items */}
            <div className="relative min-h-[600px]">
              {filteredItems.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('timeline.no_items')}
                    </h3>
                    <p className="text-gray-600">
                      {t('timeline.no_items_description')}
                    </p>
                  </div>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const position = getItemPosition(item);
                  return (
                    <div
                      key={item.id}
                      className={`absolute left-4 right-4 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${getItemColor(item.type)} text-white`}
                      style={{
                        top: position.top,
                        height: position.height,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                      }}
                      onClick={() => onItemClick?.(item)}
                    >
                      <div className="flex items-start justify-between h-full">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getItemIcon(item.type)}
                            <span className="font-semibold text-sm truncate">
                              {item.title}
                            </span>
                          </div>
                          <div className="text-xs opacity-90">
                            {formatTime(item.startTime)} - {formatTime(item.endTime)}
                          </div>
                          {item.show && (
                            <div className="text-xs opacity-90 truncate">
                              {item.show.title}
                            </div>
                          )}
                          {item.venue && (
                            <div className="text-xs opacity-90 truncate">
                              {item.venue.name}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemEdit?.(item);
                            }}
                            className="h-6 w-6 p-0 text-white hover:bg-white/20"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemDelete?.(item);
                            }}
                            className="h-6 w-6 p-0 text-white hover:bg-white/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">{t('timeline.legend.setup')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">{t('timeline.legend.rehearsal')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm">{t('timeline.legend.performance')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm">{t('timeline.legend.breakdown')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">{t('timeline.legend.transport')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span className="text-sm">{t('timeline.legend.catering')}</span>
        </div>
      </div>
    </div>
  );
}
