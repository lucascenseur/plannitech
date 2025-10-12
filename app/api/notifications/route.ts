import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer toutes les notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const read = searchParams.get('read');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Construire les filtres Prisma
    const where: any = {
      userId: session.user.id
    };

    if (type) {
      where.type = type;
    }

    if (read !== null) {
      where.read = read === 'true';
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        show: {
          select: { id: true, title: true }
        },
        venue: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({
      notifications,
      total: notifications.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      title,
      message,
      userId,
      showId,
      venueId,
      priority = 'medium'
    } = body;

    // Validation des données requises
    if (!type || !title || !message || !userId) {
      return NextResponse.json(
        { error: 'Les champs type, title, message et userId sont requis' },
        { status: 400 }
      );
    }

    // Créer la nouvelle notification
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        showId,
        venueId,
        priority,
        read: false
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

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Marquer toutes les notifications comme lues
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { markAllAsRead = false, notificationIds = [] } = body;

    if (markAllAsRead) {
      // Marquer toutes les notifications comme lues
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false
        },
        data: {
          read: true,
          readAt: new Date()
        }
      });
    } else if (notificationIds.length > 0) {
      // Marquer des notifications spécifiques comme lues
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id
        },
        data: {
          read: true,
          readAt: new Date()
        }
      });
    }

    return NextResponse.json({ message: 'Notifications mises à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
