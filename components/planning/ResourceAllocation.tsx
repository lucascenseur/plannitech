"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  MapPin
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'person' | 'equipment' | 'venue';
  availability: {
    [date: string]: {
      start: string;
      end: string;
      status: 'available' | 'busy' | 'unavailable';
    }[];
  };
}

interface Allocation {
  id: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  title: string;
  status: 'confirmed' | 'pending' | 'conflict';
}

interface ResourceAllocationProps {
  startDate?: Date;
  endDate?: Date;
  onConflictClick?: (conflict: any) => void;
  onResourceClick?: (resource: Resource) => void;
}

export function ResourceAllocation({ 
  startDate = new Date(), 
  endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  onConflictClick,
  onResourceClick
}: ResourceAllocationProps) {
  const { t } = useLocale();
  const [resources, setResources] = useState<Resource[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState<any[]>([]);

  useEffect(() => {
    fetchResources();
    fetchAllocations();
  }, [startDate, endDate]);

  const fetchResources = async () => {
    try {
      const [teamResponse, equipmentResponse, venuesResponse] = await Promise.all([
        fetch('/api/team/members'),
        fetch('/api/equipment'),
        fetch('/api/venues')
      ]);

      const [teamData, equipmentData, venuesData] = await Promise.all([
        teamResponse.json(),
        equipmentResponse.json(),
        venuesResponse.json()
      ]);

      const allResources: Resource[] = [
        ...(teamData.members || []).map((member: any) => ({
          id: member.id,
          name: member.name,
          type: 'person' as const,
          availability: generateAvailability(member.availability)
        })),
        ...(equipmentData.equipment || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          type: 'equipment' as const,
          availability: generateAvailability('available')
        })),
        ...(venuesData.venues || []).map((venue: any) => ({
          id: venue.id,
          name: venue.name,
          type: 'venue' as const,
          availability: generateAvailability('available')
        }))
      ];

      setResources(allResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await fetch(`/api/planning?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch allocations');
      }
      const data = await response.json();
      setAllocations(data.planningItems || []);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const generateAvailability = (status: string) => {
    const availability: any = {};
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateKey = current.toISOString().split('T')[0];
      availability[dateKey] = [
        {
          start: '09:00',
          end: '18:00',
          status: status === 'unavailable' ? 'unavailable' : 'available'
        }
      ];
      current.setDate(current.getDate() + 1);
    }
    
    return availability;
  };

  const detectConflicts = () => {
    const newConflicts: any[] = [];
    
    resources.forEach(resource => {
      const resourceAllocations = allocations.filter(alloc => 
        alloc.resourceId === resource.id
      );
      
      resourceAllocations.forEach((allocation, index) => {
        const allocationStart = new Date(allocation.startTime);
        const allocationEnd = new Date(allocation.endTime);
        
        resourceAllocations.forEach((otherAllocation, otherIndex) => {
          if (index !== otherIndex) {
            const otherStart = new Date(otherAllocation.startTime);
            const otherEnd = new Date(otherAllocation.endTime);
            
            if (
              (allocationStart < otherEnd && allocationEnd > otherStart) ||
              (otherStart < allocationEnd && otherEnd > allocationStart)
            ) {
              newConflicts.push({
                resource,
                allocation1: allocation,
                allocation2: otherAllocation,
                type: 'overlap'
              });
            }
          }
        });
      });
    });
    
    setConflicts(newConflicts);
  };

  useEffect(() => {
    detectConflicts();
  }, [resources, allocations]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <Users className="h-4 w-4" />;
      case 'equipment':
        return <Clock className="h-4 w-4" />;
      case 'venue':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'person':
        return 'bg-blue-100 text-blue-800';
      case 'equipment':
        return 'bg-green-100 text-green-800';
      case 'venue':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConflictColor = (conflict: any) => {
    return 'bg-red-100 text-red-800 border-red-300';
  };

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
        <h2 className="text-2xl font-bold text-gray-900">{t('resource_allocation.title')}</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white text-gray-900 border-gray-300">
            {resources.length} {t('resource_allocation.resources')}
          </Badge>
          {conflicts.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {conflicts.length} {t('resource_allocation.conflicts')}
            </Badge>
          )}
        </div>
      </div>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              {t('resource_allocation.conflicts_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className="p-3 bg-white border border-red-200 rounded-lg cursor-pointer hover:bg-red-50"
                  onClick={() => onConflictClick?.(conflict)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getResourceIcon(conflict.resource.type)}
                    <span className="font-medium">{conflict.resource.name}</span>
                    <Badge className={getConflictColor(conflict)}>
                      {t('resource_allocation.conflict')}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>{conflict.allocation1.title}</div>
                    <div>{conflict.allocation2.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      <div className="grid gap-4">
        {resources.length === 0 ? (
          <Card className="bg-white text-gray-900">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('resource_allocation.no_resources')}
              </h3>
              <p className="text-gray-600">
                {t('resource_allocation.no_resources_description')}
              </p>
            </CardContent>
          </Card>
        ) : (
          resources.map((resource) => {
            const resourceAllocations = allocations.filter(alloc => 
              alloc.resourceId === resource.id
            );
            const hasConflicts = conflicts.some(conflict => 
              conflict.resource.id === resource.id
            );

            return (
              <Card 
                key={resource.id} 
                className={`bg-white text-gray-900 cursor-pointer hover:shadow-md transition-shadow ${
                  hasConflicts ? 'border-red-300' : 'border-gray-200'
                }`}
                onClick={() => onResourceClick?.(resource)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getResourceIcon(resource.type)}
                        <h3 className="text-lg font-semibold">{resource.name}</h3>
                        <Badge className={getResourceColor(resource.type)}>
                          {resource.type}
                        </Badge>
                        {hasConflicts && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {t('resource_allocation.conflict')}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{resourceAllocations.length} {t('resource_allocation.allocations')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon('available')}
                          <span>{t('resource_allocation.available')}</span>
                        </div>
                      </div>
                      
                      {resourceAllocations.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            {t('resource_allocation.current_allocations')}:
                          </div>
                          <div className="space-y-1">
                            {resourceAllocations.slice(0, 3).map((allocation) => (
                              <div key={allocation.id} className="text-sm text-gray-600">
                                <div className="font-medium">{allocation.title}</div>
                                <div className="text-xs">
                                  {new Date(allocation.startTime).toLocaleString()} - {new Date(allocation.endTime).toLocaleString()}
                                </div>
                              </div>
                            ))}
                            {resourceAllocations.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{resourceAllocations.length - 3} {t('resource_allocation.more_allocations')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="text-sm">{t('resource_allocation.legend.personnel')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-500" />
          <span className="text-sm">{t('resource_allocation.legend.equipment')}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-purple-500" />
          <span className="text-sm">{t('resource_allocation.legend.venues')}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm">{t('resource_allocation.legend.available')}</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm">{t('resource_allocation.legend.conflict')}</span>
        </div>
      </div>
    </div>
  );
}
