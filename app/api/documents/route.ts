import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les documents
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const showId = searchParams.get('showId');
    const venueId = searchParams.get('venueId');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    // Construire les filtres
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (showId) {
      where.showId = showId;
    }

    if (venueId) {
      where.venueId = venueId;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        show: {
          select: { id: true, title: true }
        },
        venue: {
          select: { id: true, name: true }
        },
        uploadedBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      documents,
      total: documents.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau document
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
      description,
      fileUrl,
      fileSize,
      mimeType,
      showId,
      venueId,
      tags
    } = body;

    // Validation des données requises
    if (!name || !type || !fileUrl) {
      return NextResponse.json(
        { error: 'Les champs nom, type et URL du fichier sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouveau document
    const document = await prisma.document.create({
      data: {
        name,
        type,
        description,
        fileUrl,
        fileSize: fileSize || 0,
        mimeType,
        showId,
        venueId,
        tags: tags || [],
        organizationId: session.user.organizationId || 'default-org',
        uploadedById: session.user.id
      },
      include: {
        show: {
          select: { id: true, title: true }
        },
        venue: {
          select: { id: true, name: true }
        },
        uploadedBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du document:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
