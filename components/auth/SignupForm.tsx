"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";

interface SignupFormProps {
  redirectTo?: string;
  showLoginLink?: boolean;
}

export function SignupForm({ redirectTo = "/onboarding", showLoginLink = true }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    siret: "",
    apeCode: "",
    isIntermittent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Connexion automatique après inscription
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Compte créé mais erreur de connexion. Veuillez vous connecter manuellement.");
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du compte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn("google", { callbackUrl: redirectTo });
    } catch (err) {
      setError("Erreur lors de l'inscription avec Google");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Inscription</CardTitle>
        <CardDescription className="text-center">
          Créez votre compte Spectacle SaaS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleGoogleSignUp}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continuer avec Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continuez avec
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
              placeholder="Jean Dupont"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
              placeholder="jean@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName">Nom de l'organisation</Label>
            <Input
              id="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              disabled={isLoading}
              placeholder="Mon Théâtre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isLoading}
              placeholder="+33 1 23 45 67 89"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isIntermittent"
              checked={formData.isIntermittent}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isIntermittent: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label htmlFor="isIntermittent" className="text-sm">
              Je suis intermittent du spectacle
            </Label>
          </div>

          {formData.isIntermittent && (
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET (optionnel)</Label>
              <Input
                id="siret"
                type="text"
                value={formData.siret}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                disabled={isLoading}
                placeholder="12345678901234"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="acceptTerms" className="text-sm">
              J'accepte les{" "}
              <Link href="/terms" className="text-primary hover:underline">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création du compte...
              </>
            ) : (
              "Créer le compte"
            )}
          </Button>
        </form>

        {showLoginLink && (
          <div className="text-center text-sm">
            Déjà un compte ?{" "}
            <Link
              href="/auth/signin"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Se connecter
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

