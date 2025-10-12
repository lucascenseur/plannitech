import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Recherche globale
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const organizationId = session.user.organizationId || 'default-org';

    // Rechercher dans tous les modèles
    const [shows, venues, teamMembers, equipment, planningItems] = await Promise.all([
      // Spectacles
      prisma.show.findMany({
        where: {
          organizationId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          type: true
        }
      }),
      
      // Lieux
      prisma.venue.findMany({
        where: {
          organizationId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: {
          id: true,
          name: true,
          address: true,
          capacity: true,
          type: true
        }
      }),
      
      // Membres d'équipe
      prisma.teamMember.findMany({
        where: {
          organizationId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { role: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: {
          id: true,
          name: true,
          role: true,
          email: true
        }
      }),
      
      // Équipements
      prisma.equipment.findMany({
        where: {
          organizationId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          quantity: true
        }
      }),
      
      // Éléments de planning
      prisma.planningItem.findMany({
        where: {
          organizationId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          startTime: true
        }
      })
    ]);

    // Formater les résultats
    const results = [
      ...shows.map(show => ({
        id: show.id,
        type: 'show',
        title: show.title,
        description: show.description || `Spectacle ${show.type} - ${new Date(show.date).toLocaleDateString('fr-FR')}`,
        href: `/dashboard/shows/${show.id}`,
        icon: 'Theater'
      })),
      
      ...venues.map(venue => ({
        id: venue.id,
        type: 'venue',
        title: venue.name,
        description: `${venue.address} - ${venue.capacity} places`,
        href: `/dashboard/shows?tab=venues`,
        icon: 'Building2'
      })),
      
      ...teamMembers.map(member => ({
        id: member.id,
        type: 'team',
        title: member.name,
        description: member.role,
        href: `/dashboard/team/members/${member.id}`,
        icon: 'Users'
      })),
      
      ...equipment.map(item => ({
        id: item.id,
        type: 'equipment',
        title: item.name,
        description: `${item.type} - ${item.status} (${item.quantity})`,
        href: `/dashboard/resources/equipment/${item.id}`,
        icon: 'Package'
      })),
      
      ...planningItems.map(item => ({
        id: item.id,
        type: 'planning',
        title: item.title,
        description: item.description || `Planning ${item.type}`,
        href: `/dashboard/planning`,
        icon: 'Calendar'
      }))
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
