import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscriptionId = params.id;

    // Récupérer l'abonnement
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        organizationId: session.user.organizations?.[0]?.id,
      },
    });

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    }

    // Annuler l'abonnement Stripe
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId!,
      {
        cancel_at_period_end: true,
        metadata: {
          organizationId: session.user.organizations?.[0]?.id,
          canceledBy: session.user.id,
          canceledAt: new Date().toISOString(),
        },
      }
    );

    // Mettre à jour l'abonnement en base
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
        status: 'canceled' as any,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({ message: 'Failed to cancel subscription' }, { status: 500 });
  }
}

