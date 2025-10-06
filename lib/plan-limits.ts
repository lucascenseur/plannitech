import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Définition des plans et leurs limites
export const PLAN_LIMITS = {
  FREE: {
    name: 'Gratuit',
    maxUsers: 1,
    maxProjects: 5,
    maxContacts: 100,
    maxStorage: 1000, // MB
    maxOrganizations: 1,
    features: {
      advancedReporting: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
      multiOrganization: false,
    },
    price: { monthly: 0, yearly: 0 }
  },
  STARTER: {
    name: 'Starter',
    maxUsers: 5,
    maxProjects: 25,
    maxContacts: 500,
    maxStorage: 5000, // MB
    maxOrganizations: 2,
    features: {
      advancedReporting: true,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
      multiOrganization: true,
    },
    price: { monthly: 29, yearly: 290 }
  },
  PROFESSIONAL: {
    name: 'Professionnel',
    maxUsers: 15,
    maxProjects: 100,
    maxContacts: 2000,
    maxStorage: 20000, // MB
    maxOrganizations: 5,
    features: {
      advancedReporting: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      whiteLabel: false,
      multiOrganization: true,
    },
    price: { monthly: 79, yearly: 790 }
  },
  ENTERPRISE: {
    name: 'Entreprise',
    maxUsers: -1, // Illimité
    maxProjects: -1, // Illimité
    maxContacts: -1, // Illimité
    maxStorage: 100000, // MB
    maxOrganizations: -1, // Illimité
    features: {
      advancedReporting: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      whiteLabel: true,
      multiOrganization: true,
    },
    price: { monthly: 199, yearly: 1990 }
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

// Interface pour les limites d'utilisation
export interface UsageLimits {
  users: number;
  projects: number;
  contacts: number;
  storage: number; // MB
  organizations: number;
}

// Interface pour les fonctionnalités
export interface PlanFeatures {
  advancedReporting: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  whiteLabel: boolean;
  multiOrganization: boolean;
}

// Classe pour gérer les limites des plans
export class PlanLimitsManager {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  // Récupérer le plan actuel de l'organisation
  async getCurrentPlan(): Promise<PlanType> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        organizationId: this.organizationId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    return (subscription?.plan as PlanType) || 'FREE';
  }

  // Récupérer les limites du plan actuel
  async getPlanLimits(): Promise<typeof PLAN_LIMITS[PlanType]> {
    const currentPlan = await this.getCurrentPlan();
    return PLAN_LIMITS[currentPlan];
  }

  // Récupérer l'utilisation actuelle
  async getCurrentUsage(): Promise<UsageLimits> {
    const [usersCount, projectsCount, contactsCount, storageUsed] = await Promise.all([
      // Nombre d'utilisateurs dans l'organisation
      prisma.organizationUser.count({
        where: { organizationId: this.organizationId }
      }),
      
      // Nombre de projets
      prisma.project.count({
        where: { organizationId: this.organizationId }
      }),
      
      // Nombre de contacts
      prisma.contact.count({
        where: { organizationId: this.organizationId }
      }),
      
      // Stockage utilisé (estimation basée sur les documents)
      prisma.document.aggregate({
        where: { organizationId: this.organizationId },
        _sum: { fileSize: true }
      }).then(result => Math.round((result._sum.fileSize || 0) / (1024 * 1024))) // Convertir en MB
    ]);

    return {
      users: usersCount,
      projects: projectsCount,
      contacts: contactsCount,
      storage: storageUsed,
      organizations: 1 // Pour l'instant, une organisation par abonnement
    };
  }

  // Vérifier si une action est autorisée
  async canPerformAction(action: keyof UsageLimits): Promise<{ allowed: boolean; reason?: string }> {
    const [planLimits, currentUsage] = await Promise.all([
      this.getPlanLimits(),
      this.getCurrentUsage()
    ]);

    const limit = planLimits[action];
    const usage = currentUsage[action];

    // -1 signifie illimité
    if (limit === -1) {
      return { allowed: true };
    }

    if (usage >= limit) {
      return {
        allowed: false,
        reason: `Limite atteinte pour ${action}. Plan actuel: ${planLimits.name} (${usage}/${limit})`
      };
    }

    return { allowed: true };
  }

  // Vérifier si une fonctionnalité est disponible
  async hasFeature(feature: keyof PlanFeatures): Promise<boolean> {
    const planLimits = await this.getPlanLimits();
    return planLimits.features[feature];
  }

  // Obtenir les statistiques d'utilisation
  async getUsageStats(): Promise<{
    plan: string;
    limits: typeof PLAN_LIMITS[PlanType];
    usage: UsageLimits;
    utilization: {
      users: number;
      projects: number;
      contacts: number;
      storage: number;
    };
  }> {
    const [planLimits, currentUsage] = await Promise.all([
      this.getPlanLimits(),
      this.getCurrentUsage()
    ]);

    const utilization = {
      users: planLimits.maxUsers === -1 ? 0 : (currentUsage.users / planLimits.maxUsers) * 100,
      projects: planLimits.maxProjects === -1 ? 0 : (currentUsage.projects / planLimits.maxProjects) * 100,
      contacts: planLimits.maxContacts === -1 ? 0 : (currentUsage.contacts / planLimits.maxContacts) * 100,
      storage: (currentUsage.storage / planLimits.maxStorage) * 100,
    };

    return {
      plan: planLimits.name,
      limits: planLimits,
      usage: currentUsage,
      utilization
    };
  }

  // Vérifier si l'organisation peut ajouter un utilisateur
  async canAddUser(): Promise<{ allowed: boolean; reason?: string }> {
    return this.canPerformAction('users');
  }

  // Vérifier si l'organisation peut créer un projet
  async canCreateProject(): Promise<{ allowed: boolean; reason?: string }> {
    return this.canPerformAction('projects');
  }

  // Vérifier si l'organisation peut ajouter un contact
  async canAddContact(): Promise<{ allowed: boolean; reason?: string }> {
    return this.canPerformAction('contacts');
  }

  // Vérifier si l'organisation peut utiliser le multi-organisation
  async canUseMultiOrganization(): Promise<boolean> {
    return this.hasFeature('multiOrganization');
  }
}

// Fonction utilitaire pour vérifier les limites dans les APIs
export async function checkPlanLimits(
  organizationId: string,
  action: keyof UsageLimits
): Promise<{ allowed: boolean; reason?: string }> {
  const limitsManager = new PlanLimitsManager(organizationId);
  return limitsManager.canPerformAction(action);
}

// Fonction utilitaire pour vérifier les fonctionnalités
export async function checkPlanFeature(
  organizationId: string,
  feature: keyof PlanFeatures
): Promise<boolean> {
  const limitsManager = new PlanLimitsManager(organizationId);
  return limitsManager.hasFeature(feature);
}

// Middleware pour vérifier les limites dans les APIs
export function withPlanLimits(action: keyof UsageLimits) {
  return async function(organizationId: string) {
    const result = await checkPlanLimits(organizationId, action);
    if (!result.allowed) {
      throw new Error(result.reason);
    }
    return result;
  };
}

// Middleware pour vérifier les fonctionnalités
export function withPlanFeature(feature: keyof PlanFeatures) {
  return async function(organizationId: string) {
    const hasFeature = await checkPlanFeature(organizationId, feature);
    if (!hasFeature) {
      throw new Error(`Fonctionnalité ${feature} non disponible dans votre plan`);
    }
    return hasFeature;
  };
}
