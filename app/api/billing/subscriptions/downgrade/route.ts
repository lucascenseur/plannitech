import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ message: 'Plan ID is required' }, { status: 400 });
    }

    // Récupérer le plan cible
    const targetPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!targetPlan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    // Récupérer l'abonnement actuel
    const currentSubscription = await prisma.subscription.findFirst({
      where: {
        organizationId: session.user.organizations?.[0]?.id,
        status: 'active',
      },
      include: {
        plan: true,
      },
    });

    if (!currentSubscription) {
      return NextResponse.json({ message: 'No active subscription found' }, { status: 404 });
    }

    // Vérifier que c'est bien un downgrade
    const currentPlanIndex = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    const currentPlanPosition = currentPlanIndex.findIndex(p => p.id === currentSubscription.planId);
    const targetPlanPosition = currentPlanIndex.findIndex(p => p.id === planId);

    if (targetPlanPosition >= currentPlanPosition) {
      return NextResponse.json({ message: 'This is not a downgrade' }, { status: 400 });
    }

    // Mettre à jour l'abonnement Stripe
    const stripeSubscription = await stripe.subscriptions.update(
      currentSubscription.stripeSubscriptionId!,
      {
        items: [
          {
            id: currentSubscription.stripeSubscriptionId!,
            price: targetPlan.stripePriceId,
          },
        ],
        proration_behavior: 'create_prorations',
        metadata: {
          organizationId: session.user.organizations?.[0]?.id,
          planId: targetPlan.id,
        },
      }
    );

    // Mettre à jour l'abonnement en base
    const updatedSubscription = await prisma.subscription.update({
      where: { id: currentSubscription.id },
      data: {
        planId: targetPlan.id,
        stripePriceId: targetPlan.stripePriceId,
        stripeProductId: targetPlan.stripeProductId,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        status: stripeSubscription.status as any,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    return NextResponse.json({ message: 'Failed to downgrade subscription' }, { status: 500 });
  }
}

