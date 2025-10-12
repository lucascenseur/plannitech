"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/lib/i18n';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  MapPin,
  Package,
  AlertCircle
} from 'lucide-react';

interface StatsData {
  totalShows: number;
  upcomingShows: number;
  totalBudget: number;
  teamMembers: number;
  venues: number;
  equipment: number;
  pendingTasks: number;
  conflicts: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatsCards() {
  const { t } = useLocale();
  const [stats, setStats] = useState<StatsData>({
    totalShows: 0,
    upcomingShows: 0,
    totalBudget: 0,
    teamMembers: 0,
    venues: 0,
    equipment: 0,
    pendingTasks: 0,
    conflicts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [showsResponse, teamResponse, venuesResponse, equipmentResponse, planningResponse] = await Promise.all([
        fetch('/api/shows'),
        fetch('/api/team/members'),
        fetch('/api/venues'),
        fetch('/api/equipment'),
        fetch('/api/planning')
      ]);

      const [showsData, teamData, venuesData, equipmentData, planningData] = await Promise.all([
        showsResponse.json(),
        teamResponse.json(),
        venuesResponse.json(),
        equipmentResponse.json(),
        planningResponse.json()
      ]);

      const shows = showsData.shows || [];
      const upcomingShows = shows.filter((show: any) => {
        const showDate = new Date(show.date);
        const today = new Date();
        return showDate >= today && show.status !== 'cancelled';
      });

      const totalBudget = shows.reduce((sum: number, show: any) => sum + (show.budget || 0), 0);
      const pendingTasks = (planningData.planningItems || []).filter((item: any) => item.status === 'pending').length;

      setStats({
        totalShows: shows.length,
        upcomingShows: upcomingShows.length,
        totalBudget,
        teamMembers: (teamData.members || []).length,
        venues: (venuesData.venues || []).length,
        equipment: (equipmentData.equipment || []).length,
        pendingTasks,
        conflicts: 0 // TODO: Implement conflict detection
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      title: t('stats_cards.total_shows'),
      value: stats.totalShows,
      icon: Calendar,
      color: 'text-blue-600',
      description: t('stats_cards.total_shows_description')
    },
    {
      title: t('stats_cards.upcoming_shows'),
      value: stats.upcomingShows,
      icon: Clock,
      color: 'text-green-600',
      description: t('stats_cards.upcoming_shows_description')
    },
    {
      title: t('stats_cards.total_budget'),
      value: stats.totalBudget,
      icon: DollarSign,
      color: 'text-purple-600',
      description: t('stats_cards.total_budget_description'),
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: t('stats_cards.team_members'),
      value: stats.teamMembers,
      icon: Users,
      color: 'text-orange-600',
      description: t('stats_cards.team_members_description')
    },
    {
      title: t('stats_cards.venues'),
      value: stats.venues,
      icon: MapPin,
      color: 'text-indigo-600',
      description: t('stats_cards.venues_description')
    },
    {
      title: t('stats_cards.equipment'),
      value: stats.equipment,
      icon: Package,
      color: 'text-teal-600',
      description: t('stats_cards.equipment_description')
    },
    {
      title: t('stats_cards.pending_tasks'),
      value: stats.pendingTasks,
      icon: AlertCircle,
      color: 'text-red-600',
      description: t('stats_cards.pending_tasks_description')
    },
    {
      title: t('stats_cards.conflicts'),
      value: stats.conflicts,
      icon: AlertCircle,
      color: 'text-yellow-600',
      description: t('stats_cards.conflicts_description')
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i} className="bg-white text-gray-900">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="bg-white text-gray-900 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </p>
                  {card.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {card.description}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              
              {card.trend && (
                <div className="flex items-center mt-3">
                  <TrendingUp 
                    className={`h-4 w-4 mr-1 ${
                      card.trend.isPositive ? 'text-green-500' : 'text-red-500'
                    }`} 
                  />
                  <span className={`text-sm ${
                    card.trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.trend.isPositive ? '+' : ''}{card.trend.value}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    {t('stats_cards.vs_last_month')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
