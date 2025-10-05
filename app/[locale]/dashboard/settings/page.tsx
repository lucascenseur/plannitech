import { Metadata } from "next";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Settings' : locale === 'es' ? 'Configuración' : 'Paramètres'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your application settings' 
            : locale === 'es' 
            ? 'Gestiona la configuración de tu aplicación'
            : 'Gérez les paramètres de votre application'
          }
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">
          {locale === 'en' 
            ? 'Settings page coming soon...' 
            : locale === 'es' 
            ? 'Página de configuración próximamente...'
            : 'Page de paramètres bientôt disponible...'
          }
        </p>
      </div>
    </div>
  );
}
