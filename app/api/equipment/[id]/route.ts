import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un équipement spécifique
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

    const equipment = await prisma.equipment.findFirst({
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

    if (!equipment) {
      return NextResponse.json({ error: 'Équipement non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'équipement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un équipement
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
      category,
      description,
      quantity,
      status,
      supplier,
      cost,
      location
    } = body;

    // Vérifier que l'équipement existe et appartient à l'organisation
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: 'Équipement non trouvé' }, { status: 404 });
    }

    // Mettre à jour l'équipement
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        category,
        description,
        quantity,
        status,
        supplier,
        cost,
        location
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ equipment: updatedEquipment });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'équipement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un équipement
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

    // Vérifier que l'équipement existe et appartient à l'organisation
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: 'Équipement non trouvé' }, { status: 404 });
    }

    // Supprimer l'équipement
    await prisma.equipment.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Équipement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'équipement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
