"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EventNotification, Event } from "@/types/planning";
import { 
  Bell, 
  BellOff, 
  Clock, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Send
} from "lucide-react";

interface NotificationManagerProps {
  eventId: string;
  event: Event;
  onNotificationSent: (notification: EventNotification) => void;
}

export function NotificationManager({ eventId, event, onNotificationSent }: NotificationManagerProps) {
  const [notifications, setNotifications] = useState<EventNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: "REMINDER" as const,
    message: "",
    scheduledFor: "",
    recipients: [] as string[],
  });

  useEffect(() => {
    loadNotifications();
  }, [eventId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/planning/events/${eventId}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      setSending(newNotification.type);
      const response = await fetch(`/api/planning/events/${eventId}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification),
      });

      if (response.ok) {
        const notification = await response.json();
        setNotifications([...notifications, notification]);
        setNewNotification({
          type: "REMINDER",
          message: "",
          scheduledFor: "",
          recipients: [],
        });
        setShowCreateForm(false);
        onNotificationSent(notification);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    } finally {
      setSending(null);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/planning/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleResendNotification = async (notificationId: string) => {
    try {
      setSending(notificationId);
      const response = await fetch(`/api/planning/notifications/${notificationId}/resend`, {
        method: "POST",
      });

      if (response.ok) {
        await loadNotifications();
      }
    } catch (error) {
      console.error("Erreur lors du renvoi:", error);
    } finally {
      setSending(null);
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels = {
      REMINDER: "Rappel",
      CHANGE: "Changement",
      CANCELLATION: "Annulation",
      CONFLICT: "Conflit",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "REMINDER":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "CHANGE":
        return <Edit className="h-4 w-4 text-orange-600" />;
      case "CANCELLATION":
        return <BellOff className="h-4 w-4 text-red-600" />;
      case "CONFLICT":
        return <Bell className="h-4 w-4 text-yellow-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRecipientIcon = (recipient: string) => {
    if (recipient.includes("@")) {
      return <Mail className="h-4 w-4 text-blue-600" />;
    }
    return <Smartphone className="h-4 w-4 text-green-600" />;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (sent: boolean) => {
    return sent ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Envoyé
      </Badge>
    ) : (
      <Badge variant="secondary">
        En attente
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des notifications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notifications et rappels</CardTitle>
              <CardDescription>
                Gérez les notifications pour l'événement "{event.title}"
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle notification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-type">Type de notification</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) => setNewNotification({ ...newNotification, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REMINDER">Rappel</SelectItem>
                      <SelectItem value="CHANGE">Changement</SelectItem>
                      <SelectItem value="CANCELLATION">Annulation</SelectItem>
                      <SelectItem value="CONFLICT">Conflit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled-for">Programmé pour</Label>
                  <Input
                    id="scheduled-for"
                    type="datetime-local"
                    value={newNotification.scheduledFor}
                    onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  placeholder="Message de la notification"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleSendNotification} 
                  disabled={!newNotification.message || !newNotification.scheduledFor}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications programmées</CardTitle>
          <CardDescription>
            {notifications.length} notification{notifications.length > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getNotificationTypeIcon(notification.type)}
                      <h4 className="font-medium">{getNotificationTypeLabel(notification.type)}</h4>
                      {getStatusBadge(notification.sent)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.sent && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendNotification(notification.id)}
                          disabled={sending === notification.id}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Renvoyer
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(notification.scheduledFor)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{notification.recipients.length} destinataire{notification.recipients.length > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  
                  {notification.recipients.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Destinataires:</h5>
                      <div className="flex flex-wrap gap-2">
                        {notification.recipients.map((recipient, index) => (
                          <div key={index} className="flex items-center space-x-1 text-sm bg-gray-100 px-2 py-1 rounded">
                            {getRecipientIcon(recipient)}
                            <span>{recipient}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600">
                Aucune notification n'a été programmée pour cet événement.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé des notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé des notifications</CardTitle>
            <CardDescription>
              Vue d'ensemble des notifications programmées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(
                notifications.reduce((acc, notification) => {
                  acc[notification.type] = (acc[notification.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getNotificationTypeIcon(type)}
                    <span className="font-medium">{getNotificationTypeLabel(type)}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

