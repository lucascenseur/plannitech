"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/lib/i18n';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PlanningItem {
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

export function PlanningList() {
  const { t } = useLocale();
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPlanningItems();
  }, []);

  const fetchPlanningItems = async () => {
    try {
      const response = await fetch('/api/planning');
      if (!response.ok) {
        throw new Error('Failed to fetch planning items');
      }
      const data = await response.json();
      setPlanningItems(data.planningItems || []);
    } catch (error) {
      console.error('Error fetching planning items:', error);
      toast({
        title: t('planning_list.error_title'),
        description: t('planning_list.error_description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('planning_list.confirm_delete'))) return;

    try {
      const response = await fetch(`/api/planning/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete planning item');
      }

      toast({
        title: t('planning_list.delete_success_title'),
        description: t('planning_list.delete_success_description'),
      });

      fetchPlanningItems();
    } catch (error) {
      console.error('Error deleting planning item:', error);
      toast({
        title: t('planning_list.delete_error_title'),
        description: t('planning_list.delete_error_description'),
        variant: 'destructive',
      });
    }
  };

  const filteredItems = planningItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.show?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.venue?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'setup':
      case 'breakdown':
        return <Clock className="h-4 w-4" />;
      case 'performance':
        return <Calendar className="h-4 w-4" />;
      case 'transport':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
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
        <h2 className="text-2xl font-bold text-gray-900">{t('planning_list.title')}</h2>
        <Button
          onClick={() => window.location.href = '/dashboard/planning/new'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('planning_list.add_item')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white text-gray-900">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('planning_list.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('planning_list.filter_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('planning_list.all_types')}</SelectItem>
                <SelectItem value="setup">{t('planning_list.type_setup')}</SelectItem>
                <SelectItem value="rehearsal">{t('planning_list.type_rehearsal')}</SelectItem>
                <SelectItem value="performance">{t('planning_list.type_performance')}</SelectItem>
                <SelectItem value="breakdown">{t('planning_list.type_breakdown')}</SelectItem>
                <SelectItem value="transport">{t('planning_list.type_transport')}</SelectItem>
                <SelectItem value="catering">{t('planning_list.type_catering')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder={t('planning_list.filter_status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('planning_list.all_statuses')}</SelectItem>
                <SelectItem value="pending">{t('planning_list.status_pending')}</SelectItem>
                <SelectItem value="in_progress">{t('planning_list.status_in_progress')}</SelectItem>
                <SelectItem value="completed">{t('planning_list.status_completed')}</SelectItem>
                <SelectItem value="cancelled">{t('planning_list.status_cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Planning Items */}
      <div className="grid gap-4">
        {filteredItems.length === 0 ? (
          <Card className="bg-white text-gray-900">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('planning_list.no_items')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('planning_list.no_items_description')}
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard/planning/new'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('planning_list.create_first_item')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="bg-white text-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(item.type)}
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
                        </span>
                      </div>
                      
                      {item.show && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{item.show.title}</span>
                        </div>
                      )}
                      
                      {item.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.venue.name}</span>
                        </div>
                      )}
                      
                      {item.assignedTo && item.assignedTo.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{item.assignedTo.length} {t('planning_list.people_assigned')}</span>
                        </div>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 mt-2">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/dashboard/planning/${item.id}/edit`}
                      className="bg-white text-gray-900 border-gray-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
