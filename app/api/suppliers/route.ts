import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les fournisseurs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Construire les filtres Prisma
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const suppliers = await prisma.supplier.findMany({
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
      suppliers,
      total: suppliers.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau fournisseur
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
      contactName,
      email,
      phone,
      address,
      website,
      rating
    } = body;

    // Validation des données requises
    if (!name || !contactName || !email) {
      return NextResponse.json(
        { error: 'Les champs nom, contact et email sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouveau fournisseur
    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        category,
        contactName,
        email,
        phone,
        address,
        website,
        rating: rating || 0,
        organizationId: session.user.organizationId || 'default-org',
        createdById: session.user.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ supplier: newSupplier }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
