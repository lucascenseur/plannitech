import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un spectacle spécifique
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

    const show = await prisma.project.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org',
        type: 'SPECTACLE'
      },
      include: {
        venue: true,
        contacts: {
          include: {
            contact: true
          }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!show) {
      return NextResponse.json({ error: 'Spectacle non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ show });
  } catch (error) {
    console.error('Erreur lors de la récupération du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un spectacle
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
      title,
      type,
      date,
      time,
      venue,
      status,
      artists,
      team,
      budget,
      description
    } = body;

    // Vérifier que le spectacle existe et appartient à l'organisation
    const existingShow = await prisma.project.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org',
        type: 'SPECTACLE'
      }
    });

    if (!existingShow) {
      return NextResponse.json({ error: 'Spectacle non trouvé' }, { status: 404 });
    }

    // Mettre à jour le spectacle
    const updatedShow = await prisma.project.update({
      where: { id },
      data: {
        title,
        startDate: date ? new Date(date) : undefined,
        endDate: date ? new Date(date) : undefined,
        status: status === 'confirmed' ? 'ACTIVE' : status === 'planning' ? 'IN_PROGRESS' : 'DRAFT',
        budget: budget ? parseFloat(budget.toString()) : undefined,
        description,
        metadata: {
          time,
          venue,
          artists,
          team
        }
      },
      include: {
        venue: true,
        contacts: {
          include: {
            contact: true
          }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ show: updatedShow });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un spectacle
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

    // Vérifier que le spectacle existe et appartient à l'organisation
    const existingShow = await prisma.project.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org',
        type: 'SPECTACLE'
      }
    });

    if (!existingShow) {
      return NextResponse.json({ error: 'Spectacle non trouvé' }, { status: 404 });
    }

    // Supprimer le spectacle
    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Spectacle supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du spectacle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}