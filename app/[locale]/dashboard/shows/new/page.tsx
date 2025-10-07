import { Metadata } from "next";
import { ShowForm } from "@/components/forms/ShowForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NewShowPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: NewShowPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Nouveau Spectacle - Plannitech",
    description: "Créer un nouveau spectacle",
    alternates: {
      canonical: `/${locale}/dashboard/shows/new`,
      languages: {
        'fr': '/fr/dashboard/shows/new',
        'en': '/en/dashboard/shows/new',
        'es': '/es/dashboard/shows/new',
      },
    },
  };
}

export default async function NewShowPage({ params }: NewShowPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/dashboard/shows`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {locale === 'en' ? 'Back to Shows' : locale === 'es' ? 'Volver a Espectáculos' : 'Retour aux Spectacles'}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Create New Show' : locale === 'es' ? 'Crear Nuevo Espectáculo' : 'Créer un Nouveau Spectacle'}
        </h1>
        <p className="text-gray-600 mt-1">
          {locale === 'en' 
            ? 'Fill in the details below to create a new show or event' 
            : locale === 'es' 
            ? 'Completa los detalles a continuación para crear un nuevo espectáculo o evento'
            : 'Remplissez les détails ci-dessous pour créer un nouveau spectacle ou événement'
          }
        </p>
      </div>

      {/* Formulaire */}
      <ShowForm />
    </div>
  );
}
