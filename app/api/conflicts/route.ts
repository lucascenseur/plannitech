import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les conflits de planning
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const showId = searchParams.get('showId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const organizationId = session.user.organizationId || 'default-org';

    // Détecter les conflits de planning
    const conflicts = [];

    // 1. Conflits de chevauchement temporel
    if (startDate && endDate) {
      const overlappingItems = await prisma.planningItem.findMany({
        where: {
          organizationId,
          ...(showId && { projectId: showId }),
          OR: [
            {
              AND: [
                { startTime: { lte: new Date(endDate) } },
                { endTime: { gte: new Date(startDate) } }
              ]
            }
          ]
        },
        include: {
          project: true,
          assignedTo: true
        }
      });

      // Grouper par ressource pour détecter les conflits
      const resourceConflicts = new Map();
      
      for (const item of overlappingItems) {
        const resourceKey = item.assignedToId || item.equipmentId || 'general';
        if (!resourceConflicts.has(resourceKey)) {
          resourceConflicts.set(resourceKey, []);
        }
        resourceConflicts.get(resourceKey).push(item);
      }

      // Créer les conflits pour les ressources avec plus d'un élément
      for (const [resource, items] of resourceConflicts.entries()) {
        if (items.length > 1) {
          conflicts.push({
            id: `conflict-${resource}-${Date.now()}`,
            type: 'resource_overlap',
            severity: 'high',
            title: 'Chevauchement de ressources',
            description: `${items.length} éléments se chevauchent pour la même ressource`,
            items: items.map(item => ({
              id: item.id,
              title: item.title,
              startTime: item.startTime,
              endTime: item.endTime,
              project: item.project?.title
            })),
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // 2. Conflits de surcharge d'équipement
    const equipmentOverload = await prisma.planningItem.groupBy({
      by: ['equipmentId'],
      where: {
        organizationId,
        equipmentId: { not: null },
        startTime: { gte: new Date() }
      },
      _count: {
        id: true
      },
      having: {
        id: { _count: { gt: 1 } }
      }
    });

    for (const overload of equipmentOverload) {
      const equipment = await prisma.equipment.findUnique({
        where: { id: overload.equipmentId! }
      });

      conflicts.push({
        id: `equipment-overload-${overload.equipmentId}`,
        type: 'equipment_overload',
        severity: 'medium',
        title: 'Surcharge d\'équipement',
        description: `L'équipement "${equipment?.name}" est surchargé`,
        equipment: equipment,
        count: overload._count.id,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      conflicts,
      total: conflicts.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conflits:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
