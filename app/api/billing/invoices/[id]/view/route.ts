import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: invoiceId } = await params;

    // Récupérer la facture
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        organizationId: session.user.organizations?.[0]?.id,
      },
    });

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    // Récupérer l'URL de la facture depuis Stripe
    if (invoice.stripeInvoiceId) {
      const stripeInvoice = await stripe.invoices.retrieve(invoice.stripeInvoiceId);
      
      if (stripeInvoice.hosted_invoice_url) {
        return NextResponse.json({ url: stripeInvoice.hosted_invoice_url });
      }
    }

    return NextResponse.json({ message: 'Invoice URL not available' }, { status: 404 });
  } catch (error) {
    console.error('Error viewing invoice:', error);
    return NextResponse.json({ message: 'Failed to view invoice' }, { status: 500 });
  }
}

