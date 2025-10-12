import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un fournisseur spécifique
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

    const supplier = await prisma.supplier.findFirst({
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

    if (!supplier) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ supplier });
  } catch (error) {
    console.error('Erreur lors de la récupération du fournisseur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un fournisseur
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
      contactName,
      email,
      phone,
      address,
      website,
      rating
    } = body;

    // Vérifier que le fournisseur existe et appartient à l'organisation
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    // Mettre à jour le fournisseur
    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        category,
        contactName,
        email,
        phone,
        address,
        website,
        rating
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ supplier: updatedSupplier });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du fournisseur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un fournisseur
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

    // Vérifier que le fournisseur existe et appartient à l'organisation
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    // Supprimer le fournisseur
    await prisma.supplier.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du fournisseur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
