import Link from "next/link";

interface AuthTestPageProps {
  params: {
    locale: string;
  };
}

export default function AuthTestPage({ params }: AuthTestPageProps) {
  const { locale } = params;

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

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Instructions de test</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">1. Testez la connexion</h4>
              <p className="text-sm text-gray-600">
                Cliquez sur le bouton "Se connecter" dans le menu pour accéder à la page de connexion.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">2. Identifiants de test</h4>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p><strong>Email:</strong> admin@test.com</p>
                <p><strong>Mot de passe:</strong> admin123</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">3. Vérification</h4>
              <p className="text-sm text-gray-600">
                Après connexion, vous devriez être redirigé vers le dashboard.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Link 
                href={`/${locale}/auth/signin`}
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700"
              >
                Aller à la page de connexion
              </Link>
              <Link 
                href={`/${locale}/landing`}
                className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded hover:bg-gray-300"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

