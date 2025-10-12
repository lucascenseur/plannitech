import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un bon de commande spécifique
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

    const purchaseOrder = await prisma.purchaseOrder.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      },
      include: {
        supplier: true,
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Bon de commande non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ purchaseOrder });
  } catch (error) {
    console.error('Erreur lors de la récupération du bon de commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un bon de commande
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
      number,
      supplierId,
      showId,
      description,
      totalAmount,
      status,
      dueDate,
      items
    } = body;

    // Vérifier que le bon de commande existe et appartient à l'organisation
    const existingPurchaseOrder = await prisma.purchaseOrder.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingPurchaseOrder) {
      return NextResponse.json({ error: 'Bon de commande non trouvé' }, { status: 404 });
    }

    // Mettre à jour le bon de commande
    const updatedPurchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        number,
        supplierId,
        showId,
        description,
        totalAmount,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        items
      },
      include: {
        supplier: true,
        show: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ purchaseOrder: updatedPurchaseOrder });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bon de commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un bon de commande
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

    // Vérifier que le bon de commande existe et appartient à l'organisation
    const existingPurchaseOrder = await prisma.purchaseOrder.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingPurchaseOrder) {
      return NextResponse.json({ error: 'Bon de commande non trouvé' }, { status: 404 });
    }

    // Supprimer le bon de commande
    await prisma.purchaseOrder.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Bon de commande supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du bon de commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
