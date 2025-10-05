import { redirect } from "next/navigation";

interface HomePageProps {
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

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Rediriger vers la page landing
  redirect(`/${locale}/landing`);
}