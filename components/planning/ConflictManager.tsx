"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocale } from '@/lib/i18n';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap,
  Settings
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Conflict {
  id: string;
  type: 'time' | 'resource' | 'venue' | 'team';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  items: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    type: string;
    assignedTo?: string[];
    venue?: string;
  }>;
  suggestions: Array<{
    id: string;
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    action: string;
  }>;
  resolved: boolean;
  createdAt: string;
}

interface ConflictManagerProps {
  showId?: string;
  startDate?: string;
  endDate?: string;
  onConflictResolved?: (conflictId: string) => void;
}

export function ConflictManager({ 
  showId, 
  startDate, 
  endDate, 
  onConflictResolved 
}: ConflictManagerProps) {
  const { t } = useLocale();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    fetchConflicts();
  }, [showId, startDate, endDate]);

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      
      // Récupérer les conflits depuis l'API
      const response = await fetch('/api/conflicts');
      if (!response.ok) {
        throw new Error('Failed to fetch conflicts');
      }
      const data = await response.json();
      setConflicts(data.conflicts || []);
    } catch (error) {
      console.error('Error fetching conflicts:', error);
      toast({
        title: t('conflict_manager.error_title'),
        description: t('conflict_manager.error_description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveConflict = async (conflictId: string, suggestionId: string) => {
    try {
      setResolving(conflictId);
      
      // Simuler la résolution du conflit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConflicts(prev => 
        prev.map(conflict => 
          conflict.id === conflictId 
            ? { ...conflict, resolved: true }
            : conflict
        )
      );
      
      toast({
        title: t('conflict_manager.resolve_success_title'),
        description: t('conflict_manager.resolve_success_description'),
      });

      onConflictResolved?.(conflictId);
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: t('conflict_manager.resolve_error_title'),
        description: t('conflict_manager.resolve_error_description'),
        variant: 'destructive',
      });
    } finally {
      setResolving(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time':
        return <Clock className="h-4 w-4" />;
      case 'resource':
        return <Settings className="h-4 w-4" />;
      case 'venue':
        return <MapPin className="h-4 w-4" />;
      case 'team':
        return <Users className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeConflicts = conflicts.filter(c => !c.resolved);
  const resolvedConflicts = conflicts.filter(c => c.resolved);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('conflict_manager.title')}
          </h2>
          <p className="text-gray-600">
            {t('conflict_manager.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchConflicts}
            className="bg-white text-gray-900 border-gray-300"
          >
            <Zap className="h-4 w-4 mr-2" />
            {t('conflict_manager.detect_new')}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {activeConflicts.length}
                </div>
                <div className="text-sm text-gray-600">
                  {t('conflict_manager.active_conflicts')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {resolvedConflicts.length}
                </div>
                <div className="text-sm text-gray-600">
                  {t('conflict_manager.resolved_conflicts')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {activeConflicts.filter(c => c.severity === 'critical').length}
                </div>
                <div className="text-sm text-gray-600">
                  {t('conflict_manager.critical_conflicts')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((resolvedConflicts.length / conflicts.length) * 100) || 0}%
                </div>
                <div className="text-sm text-gray-600">
                  {t('conflict_manager.resolution_rate')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Conflicts */}
      {activeConflicts.length > 0 && (
        <Card className="bg-white text-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {t('conflict_manager.active_conflicts')} ({activeConflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeConflicts.map((conflict) => (
                <div key={conflict.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(conflict.type)}
                        <h3 className="text-lg font-semibold">{conflict.title}</h3>
                        <Badge className={getSeverityColor(conflict.severity)}>
                          {conflict.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{conflict.description}</p>
                      
                      {/* Conflicting Items */}
                      <div className="space-y-2 mb-4">
                        {conflict.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-gray-600">
                                {formatTime(item.startTime)} - {formatTime(item.endTime)}
                              </div>
                              {item.assignedTo && (
                                <div className="text-sm text-gray-500">
                                  {t('conflict_manager.assigned_to')}: {item.assignedTo.join(', ')}
                                </div>
                              )}
                            </div>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                        ))}
                      </div>

                      {/* Suggestions */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">
                          {t('conflict_manager.suggestions')}:
                        </h4>
                        {conflict.suggestions.map((suggestion) => (
                          <div key={suggestion.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{suggestion.title}</div>
                              <div className="text-sm text-gray-600">{suggestion.description}</div>
                              <div className={`text-sm font-medium ${getImpactColor(suggestion.impact)}`}>
                                {t('conflict_manager.impact')}: {suggestion.impact}
                              </div>
                            </div>
                            <Button
                              onClick={() => resolveConflict(conflict.id, suggestion.id)}
                              disabled={resolving === conflict.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {resolving === conflict.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                t('conflict_manager.apply_suggestion')
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolved Conflicts */}
      {resolvedConflicts.length > 0 && (
        <Card className="bg-white text-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t('conflict_manager.resolved_conflicts')} ({resolvedConflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resolvedConflicts.map((conflict) => (
                <div key={conflict.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-800">{conflict.title}</div>
                      <div className="text-sm text-green-600">
                        {t('conflict_manager.resolved_on')}: {formatTime(conflict.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {t('conflict_manager.resolved')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Conflicts */}
      {conflicts.length === 0 && (
        <Card className="bg-white text-gray-900">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('conflict_manager.no_conflicts_title')}
            </h3>
            <p className="text-gray-600">
              {t('conflict_manager.no_conflicts_description')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
