import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un document spécifique
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

    const document = await prisma.document.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
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

    if (!document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Erreur lors de la récupération du document:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un document
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
      description,
      tags
    } = body;

    // Vérifier que le document existe et appartient à l'organisation
    const existingDocument = await prisma.document.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    }

    // Mettre à jour le document
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        name,
        type,
        description,
        tags
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

    return NextResponse.json({ document: updatedDocument });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du document:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un document
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

    // Vérifier que le document existe et appartient à l'organisation
    const existingDocument = await prisma.document.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    }

    // Supprimer le document
    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
