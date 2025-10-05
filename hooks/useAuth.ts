"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthUser, AuthError, Permission, ROLE_PERMISSIONS } from "@/types/auth";
import { UserRole } from "@/types/auth";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const user = session?.user as AuthUser | undefined;
  const isLoading = status === "loading";

  // Fonction pour vérifier les permissions
  const hasPermission = useCallback(
    (permission: keyof Permission): boolean => {
      if (!user?.organizations?.[0]) return false;
      
      const role = user.organizations[0].role;
      const permissions = ROLE_PERMISSIONS[role];
      
      return permissions[permission];
    },
    [user]
  );

  // Fonction pour vérifier le rôle
  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user?.organizations?.[0]) return false;
      
      const userRole = user.organizations[0].role;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      return allowedRoles.includes(userRole);
    },
    [user]
  );

  // Fonction pour obtenir l'organisation actuelle
  const getCurrentOrganization = useCallback(() => {
    return user?.organizations?.[0]?.organization;
  }, [user]);

  // Fonction pour changer d'organisation
  const switchOrganization = useCallback(
    async (organizationId: string) => {
      if (!user) return;
      
      const targetOrg = user.organizations?.find(
        (org) => org.organizationId === organizationId
      );
      
      if (!targetOrg) {
        setError({ message: "Organisation non trouvée" });
        return;
      }

      // Mettre à jour la session avec la nouvelle organisation
      await update({
        ...session,
        user: {
          ...user,
          currentOrganization: targetOrg.organization,
        },
      });
    },
    [user, session, update]
  );

  // Fonction pour se déconnecter
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      // En mode test, on utilise la déconnexion NextAuth standard
      const { signOut: nextAuthSignOut } = await import("next-auth/react");
      await nextAuthSignOut({ callbackUrl: "/auth/signin" });
    } catch (err) {
      setError({ message: "Erreur lors de la déconnexion" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour mettre à jour le profil
  const updateProfile = useCallback(
    async (data: Partial<AuthUser>) => {
      setLoading(true);
      setError(null);
      
      try {
        // En mode test, on simule juste la mise à jour
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Profil mis à jour (mode test):", data);
      } catch (err) {
        setError({ 
          message: err instanceof Error ? err.message : "Erreur lors de la mise à jour" 
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fonction pour inviter un utilisateur
  const inviteUser = useCallback(
    async (email: string, role: UserRole) => {
      setLoading(true);
      setError(null);
      
      try {
        // En mode test, on simule juste l'invitation
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Utilisateur invité (mode test):", { email, role });
        return { success: true, message: "Invitation envoyée (mode test)" };
      } catch (err) {
        setError({ 
          message: err instanceof Error ? err.message : "Erreur lors de l'invitation" 
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Redirection automatique si non connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  return {
    user,
    isLoading,
    loading,
    error,
    hasPermission,
    hasRole,
    getCurrentOrganization,
    switchOrganization,
    signOut,
    updateProfile,
    inviteUser,
    clearError: () => setError(null),
  };
}

// Hook pour vérifier les permissions dans les composants
export function usePermissions() {
  const { hasPermission, hasRole, user } = useAuth();
  
  return {
    canManageUsers: hasPermission("canManageUsers"),
    canManageProjects: hasPermission("canManageProjects"),
    canManageBudget: hasPermission("canManageBudget"),
    canManageContracts: hasPermission("canManageContracts"),
    canManageOrganization: hasPermission("canManageOrganization"),
    canViewAnalytics: hasPermission("canViewAnalytics"),
    canManageSubscriptions: hasPermission("canManageSubscriptions"),
    isOwner: hasRole(UserRole.OWNER),
    isAdmin: hasRole([UserRole.OWNER, UserRole.ADMIN]),
    isManager: hasRole([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER]),
    user,
  };
}

// Hook pour la gestion des organisations
export function useOrganizations() {
  const { user, switchOrganization } = useAuth();
  
  const organizations = user?.organizations?.map(org => ({
    id: org.organizationId || org.id,
    name: org.organization?.name || org.name,
    role: org.role,
    organization: org.organization || org,
  })) || [];

  const currentOrganization = user?.currentOrganization || organizations[0]?.organization;

  return {
    organizations,
    currentOrganization,
    switchOrganization,
  };
}
