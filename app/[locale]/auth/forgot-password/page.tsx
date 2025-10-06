import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "@/lib/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

interface ForgotPasswordPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ForgotPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Mot de passe oublié - Plannitech",
    description: "Réinitialisez votre mot de passe Plannitech",
    alternates: {
      canonical: `/${locale}/auth/forgot-password`,
      languages: {
        'fr': '/fr/auth/forgot-password',
        'en': '/en/auth/forgot-password',
        'es': '/es/auth/forgot-password',
      },
    },
  };
}

export async function generateStaticParams() {
  return [
    { locale: 'fr' },
    { locale: 'en' },
    { locale: 'es' }
  ];
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;

  // Vérifier que la locale est supportée
  const supportedLocales = ['fr', 'en', 'es'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Charger les traductions
  const t = await getTranslations(locale as any, 'auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t.forgotPassword?.title || 'Mot de passe oublié'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.forgotPassword?.subtitle || 'Entrez votre adresse email pour recevoir un lien de réinitialisation'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {t.forgotPassword?.formTitle || 'Réinitialiser le mot de passe'}
            </CardTitle>
            <CardDescription className="text-center">
              {t.forgotPassword?.formDescription || 'Nous vous enverrons un lien par email'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div>
                <Label htmlFor="email">
                  {t.forgotPassword?.emailLabel || 'Adresse email'}
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder={t.forgotPassword?.emailPlaceholder || 'votre@email.com'}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                {t.forgotPassword?.submitButton || 'Envoyer le lien de réinitialisation'}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href={`/${locale}/auth/signin`}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t.forgotPassword?.backToSignin || 'Retour à la connexion'}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t.forgotPassword?.helpText || 'Vous n\'avez pas reçu l\'email ? Vérifiez vos spams ou '}
            <Link
              href={`/${locale}/contact`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t.forgotPassword?.contactSupport || 'contactez le support'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
