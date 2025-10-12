import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Exporter le planning
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const showId = searchParams.get('showId');
    const type = searchParams.get('type');

    // Construire les filtres
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (showId) {
      where.showId = showId;
    }

    if (type) {
      where.type = type;
    }

    // Récupérer les éléments de planning
    const planningItems = await prisma.planningItem.findMany({
      where,
      include: {
        show: {
          select: { id: true, title: true }
        },
        venue: {
          select: { id: true, name: true }
        },
        assignedTo: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    if (format === 'csv') {
      // Générer CSV
      const csvHeaders = [
        'ID',
        'Titre',
        'Type',
        'Début',
        'Fin',
        'Spectacle',
        'Lieu',
        'Assigné à',
        'Statut',
        'Description',
        'Créé par',
        'Date de création'
      ];

      const csvRows = planningItems.map(item => [
        item.id,
        item.title,
        item.type,
        new Date(item.startTime).toLocaleString('fr-FR'),
        new Date(item.endTime).toLocaleString('fr-FR'),
        item.show?.title || '',
        item.venue?.name || '',
        item.assignedTo?.map(person => person.name).join('; ') || '',
        item.status,
        item.description || '',
        item.createdBy?.name || '',
        new Date(item.createdAt).toLocaleDateString('fr-FR')
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="planning-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else if (format === 'json') {
      // Retourner JSON
      return NextResponse.json({
        planningItems,
        total: planningItems.length,
        exportedAt: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: 'Format non supporté. Utilisez csv ou json.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'export du planning:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
