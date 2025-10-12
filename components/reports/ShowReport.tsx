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
  DollarSign,
  Download,
  Printer,
  Share2,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

interface ShowReportData {
  show: {
    id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    venue: string;
    status: string;
    budget: number;
    team: number;
    artists: string[];
    description?: string;
  };
  planning: {
    totalItems: number;
    completedItems: number;
    pendingItems: number;
    items: Array<{
      title: string;
      type: string;
      startTime: string;
      endTime: string;
      status: string;
      assignedTo: string[];
    }>;
  };
  budget: {
    planned: number;
    actual: number;
    variance: number;
    categories: Array<{
      name: string;
      planned: number;
      actual: number;
      variance: number;
    }>;
  };
  team: {
    total: number;
    assigned: number;
    available: number;
    members: Array<{
      name: string;
      role: string;
      status: string;
    }>;
  };
}

interface ShowReportProps {
  showId: string;
  onClose?: () => void;
}

export function ShowReport({ showId, onClose }: ShowReportProps) {
  const { t } = useLocale();
  const [reportData, setReportData] = useState<ShowReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [showId]);

  const fetchReportData = async () => {
    try {
      // Récupérer les données du rapport depuis l'API
      const response = await fetch(`/api/reports/shows/${showId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Implémentation de l'export PDF
    console.log('Exporting PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Rapport - ${reportData?.show.title}`,
        text: `Rapport détaillé du spectacle ${reportData?.show.title}`,
        url: window.location.href
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (variance < 0) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('show_report.not_found')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('show_report.title')} - {reportData.show.title}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="bg-white text-gray-900 border-gray-300"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('show_report.export_pdf')}
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="bg-white text-gray-900 border-gray-300"
          >
            <Printer className="h-4 w-4 mr-2" />
            {t('show_report.print')}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="bg-white text-gray-900 border-gray-300"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {t('show_report.share')}
          </Button>
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-gray-900 border-gray-300"
            >
              {t('common.close')}
            </Button>
          )}
        </div>
      </div>

      {/* Show Information */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('show_report.show_info')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">{t('show_report.title')}</label>
              <p className="text-lg font-semibold">{reportData.show.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('show_report.type')}</label>
              <p className="text-lg">{reportData.show.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('show_report.date')}</label>
              <p className="text-lg">{new Date(reportData.show.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('show_report.time')}</label>
              <p className="text-lg">{reportData.show.time}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('show_report.venue')}</label>
              <p className="text-lg">{reportData.show.venue}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('show_report.status')}</label>
              <Badge className={getStatusColor(reportData.show.status)}>
                {reportData.show.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planning Summary */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('show_report.planning_summary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{reportData.planning.totalItems}</div>
              <div className="text-sm text-gray-600">{t('show_report.total_items')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{reportData.planning.completedItems}</div>
              <div className="text-sm text-gray-600">{t('show_report.completed_items')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{reportData.planning.pendingItems}</div>
              <div className="text-sm text-gray-600">{t('show_report.pending_items')}</div>
            </div>
          </div>

          <div className="space-y-3">
            {reportData.planning.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(item.startTime).toLocaleString('fr-FR')} - {new Date(item.endTime).toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.assignedTo.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Analysis */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('show_report.budget_analysis')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.budget.planned.toLocaleString()} €
              </div>
              <div className="text-sm text-gray-600">{t('show_report.planned_budget')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reportData.budget.actual.toLocaleString()} €
              </div>
              <div className="text-sm text-gray-600">{t('show_report.actual_budget')}</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                reportData.budget.variance < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {getVarianceIcon(reportData.budget.variance)}
                {Math.abs(reportData.budget.variance).toLocaleString()} €
              </div>
              <div className="text-sm text-gray-600">{t('show_report.variance')}</div>
            </div>
          </div>

          <div className="space-y-3">
            {reportData.budget.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-gray-600">
                    {category.planned.toLocaleString()} € → {category.actual.toLocaleString()} €
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  category.variance < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getVarianceIcon(category.variance)}
                  <span className="font-medium">
                    {category.variance < 0 ? '' : '+'}{category.variance.toLocaleString()} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Summary */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('show_report.team_summary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{reportData.team.total}</div>
              <div className="text-sm text-gray-600">{t('show_report.total_team')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{reportData.team.assigned}</div>
              <div className="text-sm text-gray-600">{t('show_report.assigned_team')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{reportData.team.available}</div>
              <div className="text-sm text-gray-600">{t('show_report.available_team')}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.team.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.role}</div>
                </div>
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
