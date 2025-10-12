import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les activités récentes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');

    const organizationId = session.user.organizationId || 'default-org';

    // Construire les filtres
    const where: any = {
      organizationId
    };

    if (type && type !== 'all') {
      where.type = type;
    }

    // Récupérer les activités depuis la table des logs d'activité
    // Récupérer les activités récentes depuis les tables principales
    const [recentProjects, recentVenues, recentTeamMembers, recentEquipment, recentPlanning] = await Promise.all([
      prisma.project.findMany({
        where: { 
          organizationId,
          type: 'SPECTACLE'
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          createdAt: true,
          createdBy: {
            select: { name: true }
          }
        }
      }),
      
      prisma.venue.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          createdBy: {
            select: { name: true }
          }
        }
      }),
      
      prisma.teamMember.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          role: true,
          createdAt: true,
          createdBy: {
            select: { name: true }
          }
        }
      }),
      
      prisma.equipment.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          createdBy: {
            select: { name: true }
          }
        }
      }),
      
      prisma.planningItem.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          createdAt: true,
          createdBy: {
            select: { name: true }
          }
        }
      })
    ]);

    // Formater les activités
    const activities = [
      ...recentProjects.map(project => ({
        id: `project-${project.id}`,
        type: 'show' as const,
        action: 'created' as const,
        title: 'Nouveau spectacle créé',
        description: project.title,
        timestamp: project.createdAt.toISOString(),
        user: { name: project.createdBy?.name || 'Utilisateur' },
        metadata: { showTitle: project.title }
      })),
      
      ...recentVenues.map(venue => ({
        id: `venue-${venue.id}`,
        type: 'venue' as const,
        action: 'created' as const,
        title: 'Nouveau lieu ajouté',
        description: venue.name,
        timestamp: venue.createdAt.toISOString(),
        user: { name: venue.createdBy?.name || 'Utilisateur' },
        metadata: { venueName: venue.name }
      })),
      
      ...recentTeamMembers.map(member => ({
        id: `team-${member.id}`,
        type: 'team' as const,
        action: 'assigned' as const,
        title: 'Membre d\'équipe ajouté',
        description: `${member.name} - ${member.role}`,
        timestamp: member.createdAt.toISOString(),
        user: { name: member.createdBy?.name || 'Utilisateur' },
        metadata: { teamMemberName: member.name }
      })),
      
      ...recentEquipment.map(item => ({
        id: `equipment-${item.id}`,
        type: 'equipment' as const,
        action: 'created' as const,
        title: 'Équipement ajouté',
        description: item.name,
        timestamp: item.createdAt.toISOString(),
        user: { name: item.createdBy?.name || 'Utilisateur' },
        metadata: { equipmentName: item.name }
      })),
      
      ...recentPlanning.map(item => ({
        id: `planning-${item.id}`,
        type: 'planning' as const,
        action: 'created' as const,
        title: 'Élément de planning créé',
        description: item.title,
        timestamp: item.createdAt.toISOString(),
        user: { name: item.createdBy?.name || 'Utilisateur' },
        metadata: {}
      }))
    ];

    // Trier par timestamp et limiter
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({ 
      activities: sortedActivities,
      total: activities.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
