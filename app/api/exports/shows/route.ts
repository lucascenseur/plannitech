import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Exporter les spectacles
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
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Construire les filtres
    const where: any = {
      organizationId: session.user.organizationId || 'default-org'
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    // Récupérer les spectacles
    const shows = await prisma.show.findMany({
      where,
      include: {
        venue: true,
        artists: true,
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    if (format === 'csv') {
      // Générer CSV
      const csvHeaders = [
        'ID',
        'Titre',
        'Type',
        'Date',
        'Heure',
        'Lieu',
        'Statut',
        'Budget',
        'Équipe',
        'Artistes',
        'Description',
        'Créé par',
        'Date de création'
      ];

      const csvRows = shows.map(show => [
        show.id,
        show.title,
        show.type,
        new Date(show.date).toLocaleDateString('fr-FR'),
        show.time,
        show.venue,
        show.status,
        show.budget || 0,
        show.team || 0,
        show.artists?.join('; ') || '',
        show.description || '',
        show.createdBy?.name || '',
        new Date(show.createdAt).toLocaleDateString('fr-FR')
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="spectacles-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else if (format === 'json') {
      // Retourner JSON
      return NextResponse.json({
        shows,
        total: shows.length,
        exportedAt: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: 'Format non supporté. Utilisez csv ou json.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'export des spectacles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
