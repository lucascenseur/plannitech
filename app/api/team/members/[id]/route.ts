import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un membre d'équipe spécifique
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

    const member = await prisma.teamMember.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      },
      include: {
        contact: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!member) {
      return NextResponse.json({ error: 'Membre d\'équipe non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Erreur lors de la récupération du membre d\'équipe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un membre d'équipe
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
      email,
      phone,
      role,
      availability,
      skills,
      contactId
    } = body;

    // Vérifier que le membre existe et appartient à l'organisation
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Membre d\'équipe non trouvé' }, { status: 404 });
    }

    // Mettre à jour le membre d'équipe
    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        role,
        availability,
        skills,
        contactId
      },
      include: {
        contact: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ member: updatedMember });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre d\'équipe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un membre d'équipe
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

    // Vérifier que le membre existe et appartient à l'organisation
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || 'default-org'
      }
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Membre d\'équipe non trouvé' }, { status: 404 });
    }

    // Supprimer le membre d'équipe
    await prisma.teamMember.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Membre d\'équipe supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre d\'équipe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
