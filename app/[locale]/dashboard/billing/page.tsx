import { Metadata } from "next";
import { SubscriptionPlans } from "@/components/billing/SubscriptionPlans";

interface BillingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: BillingPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Facturation - Plannitech",
    description: "Gestion de la facturation et des abonnements",
    alternates: {
      canonical: `/${locale}/dashboard/billing`,
      languages: {
        'fr': '/fr/dashboard/billing',
        'en': '/en/dashboard/billing',
        'es': '/es/dashboard/billing',
      },
    },
  };
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Billing' : locale === 'es' ? 'Facturación' : 'Facturation'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your subscription and billing' 
            : locale === 'es' 
            ? 'Gestiona tu suscripción y facturación'
            : 'Gérez votre abonnement et votre facturation'
          }
        </p>
      </div>
      
      <SubscriptionPlans />
    </div>
  );
}
