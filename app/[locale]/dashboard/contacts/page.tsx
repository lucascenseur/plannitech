import { Metadata } from "next";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactForm } from "@/components/contacts/ContactForm";

interface ContactsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Contacts - Plannitech",
    description: "Gestion des contacts et collaborateurs",
    alternates: {
      canonical: `/${locale}/dashboard/contacts`,
      languages: {
        'fr': '/fr/dashboard/contacts',
        'en': '/en/dashboard/contacts',
        'es': '/es/dashboard/contacts',
      },
    },
  };
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your contacts and collaborators' 
            : locale === 'es' 
            ? 'Gestiona tus contactos y colaboradores'
            : 'Gérez vos contacts et collaborateurs'
          }
        </p>
      </div>
      
      <ContactList />
    </div>
  );
}
