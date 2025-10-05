import { getTranslations } from "@/lib/translations";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { MultilingualHeader } from "@/components/layout/MultilingualHeader";
import { MultilingualFooter } from "@/components/layout/MultilingualFooter";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SignUpPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'fr' },
    { locale: 'en' },
    { locale: 'es' }
  ];
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;

  // Vérifier que la locale est supportée
  const supportedLocales = ['fr', 'en', 'es'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Charger les traductions
  const t = await getTranslations(locale as any, 'auth');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <MultilingualHeader currentPage="auth" locale={locale} />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href={`/${locale}/landing`} className="inline-flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Plannitech</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {t.signup?.title || 'Créer votre compte'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t.signup?.subtitle || 'Rejoignez la communauté des professionnels du spectacle vivant'}
            </p>
          </div>

          <RegisterForm translations={t.signup} />
        </div>
      </div>
      
      <MultilingualFooter 
        locale={locale}
        currentT={{
          product: {
            features: t.navigation?.features || 'Fonctionnalités',
            pricing: t.navigation?.pricing || 'Tarifs',
            demo: t.navigation?.demo || 'Démo',
            blog: t.navigation?.blog || 'Blog'
          },
          resources: {
            documentation: 'Documentation',
            guides: 'Guides',
            api: 'API',
            support: 'Support'
          },
          support: {
            help: 'Aide',
            contact: 'Contact',
            status: 'Statut',
            community: 'Communauté'
          },
          legal: {
            privacy: 'Confidentialité',
            terms: 'Conditions',
            cookies: 'Cookies',
            security: 'Sécurité'
          },
          newsletter: {
            title: 'Newsletter',
            subtitle: 'Recevez nos dernières actualités',
            placeholder: 'Votre email',
            button: 'S\'abonner'
          }
        }}
      />
    </div>
  );
}

