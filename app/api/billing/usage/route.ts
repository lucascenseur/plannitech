import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const organizationId = session.user.organizations?.[0]?.id;
    
    if (!organizationId) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Récupérer l'utilisation actuelle
    const usage = await prisma.usage.findMany({
      where: {
        organizationId,
      },
      include: {
        plan: true,
        subscription: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json({ message: 'Failed to fetch usage' }, { status: 500 });
  }
}

