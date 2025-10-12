"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Package,
  Clock,
  Edit,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'show' | 'venue' | 'team' | 'equipment' | 'planning';
  action: 'created' | 'updated' | 'deleted' | 'assigned';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    showTitle?: string;
    venueName?: string;
    teamMemberName?: string;
    equipmentName?: string;
  };
}

export function RecentActivity() {
  const { t } = useLocale();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Récupérer les activités depuis l'API
      const response = await fetch('/api/activities');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string, action: string) => {
    switch (type) {
      case 'show':
        return <Calendar className="h-4 w-4" />;
      case 'venue':
        return <MapPin className="h-4 w-4" />;
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'equipment':
        return <Package className="h-4 w-4" />;
      case 'planning':
        return <Clock className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'show':
        return 'bg-blue-100 text-blue-800';
      case 'venue':
        return 'bg-green-100 text-green-800';
      case 'team':
        return 'bg-orange-100 text-orange-800';
      case 'equipment':
        return 'bg-purple-100 text-purple-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return t('recent_activity.just_now');
    } else if (diffInHours < 24) {
      return t('recent_activity.hours_ago', { hours: diffInHours });
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return t('recent_activity.days_ago', { days: diffInDays });
    }
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  if (loading) {
    return (
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle>{t('recent_activity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
            <Clock className="h-5 w-5" />
            {t('recent_activity.title')}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="bg-white text-gray-900 border-gray-300"
            >
              {t('recent_activity.all')}
            </Button>
            <Button
              variant={filter === 'show' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('show')}
              className="bg-white text-gray-900 border-gray-300"
            >
              {t('recent_activity.shows')}
            </Button>
            <Button
              variant={filter === 'planning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('planning')}
              className="bg-white text-gray-900 border-gray-300"
            >
              {t('recent_activity.planning')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('recent_activity.no_activities')}
            </h3>
            <p className="text-gray-600">
              {t('recent_activity.no_activities_description')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type, activity.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <Badge className={getActionColor(activity.action)}>
                      {activity.action}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{activity.user.name}</span>
                    <span>•</span>
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full bg-white text-gray-900 border-gray-300"
            >
              {t('recent_activity.view_all')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
