import { redirect } from "next/navigation";

interface HomePageProps {
  params: {
    locale: string;
  };
}

export async function generateStaticParams() {
  return [
    { locale: 'fr' },
    { locale: 'en' },
    { locale: 'es' }
  ];
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  // Rediriger vers la page landing
  redirect(`/${locale}/landing`);
}