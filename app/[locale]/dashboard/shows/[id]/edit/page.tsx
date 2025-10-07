import { Metadata } from "next";
import { ShowForm } from "@/components/forms/ShowForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditShowPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditShowPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  
  return {
    title: "Modifier le Spectacle - Plannitech",
    description: "Modifier les détails du spectacle",
    alternates: {
      canonical: `/${locale}/dashboard/shows/${id}/edit`,
      languages: {
        'fr': `/fr/dashboard/shows/${id}/edit`,
        'en': `/en/dashboard/shows/${id}/edit`,
        'es': `/es/dashboard/shows/${id}/edit`,
      },
    },
  };
}

async function getShow(id: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/shows/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération du spectacle:', error);
    return null;
  }
}

export default async function EditShowPage({ params }: EditShowPageProps) {
  const { locale, id } = await params;
  
  const show = await getShow(id);
  
  if (!show) {
    notFound();
  }

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
          {locale === 'en' ? 'Edit Show' : locale === 'es' ? 'Editar Espectáculo' : 'Modifier le Spectacle'}
        </h1>
        <p className="text-gray-600 mt-1">
          {locale === 'en' 
            ? `Edit the details for "${show.title}"` 
            : locale === 'es' 
            ? `Edita los detalles para "${show.title}"`
            : `Modifiez les détails pour "${show.title}"`
          }
        </p>
      </div>

      {/* Formulaire */}
      <ShowForm show={show} />
    </div>
  );
}
