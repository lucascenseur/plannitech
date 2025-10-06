import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
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

    // Télécharger le PDF depuis Stripe
    if (invoice.stripeInvoiceId) {
      const stripeInvoice = await stripe.invoices.retrieve(invoice.stripeInvoiceId);
      
      if (stripeInvoice.invoice_pdf) {
        const response = await fetch(stripeInvoice.invoice_pdf);
        const pdfBuffer = await response.arrayBuffer();
        
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="invoice-${invoice.number}.pdf"`,
          },
        });
      }
    }

    return NextResponse.json({ message: 'PDF not available' }, { status: 404 });
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return NextResponse.json({ message: 'Failed to download invoice' }, { status: 500 });
  }
}

