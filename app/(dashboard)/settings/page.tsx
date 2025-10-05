"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth, usePermissions } from "@/hooks/useAuth";
import { Settings, User, Building2, Shield, Bell, CreditCard, Users, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, getCurrentOrganization } = useAuth();
  const { canManageUsers } = usePermissions();
  const currentOrg = getCurrentOrganization();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">
          Gérez vos préférences et votre organisation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <nav className="space-y-2">
                <Button variant="default" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Organisation
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Sécurité
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Facturation
                </Button>
                {canManageUsers && (
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Utilisateurs
                  </Button>
                )}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profil utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle>Profil utilisateur</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue={user?.name?.split(" ")[0] || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue={user?.name?.split(" ")[1] || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">
                    {user?.organizations?.[0]?.role || "Utilisateur"}
                  </Badge>
                </div>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </CardContent>
          </Card>

          {/* Organisation */}
          {currentOrg && (
            <Card>
              <CardHeader>
                <CardTitle>Organisation</CardTitle>
                <CardDescription>
                  Informations de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nom de l'organisation</Label>
                  <Input id="orgName" defaultValue={currentOrg.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">Email</Label>
                  <Input id="orgEmail" type="email" defaultValue={currentOrg.email} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siret">SIRET</Label>
                    <Input id="siret" defaultValue={currentOrg.siret || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ape">Code APE</Label>
                    <Input id="ape" defaultValue={currentOrg.apeCode || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" defaultValue={currentOrg.address || ""} />
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Gérez votre mot de passe et la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>
                <Shield className="h-4 w-4 mr-2" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-gray-600">
                      Recevez des notifications par email
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications de projet</Label>
                    <p className="text-sm text-gray-600">
                      Alertes pour les mises à jour de projets
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications de planning</Label>
                    <p className="text-sm text-gray-600">
                      Rappels pour les événements
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facturation */}
          <Card>
            <CardHeader>
              <CardTitle>Facturation</CardTitle>
              <CardDescription>
                Gérez votre abonnement et vos factures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Plan Professionnel</h3>
                  <p className="text-sm text-gray-600">
                    Accès complet à toutes les fonctionnalités
                  </p>
                </div>
                <Badge variant="default">Actif</Badge>
              </div>
              <div className="space-y-2">
                <Label>Prochaine facturation</Label>
                <p className="text-sm text-gray-600">
                  15 juillet 2024 - 29,99€
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gérer la facturation
                </Button>
                <Button variant="outline">
                  Télécharger les factures
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

