import { Metadata } from "next";
import { VenueForm } from "@/components/forms/VenueForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NewVenuePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: NewVenuePageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Nouveau Lieu - Plannitech",
    description: "Créer un nouveau lieu de spectacle",
    alternates: {
      canonical: `/${locale}/dashboard/venues/new`,
      languages: {
        'fr': '/fr/dashboard/venues/new',
        'en': '/en/dashboard/venues/new',
        'es': '/es/dashboard/venues/new',
      },
    },
  };
}

export default async function NewVenuePage({ params }: NewVenuePageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/dashboard/venues`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {locale === 'en' ? 'Back to Venues' : locale === 'es' ? 'Volver a Lugares' : 'Retour aux Lieux'}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Create New Venue' : locale === 'es' ? 'Crear Nuevo Lugar' : 'Créer un Nouveau Lieu'}
        </h1>
        <p className="text-gray-600 mt-1">
          {locale === 'en' 
            ? 'Fill in the details below to add a new venue or location' 
            : locale === 'es' 
            ? 'Completa los detalles a continuación para agregar un nuevo lugar o ubicación'
            : 'Remplissez les détails ci-dessous pour ajouter un nouveau lieu ou emplacement'
          }
        </p>
      </div>

      {/* Formulaire */}
      <VenueForm />
    </div>
  );
}
