import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: subscriptionId } = await params;

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

    // Reprendre l'abonnement Stripe
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId!,
      {
        cancel_at_period_end: false,
        metadata: {
          organizationId: session.user.organizations?.[0]?.id,
          resumedBy: session.user.id,
          resumedAt: new Date().toISOString(),
        },
      }
    );

    // Mettre à jour l'abonnement en base
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
        status: 'active' as any,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json({ message: 'Failed to resume subscription' }, { status: 500 });
  }
}

