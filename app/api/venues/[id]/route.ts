import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un lieu spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const venue = await prisma.venue.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!venue) {
      return NextResponse.json({ error: 'Lieu non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ venue });
  } catch (error) {
    console.error('Erreur lors de la récupération du lieu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un lieu
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      type,
      address,
      capacity,
      status,
      contact,
      facilities,
      stage,
      rates,
      rating
    } = body;

    // Vérifier que le lieu existe et appartient à l'organisation
    const existingVenue = await prisma.venue.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingVenue) {
      return NextResponse.json({ error: 'Lieu non trouvé' }, { status: 404 });
    }

    // Mettre à jour le lieu
    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: {
        name,
        type,
        address,
        capacity,
        status,
        contactName: contact?.name,
        contactPhone: contact?.phone,
        contactEmail: contact?.email,
        facilities,
        stageWidth: stage?.width,
        stageDepth: stage?.depth,
        stageHeight: stage?.height,
        rateDay: rates?.day,
        rateWeek: rates?.week,
        rating
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ venue: updatedVenue });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du lieu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un lieu
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    // Vérifier que le lieu existe et appartient à l'organisation
    const existingVenue = await prisma.venue.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingVenue) {
      return NextResponse.json({ error: 'Lieu non trouvé' }, { status: 404 });
    }

    // Supprimer le lieu
    await prisma.venue.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Lieu supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du lieu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
