import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { subscriptionSchema } from '@/types/billing';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        organizationId: session.user.organizations?.[0]?.id,
      },
      include: {
        plan: true,
        invoices: true,
        paymentMethods: true,
        usage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ message: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { planId, paymentMethodId } = body;

    if (!planId) {
      return NextResponse.json({ message: 'Plan ID is required' }, { status: 400 });
    }

    // Récupérer le plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    // Récupérer ou créer le customer Stripe
    let customerId = session.user.organizations?.[0]?.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          organizationId: session.user.organizations?.[0]?.id,
          userId: session.user.id,
        },
      });
      
      customerId = customer.id;
      
      // Mettre à jour l'organisation avec le customer ID
      await prisma.organization.update({
        where: { id: session.user.organizations?.[0]?.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Créer l'abonnement Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        organizationId: session.user.organizations?.[0]?.id,
        planId: plan.id,
      },
    });

    // Créer l'abonnement en base
    const subscription = await prisma.subscription.create({
      data: {
        organizationId: session.user.organizations?.[0]?.id,
        planId: plan.id,
        status: stripeSubscription.status as any,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: customerId,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ message: 'Failed to create subscription' }, { status: 500 });
  }
}

