"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, Users, Target, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const INDUSTRY_OPTIONS = [
  "Théâtre",
  "Musique",
  "Danse",
  "Cirque",
  "Comédie",
  "Opéra",
  "Festival",
  "Événementiel",
  "Autre",
];

const GOAL_OPTIONS = [
  "Gérer mes spectacles",
  "Organiser des événements",
  "Gérer mes artistes",
  "Suivre mon budget",
  "Automatiser mes contrats",
  "Analyser mes performances",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "company",
    industry: "",
    teamSize: "1",
    goals: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Pour le mode test, on simule juste un délai et on redirige
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En mode test, on sauvegarde les données dans localStorage
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      
      // Vérifier si l'utilisateur est connecté
      if (!user) {
        setError("Vous devez être connecté pour accéder au dashboard");
        // Rediriger vers la page de connexion
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
        return;
      }
      
      // Rediriger directement vers le dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.organizationName.trim() !== "";
      case 2:
        return formData.industry !== "";
      case 3:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Étape {step} sur 3
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((step / 3) * 100)}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Bienvenue ! Configurons votre organisation"}
              {step === 2 && "Parlez-nous de votre activité"}
              {step === 3 && "Quels sont vos objectifs ?"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Ces informations nous aideront à personnaliser votre expérience"}
              {step === 2 && "Cela nous permet de vous proposer les bonnes fonctionnalités"}
              {step === 3 && "Nous adapterons l'interface à vos besoins"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Organization */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Nom de votre organisation *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="Mon Théâtre, Ma Compagnie..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Type d'organisation</Label>
                    <Select
                      value={formData.organizationType}
                      onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Entreprise</SelectItem>
                        <SelectItem value="association">Association</SelectItem>
                        <SelectItem value="individual">Particulier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Taille de votre équipe</Label>
                    <Select
                      value={formData.teamSize}
                      onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Juste moi</SelectItem>
                        <SelectItem value="2-5">2-5 personnes</SelectItem>
                        <SelectItem value="6-20">6-20 personnes</SelectItem>
                        <SelectItem value="21-50">21-50 personnes</SelectItem>
                        <SelectItem value="50+">Plus de 50 personnes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Industry */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Secteur d'activité *</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 border rounded-lg">
                      <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-medium">Organisation</h3>
                      <p className="text-sm text-gray-600">Gérez vos événements</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-medium">Équipe</h3>
                      <p className="text-sm text-gray-600">Collaborez efficacement</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h3 className="font-medium">Objectifs</h3>
                      <p className="text-sm text-gray-600">Atteignez vos buts</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Goals */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quels sont vos objectifs principaux ? *</Label>
                    <p className="text-sm text-gray-600">
                      Sélectionnez tous ceux qui s'appliquent
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {GOAL_OPTIONS.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={formData.goals.includes(goal)}
                          onCheckedChange={() => handleGoalToggle(goal)}
                        />
                        <Label htmlFor={goal} className="text-sm">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Configuration terminée !</h4>
                        <p className="text-sm text-blue-700">
                          Nous allons personnaliser votre tableau de bord selon vos objectifs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  Précédent
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStepValid() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Configuration...
                      </>
                    ) : (
                      "Terminer la configuration"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
