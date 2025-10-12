"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/lib/i18n';
import { 
  Package, 
  MapPin, 
  DollarSign, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  status: string;
  supplier?: string;
  cost?: number;
  location?: string;
}

export function EquipmentList() {
  const { t } = useLocale();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment');
      if (!response.ok) {
        throw new Error('Failed to fetch equipment');
      }
      const data = await response.json();
      setEquipment(data.equipment || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast({
        title: t('equipment_list.error_title'),
        description: t('equipment_list.error_description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('equipment_list.confirm_delete'))) return;

    try {
      const response = await fetch(`/api/equipment/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }

      toast({
        title: t('equipment_list.delete_success_title'),
        description: t('equipment_list.delete_success_description'),
      });

      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        title: t('equipment_list.delete_error_title'),
        description: t('equipment_list.delete_error_description'),
        variant: 'destructive',
      });
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_order':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Audio':
        return '🎵';
      case 'Lumières':
        return '💡';
      case 'Scène':
        return '🎭';
      case 'Transport':
        return '🚚';
      default:
        return '📦';
    }
  };

  const isLowStock = (quantity: number) => quantity <= 2;

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
        <h2 className="text-2xl font-bold text-gray-900">{t('equipment_list.title')}</h2>
        <Button
          onClick={() => window.location.href = '/dashboard/resources/equipment/new'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('equipment_list.add_equipment')}
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
                  placeholder={t('equipment_list.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('equipment_list.filter_category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('equipment_list.all_categories')}</SelectItem>
                <SelectItem value="Audio">{t('equipment_list.category_audio')}</SelectItem>
                <SelectItem value="Lumières">{t('equipment_list.category_lights')}</SelectItem>
                <SelectItem value="Scène">{t('equipment_list.category_stage')}</SelectItem>
                <SelectItem value="Transport">{t('equipment_list.category_transport')}</SelectItem>
                <SelectItem value="Autre">{t('equipment_list.category_other')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder={t('equipment_list.filter_status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('equipment_list.all_statuses')}</SelectItem>
                <SelectItem value="available">{t('equipment_list.status_available')}</SelectItem>
                <SelectItem value="in_use">{t('equipment_list.status_in_use')}</SelectItem>
                <SelectItem value="maintenance">{t('equipment_list.status_maintenance')}</SelectItem>
                <SelectItem value="out_of_order">{t('equipment_list.status_out_of_order')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
      <div className="grid gap-4">
        {filteredEquipment.length === 0 ? (
          <Card className="bg-white text-gray-900">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('equipment_list.no_equipment')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('equipment_list.no_equipment_description')}
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard/resources/equipment/new'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('equipment_list.add_first_equipment')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredEquipment.map((item) => (
            <Card key={item.id} className="bg-white text-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      {isLowStock(item.quantity) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {t('equipment_list.low_stock')}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{item.quantity} {t('equipment_list.units')}</span>
                      </div>
                      
                      {item.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      
                      {item.cost && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{item.cost.toLocaleString()} €</span>
                        </div>
                      )}
                      
                      {item.supplier && (
                        <div className="flex items-center gap-2">
                          <span>{t('equipment_list.supplier')}: {item.supplier}</span>
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
                      onClick={() => window.location.href = `/dashboard/resources/equipment/${item.id}/edit`}
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
