import { Metadata } from "next";
import { Bell, Mail, Smartphone, Calendar, Users, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";

interface NotificationSettingsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: NotificationSettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Notifications - Paramètres - Plannitech",
    description: "Configurez vos préférences de notification",
    alternates: {
      canonical: `/${locale}/dashboard/settings/notifications`,
      languages: {
        'fr': '/fr/dashboard/settings/notifications',
        'en': '/en/dashboard/settings/notifications',
        'es': '/es/dashboard/settings/notifications',
      },
    },
  };
}

export default async function NotificationSettingsPage({ params }: NotificationSettingsPageProps) {
  const { locale } = await params;

  const notificationCategories = [
    {
      id: 'email',
      title: locale === 'en' ? 'Email Notifications' : locale === 'es' ? 'Notificaciones por Email' : 'Notifications Email',
      description: locale === 'en' ? 'Receive notifications via email' : locale === 'es' ? 'Recibe notificaciones por correo electrónico' : 'Recevez des notifications par email',
      icon: Mail,
      color: 'bg-blue-500',
      settings: [
        {
          id: 'project-updates',
          label: locale === 'en' ? 'Project Updates' : locale === 'es' ? 'Actualizaciones de Proyecto' : 'Mises à jour de Projet',
          description: locale === 'en' ? 'Get notified when projects are updated' : locale === 'es' ? 'Recibe notificaciones cuando los proyectos se actualicen' : 'Soyez notifié des mises à jour de projets',
          enabled: true
        },
        {
          id: 'team-mentions',
          label: locale === 'en' ? 'Team Mentions' : locale === 'es' ? 'Menciones del Equipo' : 'Mentions d\'Équipe',
          description: locale === 'en' ? 'Get notified when you are mentioned' : locale === 'es' ? 'Recibe notificaciones cuando te mencionen' : 'Soyez notifié des mentions',
          enabled: true
        },
        {
          id: 'deadline-reminders',
          label: locale === 'en' ? 'Deadline Reminders' : locale === 'es' ? 'Recordatorios de Fecha Límite' : 'Rappels d\'Échéance',
          description: locale === 'en' ? 'Get reminded about upcoming deadlines' : locale === 'es' ? 'Recibe recordatorios sobre fechas límite próximas' : 'Recevez des rappels d\'échéances',
          enabled: true
        },
        {
          id: 'billing-notifications',
          label: locale === 'en' ? 'Billing Notifications' : locale === 'es' ? 'Notificaciones de Facturación' : 'Notifications de Facturation',
          description: locale === 'en' ? 'Get notified about billing and payments' : locale === 'es' ? 'Recibe notificaciones sobre facturación y pagos' : 'Soyez notifié des factures et paiements',
          enabled: false
        }
      ]
    },
    {
      id: 'push',
      title: locale === 'en' ? 'Push Notifications' : locale === 'es' ? 'Notificaciones Push' : 'Notifications Push',
      description: locale === 'en' ? 'Receive push notifications in your browser' : locale === 'es' ? 'Recibe notificaciones push en tu navegador' : 'Recevez des notifications push dans votre navigateur',
      icon: Bell,
      color: 'bg-green-500',
      settings: [
        {
          id: 'urgent-alerts',
          label: locale === 'en' ? 'Urgent Alerts' : locale === 'es' ? 'Alertas Urgentes' : 'Alertes Urgentes',
          description: locale === 'en' ? 'Get immediate notifications for urgent matters' : locale === 'es' ? 'Recibe notificaciones inmediatas para asuntos urgentes' : 'Recevez des notifications immédiates pour les urgences',
          enabled: true
        },
        {
          id: 'schedule-changes',
          label: locale === 'en' ? 'Schedule Changes' : locale === 'es' ? 'Cambios de Horario' : 'Changements d\'Horaire',
          description: locale === 'en' ? 'Get notified about schedule modifications' : locale === 'es' ? 'Recibe notificaciones sobre modificaciones de horario' : 'Soyez notifié des modifications d\'horaire',
          enabled: true
        },
        {
          id: 'equipment-alerts',
          label: locale === 'en' ? 'Equipment Alerts' : locale === 'es' ? 'Alertas de Equipamiento' : 'Alertes d\'Équipement',
          description: locale === 'en' ? 'Get notified about equipment issues' : locale === 'es' ? 'Recibe notificaciones sobre problemas de equipamiento' : 'Soyez notifié des problèmes d\'équipement',
          enabled: false
        }
      ]
    },
    {
      id: 'sms',
      title: locale === 'en' ? 'SMS Notifications' : locale === 'es' ? 'Notificaciones SMS' : 'Notifications SMS',
      description: locale === 'en' ? 'Receive critical notifications via SMS' : locale === 'es' ? 'Recibe notificaciones críticas por SMS' : 'Recevez des notifications critiques par SMS',
      icon: Smartphone,
      color: 'bg-purple-500',
      settings: [
        {
          id: 'emergency-contacts',
          label: locale === 'en' ? 'Emergency Contacts' : locale === 'es' ? 'Contactos de Emergencia' : 'Contacts d\'Urgence',
          description: locale === 'en' ? 'Get SMS for emergency situations' : locale === 'es' ? 'Recibe SMS para situaciones de emergencia' : 'Recevez des SMS pour les situations d\'urgence',
          enabled: false
        },
        {
          id: 'venue-changes',
          label: locale === 'en' ? 'Venue Changes' : locale === 'es' ? 'Cambios de Lugar' : 'Changements de Lieu',
          description: locale === 'en' ? 'Get notified about venue modifications' : locale === 'es' ? 'Recibe notificaciones sobre modificaciones de lugar' : 'Soyez notifié des modifications de lieu',
          enabled: false
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Notification Settings' : locale === 'es' ? 'Configuración de Notificaciones' : 'Paramètres de Notifications'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Configure how and when you receive notifications' 
            : locale === 'es' 
            ? 'Configura cómo y cuándo recibes notificaciones'
            : 'Configurez comment et quand vous recevez des notifications'
          }
        </p>
      </div>

      <div className="space-y-6">
        {notificationCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.id} className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`${category.color} p-2 rounded-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{category.title}</h2>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {category.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">{setting.label}</h3>
                        {setting.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={setting.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Paramètres de fréquence */}
      <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {locale === 'en' ? 'Notification Frequency' : locale === 'es' ? 'Frecuencia de Notificaciones' : 'Fréquence des Notifications'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              {locale === 'en' ? 'Email Digest' : locale === 'es' ? 'Resumen por Email' : 'Résumé par Email'}
            </h3>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="immediate">
                {locale === 'en' ? 'Immediate' : locale === 'es' ? 'Inmediato' : 'Immédiat'}
              </option>
              <option value="daily">
                {locale === 'en' ? 'Daily' : locale === 'es' ? 'Diario' : 'Quotidien'}
              </option>
              <option value="weekly">
                {locale === 'en' ? 'Weekly' : locale === 'es' ? 'Semanal' : 'Hebdomadaire'}
              </option>
            </select>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              {locale === 'en' ? 'Quiet Hours' : locale === 'es' ? 'Horas Silenciosas' : 'Heures Silencieuses'}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="22:00"
                />
                <span className="text-sm text-gray-500">-</span>
                <input
                  type="time"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="08:00"
                />
              </div>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'No notifications during these hours' : locale === 'es' ? 'Sin notificaciones durante estas horas' : 'Aucune notification pendant ces heures'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              {locale === 'en' ? 'Weekend Mode' : locale === 'es' ? 'Modo Fin de Semana' : 'Mode Week-end'}
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <p className="text-xs text-gray-500">
              {locale === 'en' ? 'Reduce notifications on weekends' : locale === 'es' ? 'Reduce notificaciones los fines de semana' : 'Réduit les notifications le week-end'}
            </p>
          </div>
        </div>
      </div>

      {/* Paramètres spécifiques au spectacle vivant */}
      <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {locale === 'en' ? 'Live Performance Notifications' : locale === 'es' ? 'Notificaciones de Espectáculo en Vivo' : 'Notifications Spectacle Vivant'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {locale === 'en' ? 'Technical Rehearsals' : locale === 'es' ? 'Ensayos Técnicos' : 'Répétitions Techniques'}
                </h3>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Get notified about technical rehearsals' : locale === 'es' ? 'Recibe notificaciones sobre ensayos técnicos' : 'Soyez notifié des répétitions techniques'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {locale === 'en' ? 'Equipment Maintenance' : locale === 'es' ? 'Mantenimiento de Equipamiento' : 'Maintenance d\'Équipement'}
                </h3>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Get reminded about equipment maintenance' : locale === 'es' ? 'Recibe recordatorios sobre mantenimiento' : 'Recevez des rappels de maintenance'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {locale === 'en' ? 'Safety Alerts' : locale === 'es' ? 'Alertas de Seguridad' : 'Alertes de Sécurité'}
                </h3>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Get notified about safety issues' : locale === 'es' ? 'Recibe notificaciones sobre problemas de seguridad' : 'Soyez notifié des problèmes de sécurité'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {locale === 'en' ? 'Weather Alerts' : locale === 'es' ? 'Alertas Meteorológicas' : 'Alertes Météo'}
                </h3>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Get notified about weather conditions' : locale === 'es' ? 'Recibe notificaciones sobre condiciones meteorológicas' : 'Soyez notifié des conditions météo'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          <CheckCircle className="h-4 w-4 mr-2" />
          {locale === 'en' ? 'Save Notification Settings' : locale === 'es' ? 'Guardar Configuración de Notificaciones' : 'Enregistrer les Paramètres de Notifications'}
        </button>
      </div>
    </div>
  );
}
