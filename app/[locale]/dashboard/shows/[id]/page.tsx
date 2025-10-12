"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsNavigation } from '@/components/ui/tabs-navigation';
import { useLocale } from '@/lib/i18n';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Clock,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ShowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const { locale, id } = params;
  
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`/api/shows/${id}`);
        if (!response.ok) {
          throw new Error('Show not found');
        }
        const data = await response.json();
        setShow(data.show);
      } catch (error) {
        console.error('Error fetching show:', error);
        toast({
          title: t('show_detail.error_title'),
          description: t('show_detail.error_description'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShow();
    }
  }, [id, t]);

  const handleDelete = async () => {
    if (!confirm(t('show_detail.confirm_delete'))) return;

    try {
      const response = await fetch(`/api/shows/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete show');
      }

      toast({
        title: t('show_detail.delete_success_title'),
        description: t('show_detail.delete_success_description'),
      });

      router.push(`/${locale}/dashboard/shows`);
    } catch (error) {
      console.error('Error deleting show:', error);
      toast({
        title: t('show_detail.delete_error_title'),
        description: t('show_detail.delete_error_description'),
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">{t('show_detail.not_found')}</div>
        <Button onClick={() => router.push(`/${locale}/dashboard/shows`)}>
          {t('show_detail.back_to_shows')}
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      label: t('show_detail.tabs.info'),
      value: 'info',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('show_detail.basic_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.title')}</label>
                  <p className="text-lg">{show.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.type')}</label>
                  <p className="text-lg">{show.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.date')}</label>
                  <p className="text-lg">{new Date(show.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.time')}</label>
                  <p className="text-lg">{show.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.venue')}</label>
                  <p className="text-lg">{show.venue}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.status')}</label>
                  <Badge variant={show.status === 'confirmed' ? 'default' : 'secondary'}>
                    {show.status}
                  </Badge>
                </div>
              </div>
              {show.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.description')}</label>
                  <p className="text-lg">{show.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      label: t('show_detail.tabs.planning'),
      value: 'planning',
      icon: Clock,
      content: (
        <div className="space-y-6">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle>{t('show_detail.planning_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t('show_detail.planning_description')}</p>
              {/* Future planning component */}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      label: t('show_detail.tabs.team'),
      value: 'team',
      icon: Users,
      content: (
        <div className="space-y-6">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle>{t('show_detail.team_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.team_size')}</label>
                  <p className="text-lg">{show.team} {t('show_detail.people')}</p>
                </div>
                {show.artists && show.artists.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('show_detail.artists')}</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {show.artists.map((artist: string, index: number) => (
                        <Badge key={index} variant="outline">{artist}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      label: t('show_detail.tabs.budget'),
      value: 'budget',
      icon: DollarSign,
      content: (
        <div className="space-y-6">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle>{t('show_detail.budget_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('show_detail.budget_amount')}</label>
                  <p className="text-2xl font-bold">{show.budget?.toLocaleString()} €</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      label: t('show_detail.tabs.technical'),
      value: 'technical',
      icon: User,
      content: (
        <div className="space-y-6">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle>{t('show_detail.technical_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t('show_detail.technical_description')}</p>
              {/* Future technical sheets component */}
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/dashboard/shows`)}
            className="bg-white text-gray-900 border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{show.title}</h1>
            <p className="text-gray-600">{show.type} • {new Date(show.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/${locale}/dashboard/shows/${id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="bg-white text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.delete')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <TabsNavigation tabs={tabs} initialTab="info" />
    </div>
  );
}
