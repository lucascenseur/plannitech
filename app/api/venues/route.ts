import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Types pour les lieux
interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  capacity: number;
  status: 'available' | 'maintenance' | 'booked' | 'unavailable';
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  facilities: string[];
  stage: {
    width: number;
    depth: number;
    height: number;
  };
  rates: {
    day: number;
    week: number;
  };
  rating: number;
  lastUsed?: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}


// GET - Récupérer tous les lieux
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
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Pour l'instant, retourner un tableau vide en attendant la configuration de la DB
    const venues = [];

    return NextResponse.json({
      venues,
      total: venues.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau lieu
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      address,
      capacity,
      status = 'available',
      contact,
      facilities = [],
      stage,
      rates,
      rating = 0
    } = body;

    // Validation des données requises
    if (!name || !type || !address || !contact || !stage || !rates) {
      return NextResponse.json(
        { error: 'Les champs nom, type, adresse, contact, scène et tarifs sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouveau lieu avec Prisma
    const newVenue = await prisma.venue.create({
      data: {
        name,
        type,
        address,
        capacity: capacity || 0,
        status,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        facilities,
        stageWidth: stage.width,
        stageDepth: stage.depth,
        stageHeight: stage.height,
        rateDay: rates.day,
        rateWeek: rates.week,
        rating,
        organizationId: session.user.organizationId || 'default-org',
        createdById: session.user.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(newVenue, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
