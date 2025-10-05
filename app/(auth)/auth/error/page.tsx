import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

const errorMessages: Record<string, string> = {
  Configuration: "Il y a un problème avec la configuration du serveur.",
  AccessDenied: "Vous n'avez pas l'autorisation de vous connecter.",
  Verification: "Le lien de vérification a expiré ou a déjà été utilisé.",
  Default: "Une erreur inattendue s'est produite.",
};

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;
  const error = params.error || "Default";
  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Spectacle SaaS</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Erreur d'authentification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Un problème est survenu lors de votre connexion
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Erreur de connexion</span>
            </CardTitle>
            <CardDescription>
              Nous n'avons pas pu vous connecter à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Que pouvez-vous faire ?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vérifiez vos informations de connexion</li>
                <li>• Assurez-vous que votre compte existe</li>
                <li>• Essayez de vous reconnecter</li>
                <li>• Contactez le support si le problème persiste</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/auth/signin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Réessayer la connexion
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/auth/signup">
                  Créer un nouveau compte
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Besoin d'aide ?{" "}
              <Link href="/support" className="text-primary hover:underline">
                Contactez le support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

