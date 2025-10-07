import { Metadata } from "next";
import Link from "next/link";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  CreditCard, 
  Users, 
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Calendar,
  FileText,
  Zap
} from "lucide-react";

interface SettingsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Paramètres - Plannitech",
    description: "Paramètres de l'application",
    alternates: {
      canonical: `/${locale}/dashboard/settings`,
      languages: {
        'fr': '/fr/dashboard/settings',
        'en': '/en/dashboard/settings',
        'es': '/es/dashboard/settings',
      },
    },
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;

  const settingsCategories = [
    {
      id: 'profile',
      title: locale === 'en' ? 'Profile' : locale === 'es' ? 'Perfil' : 'Profil',
      description: locale === 'en' ? 'Manage your personal information' : locale === 'es' ? 'Gestiona tu información personal' : 'Gérez vos informations personnelles',
      icon: User,
      href: `/${locale}/dashboard/settings/profile`,
      color: 'bg-blue-500'
    },
    {
      id: 'notifications',
      title: locale === 'en' ? 'Notifications' : locale === 'es' ? 'Notificaciones' : 'Notifications',
      description: locale === 'en' ? 'Configure your notification preferences' : locale === 'es' ? 'Configura tus preferencias de notificación' : 'Configurez vos préférences de notification',
      icon: Bell,
      href: `/${locale}/dashboard/settings/notifications`,
      color: 'bg-green-500'
    },
    {
      id: 'security',
      title: locale === 'en' ? 'Security' : locale === 'es' ? 'Seguridad' : 'Sécurité',
      description: locale === 'en' ? 'Password and security settings' : locale === 'es' ? 'Configuración de contraseña y seguridad' : 'Paramètres de mot de passe et sécurité',
      icon: Shield,
      href: `/${locale}/dashboard/settings/security`,
      color: 'bg-red-500'
    },
    {
      id: 'preferences',
      title: locale === 'en' ? 'Preferences' : locale === 'es' ? 'Preferencias' : 'Préférences',
      description: locale === 'en' ? 'Language, theme and display settings' : locale === 'es' ? 'Configuración de idioma, tema y pantalla' : 'Paramètres de langue, thème et affichage',
      icon: Palette,
      href: `/${locale}/dashboard/settings/preferences`,
      color: 'bg-purple-500'
    },
    {
      id: 'billing',
      title: locale === 'en' ? 'Billing' : locale === 'es' ? 'Facturación' : 'Facturation',
      description: locale === 'en' ? 'Manage your subscription and payments' : locale === 'es' ? 'Gestiona tu suscripción y pagos' : 'Gérez votre abonnement et paiements',
      icon: CreditCard,
      href: `/${locale}/dashboard/settings/billing`,
      color: 'bg-yellow-500'
    },
    {
      id: 'team',
      title: locale === 'en' ? 'Team' : locale === 'es' ? 'Equipo' : 'Équipe',
      description: locale === 'en' ? 'Manage team members and permissions' : locale === 'es' ? 'Gestiona miembros del equipo y permisos' : 'Gérez les membres de l\'équipe et permissions',
      icon: Users,
      href: `/${locale}/dashboard/settings/collaborators`,
      color: 'bg-indigo-500'
    },
    {
      id: 'integrations',
      title: locale === 'en' ? 'Integrations' : locale === 'es' ? 'Integraciones' : 'Intégrations',
      description: locale === 'en' ? 'Connect with external services' : locale === 'es' ? 'Conecta con servicios externos' : 'Connectez-vous avec des services externes',
      icon: Zap,
      href: `/${locale}/dashboard/settings/integrations`,
      color: 'bg-orange-500'
    },
    {
      id: 'data',
      title: locale === 'en' ? 'Data & Privacy' : locale === 'es' ? 'Datos y Privacidad' : 'Données et Confidentialité',
      description: locale === 'en' ? 'Export, import and privacy settings' : locale === 'es' ? 'Configuración de exportación, importación y privacidad' : 'Paramètres d\'exportation, importation et confidentialité',
      icon: Database,
      href: `/${locale}/dashboard/settings/data`,
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Settings' : locale === 'es' ? 'Configuración' : 'Paramètres'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your application settings and preferences' 
            : locale === 'es' 
            ? 'Gestiona la configuración y preferencias de tu aplicación'
            : 'Gérez les paramètres et préférences de votre application'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              href={category.href}
              className="group bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`${category.color} p-3 rounded-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Section des paramètres rapides */}
      <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {locale === 'en' ? 'Quick Settings' : locale === 'es' ? 'Configuración Rápida' : 'Paramètres Rapides'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Language' : locale === 'es' ? 'Idioma' : 'Langue'}
              </p>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'French' : locale === 'es' ? 'Francés' : 'Français'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Bell className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Notifications' : locale === 'es' ? 'Notificaciones' : 'Notifications'}
              </p>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'Enabled' : locale === 'es' ? 'Habilitado' : 'Activées'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {locale === 'en' ? '2FA' : locale === 'es' ? '2FA' : '2FA'}
              </p>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'Disabled' : locale === 'es' ? 'Deshabilitado' : 'Désactivé'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Timezone' : locale === 'es' ? 'Zona Horaria' : 'Fuseau Horaire'}
              </p>
              <p className="text-xs text-gray-500">Europe/Paris</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section d'aide */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <FileText className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Need Help?' : locale === 'es' ? '¿Necesitas Ayuda?' : 'Besoin d\'Aide ?'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Check our documentation or contact support for assistance with your settings.'
                : locale === 'es'
                ? 'Consulta nuestra documentación o contacta soporte para ayuda con tu configuración.'
                : 'Consultez notre documentation ou contactez le support pour obtenir de l\'aide avec vos paramètres.'
              }
            </p>
            <div className="mt-3 space-x-4">
              <Link 
                href={`/${locale}/help`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {locale === 'en' ? 'Documentation' : locale === 'es' ? 'Documentación' : 'Documentation'}
              </Link>
              <Link 
                href={`/${locale}/contact`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {locale === 'en' ? 'Contact Support' : locale === 'es' ? 'Contactar Soporte' : 'Contacter le Support'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
