"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Show {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  status: 'draft' | 'planning' | 'confirmed' | 'cancelled';
  artists: string[];
  team: number;
  budget: number;
  description?: string;
}

export function UpcomingShows() {
  const { t } = useLocale();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingShows();
  }, []);

  const fetchUpcomingShows = async () => {
    try {
      const response = await fetch('/api/shows');
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      
      const upcomingShows = (data.shows || [])
        .filter((show: Show) => {
          const showDate = new Date(show.date);
          const today = new Date();
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return showDate >= today && showDate <= nextWeek && show.status !== 'cancelled';
        })
        .sort((a: Show, b: Show) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

      setShows(upcomingShows);
    } catch (error) {
      console.error('Error fetching upcoming shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'planning':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCountdown = (date: string, time: string) => {
    const showDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffInMs = showDateTime.getTime() - now.getTime();
    
    if (diffInMs < 0) {
      return t('upcoming_shows.past');
    }
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return t('upcoming_shows.days_away', { days: diffInDays });
    } else if (diffInHours > 0) {
      return t('upcoming_shows.hours_away', { hours: diffInHours });
    } else {
      return t('upcoming_shows.soon');
    }
  };

  const getUrgencyColor = (date: string) => {
    const showDate = new Date(date);
    const today = new Date();
    const diffInDays = Math.floor((showDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 1) {
      return 'border-red-300 bg-red-50';
    } else if (diffInDays <= 3) {
      return 'border-yellow-300 bg-yellow-50';
    } else {
      return 'border-gray-200 bg-white';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle>{t('upcoming_shows.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white text-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('upcoming_shows.title')}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/dashboard/shows'}
            className="bg-white text-gray-900 border-gray-300"
          >
            {t('upcoming_shows.view_all')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {shows.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('upcoming_shows.no_shows')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('upcoming_shows.no_shows_description')}
            </p>
            <Button
              onClick={() => window.location.href = '/dashboard/shows/new'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('upcoming_shows.create_first_show')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {shows.map((show) => (
              <div
                key={show.id}
                className={`p-4 rounded-lg border transition-colors hover:shadow-md ${getUrgencyColor(show.date)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {show.title}
                      </h4>
                      <Badge className={getStatusColor(show.status)}>
                        {show.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(show.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{show.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{show.venue}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{show.team} {t('upcoming_shows.people')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{show.budget.toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {getCountdown(show.date, show.time)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('upcoming_shows.countdown')}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/dashboard/shows/${show.id}`}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/dashboard/shows/${show.id}/edit`}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {show.artists && show.artists.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-1">
                      {t('upcoming_shows.artists')}:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {show.artists.map((artist, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {artist}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {show.description && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {show.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {shows.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full bg-white text-gray-900 border-gray-300"
              onClick={() => window.location.href = '/dashboard/shows'}
            >
              {t('upcoming_shows.view_all_shows')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
