import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer une notification spécifique
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

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        show: {
          select: { id: true, title: true }
        },
        venue: {
          select: { id: true, name: true }
        }
      }
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ notification });
  } catch (error) {
    console.error('Erreur lors de la récupération de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une notification
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
    const { read, priority } = body;

    // Vérifier que la notification existe et appartient à l'utilisateur
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingNotification) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    // Mettre à jour la notification
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        read,
        priority,
        readAt: read ? new Date() : null
      },
      include: {
        show: {
          select: { id: true, title: true }
        },
        venue: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json({ notification: updatedNotification });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une notification
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

    // Vérifier que la notification existe et appartient à l'utilisateur
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingNotification) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    // Supprimer la notification
    await prisma.notification.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
