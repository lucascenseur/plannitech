import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un hébergement spécifique
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

    const accommodation = await prisma.accommodation.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      },
      include: {
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!accommodation) {
      return NextResponse.json({ error: 'Hébergement non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ accommodation });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'hébergement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un hébergement
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
      contactName,
      phone,
      email,
      capacity,
      pricePerNight,
      showId,
      checkIn,
      checkOut,
      status
    } = body;

    // Vérifier que l'hébergement existe et appartient à l'organisation
    const existingAccommodation = await prisma.accommodation.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingAccommodation) {
      return NextResponse.json({ error: 'Hébergement non trouvé' }, { status: 404 });
    }

    // Mettre à jour l'hébergement
    const updatedAccommodation = await prisma.accommodation.update({
      where: { id },
      data: {
        name,
        type,
        address,
        contactName,
        phone,
        email,
        capacity,
        pricePerNight,
        showId,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        status
      },
      include: {
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ accommodation: updatedAccommodation });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'hébergement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un hébergement
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

    // Vérifier que l'hébergement existe et appartient à l'organisation
    const existingAccommodation = await prisma.accommodation.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingAccommodation) {
      return NextResponse.json({ error: 'Hébergement non trouvé' }, { status: 404 });
    }

    // Supprimer l'hébergement
    await prisma.accommodation.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Hébergement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'hébergement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
