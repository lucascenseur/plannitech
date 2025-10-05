import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const organizationId = session.user.organizations?.[0]?.id;
    
    if (!organizationId) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Récupérer les factures
    const invoices = await prisma.invoice.findMany({
      where: {
        organizationId,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ message: 'Failed to fetch invoices' }, { status: 500 });
  }
}

