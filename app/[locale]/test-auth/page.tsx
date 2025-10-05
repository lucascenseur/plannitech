"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, User, LogOut } from "lucide-react";
import Link from "next/link";

interface TestAuthPageProps {
  params: {
    locale: string;
  };
}

export default function TestAuthPage({ params }: TestAuthPageProps) {
  const { data: session, status } = useSession();
  const { locale } = params;

  const handleSignIn = () => {
    signIn("credentials", {
      email: "admin@test.com",
      password: "admin123",
      redirect: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href={`/${locale}/landing`} className="inline-flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Plannitech</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Test d'authentification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vérifiez que l'authentification fonctionne correctement
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>État de l'authentification</span>
            </CardTitle>
            <CardDescription>
              Status: {status}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "loading" && (
              <Alert>
                <AlertDescription>
                  Chargement de la session...
                </AlertDescription>
              </Alert>
            )}

            {status === "unauthenticated" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Non connecté - L'authentification fonctionne (protection active)
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Identifiants de test :</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: <code className="bg-gray-100 px-1 rounded">admin@test.com</code>
                  </p>
                  <p className="text-sm text-gray-600">
                    Mot de passe: <code className="bg-gray-100 px-1 rounded">admin123</code>
                  </p>
                </div>

                <Button onClick={handleSignIn} className="w-full">
                  Se connecter avec les identifiants de test
                </Button>
              </div>
            )}

            {status === "authenticated" && session && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Authentification réussie ! L'utilisateur est connecté.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Utilisateur connecté :</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Nom: {session.user?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {session.user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    ID: {session.user?.id}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button asChild>
                    <Link href={`/${locale}/dashboard`}>
                      Aller au dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${locale}/landing`}>
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

