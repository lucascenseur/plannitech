import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Types pour les spectacles
interface Show {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  status: 'confirmed' | 'planning' | 'draft' | 'cancelled';
  artists: string[];
  team: number;
  budget: number;
  description?: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}


// GET - Récupérer tous les spectacles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    // Construire les filtres Prisma
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
        { artists: { has: search } }
      ];
    }

    // Récupérer les projets de type SPECTACLE
    const shows = await prisma.project.findMany({
      where: {
        ...where,
        type: 'SPECTACLE'
      },
      include: {
        venue: true,
        contacts: {
          include: {
            contact: true
          }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      shows,
      total: shows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des spectacles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau spectacle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      type,
      date,
      time,
      venue,
      status = 'draft',
      artists = [],
      team = 0,
      budget = 0,
      description
    } = body;

    // Validation des données requises
    if (!title || !type || !date || !time || !venue) {
      return NextResponse.json(
        { error: 'Les champs titre, type, date, heure et lieu sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouveau projet de type SPECTACLE avec Prisma
    const newShow = await prisma.project.create({
      data: {
        title,
        type: 'SPECTACLE',
        startDate: new Date(date),
        endDate: new Date(date),
        status: status === 'confirmed' ? 'ACTIVE' : status === 'planning' ? 'IN_PROGRESS' : 'DRAFT',
        budget: budget ? parseFloat(budget.toString()) : null,
        description,
        organizationId: session.user.organizationId || 'default-org',
        createdById: session.user.id,
        metadata: {
          time,
          venue,
          artists,
          team
        }
      },
      include: {
        venue: true,
        contacts: {
          include: {
            contact: true
          }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(newShow, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
