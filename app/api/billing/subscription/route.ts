import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { PlanLimitsManager, PLAN_LIMITS, PlanType } from "@/lib/plan-limits";

const prisma = new PrismaClient();

// Récupérer l'abonnement actuel de l'organisation
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    // Récupérer l'abonnement actuel
    const subscription = await prisma.subscription.findFirst({
      where: {
        organizationId: userOrgId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: { id: true, name: true }
        }
      }
    });

    if (!subscription) {
      return NextResponse.json({ message: 'Aucun abonnement actif' }, { status: 404 });
    }

    // Récupérer les statistiques d'utilisation
    const limitsManager = new PlanLimitsManager(userOrgId);
    const usageStats = await limitsManager.getUsageStats();

    return NextResponse.json({
      subscription,
      usage: usageStats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Créer ou mettre à jour un abonnement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    const body = await request.json();
    const { plan, billingCycle = 'MONTHLY' } = body;

    // Vérifier que le plan existe
    if (!PLAN_LIMITS[plan as PlanType]) {
      return NextResponse.json({ message: 'Plan invalide' }, { status: 400 });
    }

    // Vérifier les permissions (seul le propriétaire peut changer le plan)
    const userMembership = await prisma.organizationUser.findFirst({
      where: {
        organizationId: userOrgId,
        userId: session.user?.id
      }
    });

    if (!userMembership || userMembership.role !== 'OWNER') {
      return NextResponse.json({ message: 'Seul le propriétaire peut modifier l\'abonnement' }, { status: 403 });
    }

    // Annuler l'abonnement actuel s'il existe
    await prisma.subscription.updateMany({
      where: {
        organizationId: userOrgId,
        status: 'ACTIVE'
      },
      data: {
        status: 'CANCELED',
        canceledAt: new Date()
      }
    });

    // Calculer les dates de facturation
    const now = new Date();
    const periodStart = now;
    const periodEnd = new Date(now.getTime() + (billingCycle === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000);

    // Créer le nouvel abonnement
    const newSubscription = await prisma.subscription.create({
      data: {
        organizationId: userOrgId,
        userId: session.user?.id,
        plan: plan as PlanType,
        status: 'ACTIVE',
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        billingCycle: billingCycle as 'MONTHLY' | 'YEARLY',
        // En production, on intégrerait Stripe ici
        stripeCustomerId: `cus_${userOrgId}_${Date.now()}`,
        stripeSubscriptionId: `sub_${userOrgId}_${Date.now()}`,
      },
      include: {
        organization: {
          select: { id: true, name: true }
        }
      }
    });

    // Récupérer les nouvelles statistiques d'utilisation
    const limitsManager = new PlanLimitsManager(userOrgId);
    const usageStats = await limitsManager.getUsageStats();

    return NextResponse.json({
      message: 'Abonnement mis à jour avec succès',
      subscription: newSubscription,
      usage: usageStats
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Annuler un abonnement
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userOrgId = session.user?.organizations?.[0]?.organizationId;
    if (!userOrgId) {
      return NextResponse.json({ message: 'Organisation non trouvée' }, { status: 400 });
    }

    // Vérifier les permissions
    const userMembership = await prisma.organizationUser.findFirst({
      where: {
        organizationId: userOrgId,
        userId: session.user?.id
      }
    });

    if (!userMembership || userMembership.role !== 'OWNER') {
      return NextResponse.json({ message: 'Seul le propriétaire peut annuler l\'abonnement' }, { status: 403 });
    }

    // Annuler l'abonnement
    await prisma.subscription.updateMany({
      where: {
        organizationId: userOrgId,
        status: 'ACTIVE'
      },
      data: {
        status: 'CANCELED',
        canceledAt: new Date()
      }
    });

    return NextResponse.json({ message: 'Abonnement annulé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
