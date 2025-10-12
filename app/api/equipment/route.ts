import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les équipements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Construire les filtres Prisma
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } }
      ];
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      equipment,
      total: equipment.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel équipement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      description,
      quantity,
      status,
      supplier,
      cost,
      location
    } = body;

    // Validation des données requises
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Les champs nom et catégorie sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouvel équipement
    const newEquipment = await prisma.equipment.create({
      data: {
        name,
        category,
        description,
        quantity: quantity || 1,
        status: status || 'available',
        supplier,
        cost,
        location,
        organizationId: session.user.organizationId || 'default-org',
        createdById: session.user.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ equipment: newEquipment }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
