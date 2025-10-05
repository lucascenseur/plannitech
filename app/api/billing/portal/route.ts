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
    const organizationId = session.user.organizations?.[0]?.id;
    
    if (!organizationId) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Récupérer l'organisation
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Récupérer ou créer le customer Stripe
    let customerId = organization.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          organizationId: organizationId,
          userId: session.user.id,
        },
      });
      
      customerId = customer.id;
      
      // Mettre à jour l'organisation avec le customer ID
      await prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Créer la session du portail de facturation
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json({ message: 'Failed to create billing portal session' }, { status: 500 });
  }
}

