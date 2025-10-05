"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  BellOff, 
  Calendar, 
  Users, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface ProjectNotificationsProps {
  projectId: string;
  projectName: string;
}

export function ProjectNotifications({ projectId, projectName }: ProjectNotificationsProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    projectUpdates: true,
    planningChanges: true,
    budgetAlerts: true,
    teamChanges: true,
    deadlineReminders: true,
    statusChanges: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [projectId]);

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    try {
      setLoading(true);
      const newNotifications = { ...notifications, [key]: value };
      setNotifications(newNotifications);

      const response = await fetch(`/api/projects/${projectId}/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        // Revert on error
        setNotifications(notifications);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      // Revert on error
      setNotifications(notifications);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications),
      });

      if (response.ok) {
        // Success feedback
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: "email",
      label: "Notifications par email",
      description: "Recevez des notifications par email",
      icon: Bell,
    },
    {
      key: "push",
      label: "Notifications push",
      description: "Recevez des notifications push dans l'application",
      icon: Bell,
    },
    {
      key: "projectUpdates",
      label: "Mises à jour du projet",
      description: "Alertes pour les modifications du projet",
      icon: Info,
    },
    {
      key: "planningChanges",
      label: "Changements de planning",
      description: "Notifications pour les modifications du planning",
      icon: Calendar,
    },
    {
      key: "budgetAlerts",
      label: "Alertes budgétaires",
      description: "Alertes pour les dépassements de budget",
      icon: DollarSign,
    },
    {
      key: "teamChanges",
      label: "Changements d'équipe",
      description: "Notifications pour les modifications de l'équipe",
      icon: Users,
    },
    {
      key: "deadlineReminders",
      label: "Rappels d'échéances",
      description: "Rappels pour les échéances importantes",
      icon: AlertTriangle,
    },
    {
      key: "statusChanges",
      label: "Changements de statut",
      description: "Notifications pour les changements de statut",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications du projet</CardTitle>
          <CardDescription>
            Configurez les notifications pour le projet "{projectName}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <type.icon className="h-5 w-5 text-gray-400" />
                <div>
                  <Label className="text-sm font-medium">{type.label}</Label>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
              <Switch
                checked={notifications[type.key as keyof typeof notifications]}
                onCheckedChange={(checked) => handleNotificationChange(type.key, checked)}
                disabled={loading}
              />
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {Object.values(notifications).filter(Boolean).length} notification{Object.values(notifications).filter(Boolean).length > 1 ? "s" : ""} activée{Object.values(notifications).filter(Boolean).length > 1 ? "s" : ""}
            </div>
            <Button onClick={handleSaveAll} disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résumé des notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des notifications</CardTitle>
          <CardDescription>
            Vue d'ensemble de vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                {notifications.email ? "Email activé" : "Email désactivé"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                {notifications.push ? "Push activé" : "Push désactivé"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm">
                {notifications.planningChanges ? "Planning activé" : "Planning désactivé"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="text-sm">
                {notifications.budgetAlerts ? "Budget activé" : "Budget désactivé"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

