import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { Webhook } from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Webhook.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    const organizationId = subscription.metadata.organizationId;
    const planId = subscription.metadata.planId;

    if (!organizationId || !planId) {
      console.error('Missing metadata in subscription:', subscription.id);
      return;
    }

    // Récupérer le plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      console.error('Plan not found:', planId);
      return;
    }

    // Créer l'abonnement en base
    await prisma.subscription.create({
      data: {
        organizationId,
        planId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
        createdById: subscription.metadata.userId,
      },
    });

    console.log('Subscription created:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!existingSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Mettre à jour l'abonnement
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      },
    });

    console.log('Subscription updated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!existingSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Marquer l'abonnement comme supprimé
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      },
    });

    console.log('Subscription deleted:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription },
    });

    if (!subscription) {
      console.error('Subscription not found for invoice:', invoice.id);
      return;
    }

    // Créer la facture en base
    await prisma.invoice.create({
      data: {
        organizationId: subscription.organizationId,
        subscriptionId: subscription.id,
        number: invoice.number,
        status: 'paid',
        amount: invoice.amount_paid,
        currency: invoice.currency,
        tax: invoice.tax || 0,
        total: invoice.total,
        paidAt: new Date(invoice.paid_at * 1000),
        stripeInvoiceId: invoice.id,
        stripePaymentIntentId: invoice.payment_intent,
        pdfUrl: invoice.invoice_pdf,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        createdById: subscription.createdById,
      },
    });

    console.log('Invoice payment succeeded:', invoice.id);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription },
    });

    if (!subscription) {
      console.error('Subscription not found for invoice:', invoice.id);
      return;
    }

    // Créer la facture en base avec le statut échoué
    await prisma.invoice.create({
      data: {
        organizationId: subscription.organizationId,
        subscriptionId: subscription.id,
        number: invoice.number,
        status: 'uncollectible',
        amount: invoice.amount_due,
        currency: invoice.currency,
        tax: invoice.tax || 0,
        total: invoice.total,
        stripeInvoiceId: invoice.id,
        createdById: subscription.createdById,
      },
    });

    console.log('Invoice payment failed:', invoice.id);
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

async function handleTrialWillEnd(subscription: any) {
  try {
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!existingSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Ici on pourrait envoyer une notification à l'utilisateur
    // que son essai va se terminer
    console.log('Trial will end for subscription:', subscription.id);
  } catch (error) {
    console.error('Error handling trial will end:', error);
  }
}

