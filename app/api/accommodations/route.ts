import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les hébergements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Construire les filtres Prisma
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const accommodations = await prisma.accommodation.findMany({
      where,
      include: {
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      accommodations,
      total: accommodations.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des hébergements:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel hébergement
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
      contactName,
      phone,
      email,
      capacity,
      pricePerNight,
      showId,
      checkIn,
      checkOut,
      status = 'reserved'
    } = body;

    // Validation des données requises
    if (!name || !type || !address || !contactName || !showId) {
      return NextResponse.json(
        { error: 'Les champs nom, type, adresse, contact et spectacle sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouvel hébergement
    const newAccommodation = await prisma.accommodation.create({
      data: {
        name,
        type,
        address,
        contactName,
        phone,
        email,
        capacity: capacity || 1,
        pricePerNight: pricePerNight || 0,
        showId,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        status,
        organizationId: session.user.organizationId || 'default-org',
        createdById: session.user.id
      },
      include: {
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ accommodation: newAccommodation }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'hébergement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
