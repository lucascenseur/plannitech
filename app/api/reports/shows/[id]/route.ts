import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer le rapport détaillé d'un spectacle
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
    const organizationId = session.user.organizationId || 'default-org';

    // Récupérer le spectacle avec toutes ses relations
    const show = await prisma.show.findFirst({
      where: {
        id,
        organizationId
      },
      include: {
        venue: true,
        artists: true,
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!show) {
      return NextResponse.json({ error: 'Spectacle non trouvé' }, { status: 404 });
    }

    // Récupérer les éléments de planning associés
    const planningItems = await prisma.planningItem.findMany({
      where: {
        showId: id,
        organizationId
      },
      include: {
        assignedTo: {
          select: { name: true, role: true }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    // Récupérer les membres d'équipe assignés
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        organizationId,
        // Dans une vraie implémentation, on aurait une relation many-to-many
        // entre teamMembers et shows
      },
      take: 10,
      select: {
        id: true,
        name: true,
        role: true,
        email: true
      }
    });

    // Calculer les statistiques
    const totalPlanningItems = planningItems.length;
    const completedItems = planningItems.filter(item => item.status === 'completed').length;
    const pendingItems = planningItems.filter(item => item.status === 'pending').length;

    // Formater les données du rapport
    const reportData = {
      show: {
        id: show.id,
        title: show.title,
        type: show.type,
        date: show.date?.toISOString().split('T')[0] || '',
        time: show.time || '',
        venue: show.venue?.name || '',
        status: show.status,
        budget: show.budget || 0,
        team: teamMembers.length,
        artists: show.artists || [],
        description: show.description || ''
      },
      planning: {
        totalItems: totalPlanningItems,
        completedItems,
        pendingItems,
        items: planningItems.map(item => ({
          title: item.title,
          type: item.type,
          startTime: item.startTime.toISOString(),
          endTime: item.endTime.toISOString(),
          status: item.status,
          assignedTo: item.assignedTo.map(member => member.name)
        }))
      },
      budget: {
        planned: show.budget || 0,
        actual: 0, // À calculer à partir des dépenses réelles
        variance: 0,
        categories: [
          { name: 'Personnel', planned: 0, actual: 0, variance: 0 },
          { name: 'Équipement', planned: 0, actual: 0, variance: 0 },
          { name: 'Lieu', planned: 0, actual: 0, variance: 0 },
          { name: 'Transport', planned: 0, actual: 0, variance: 0 },
          { name: 'Autres', planned: 0, actual: 0, variance: 0 }
        ]
      },
      team: {
        total: teamMembers.length,
        assigned: teamMembers.length,
        available: 0,
        members: teamMembers.map(member => ({
          name: member.name,
          role: member.role,
          status: 'assigned'
        }))
      }
    };

    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
