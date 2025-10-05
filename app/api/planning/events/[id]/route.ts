import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventUpdateSchema } from "@/types/planning";
import { z } from "zod";

// GET /api/planning/events/[id] - Récupérer un événement par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.event.findFirst({
      where: {
        id: id,
        organizationId: session.user.organizations[0]?.organizationId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        contacts: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                email: true,
                type: true,
              },
            },
          },
        },
        team: {
          include: {
            teamMember: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
        conflicts: true,
        notifications: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/planning/events/[id] - Mettre à jour un événement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = eventUpdateSchema.parse(body);

    // Vérifier que l'événement existe et appartient à l'organisation
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: id,
        organizationId: session.user.organizations[0]?.organizationId,
      },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    }

    // Vérifier les nouveaux conflits si les dates changent
    if (validatedData.startDate || validatedData.endDate) {
      const eventData = { ...existingEvent, ...validatedData };
      const conflicts = await checkConflicts(eventData, session.user.organizations[0]?.organizationId);
      
      if (conflicts.length > 0) {
        // Créer les nouveaux conflits
        await prisma.conflict.createMany({
          data: conflicts.map(conflict => ({
            eventId: params.id,
            ...conflict,
          })),
        });
      }
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        contacts: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                email: true,
                type: true,
              },
            },
          },
        },
        team: {
          include: {
            teamMember: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
        conflicts: true,
        notifications: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la mise à jour de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/planning/events/[id] - Supprimer un événement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    // Vérifier que l'événement existe et appartient à l'organisation
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: id,
        organizationId: session.user.organizations[0]?.organizationId,
      },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    }

    // Supprimer l'événement (les relations seront supprimées en cascade)
    await prisma.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// Fonction pour vérifier les conflits (réutilisée)
async function checkConflicts(eventData: any, organizationId: string) {
  const conflicts = [];

  // Vérifier les conflits d'horaire
  const scheduleConflicts = await prisma.event.findMany({
    where: {
      organizationId,
      startDate: { lt: eventData.endDate },
      endDate: { gt: eventData.startDate },
      status: { not: "CANCELLED" },
      id: { not: eventData.id }, // Exclure l'événement actuel
    },
  });

  if (scheduleConflicts.length > 0) {
    conflicts.push({
      conflictType: "SCHEDULE",
      severity: "MEDIUM",
      description: `Conflit d'horaire avec ${scheduleConflicts.length} événement(s)`,
      affectedEvents: scheduleConflicts.map(c => c.id),
    });
  }

  // Vérifier les conflits de ressources
  if (eventData.location) {
    const resourceConflicts = await prisma.event.findMany({
      where: {
        organizationId,
        location: eventData.location,
        startDate: { lt: eventData.endDate },
        endDate: { gt: eventData.startDate },
        status: { not: "CANCELLED" },
        id: { not: eventData.id },
      },
    });

    if (resourceConflicts.length > 0) {
      conflicts.push({
        conflictType: "RESOURCE",
        severity: "HIGH",
        description: `Conflit de ressource (lieu: ${eventData.location})`,
        affectedEvents: resourceConflicts.map(c => c.id),
      });
    }
  }

  // Vérifier les conflits d'équipe
  if (eventData.teamIds && eventData.teamIds.length > 0) {
    const teamConflicts = await prisma.event.findMany({
      where: {
        organizationId,
        team: {
          some: {
            teamId: { in: eventData.teamIds },
          },
        },
        startDate: { lt: eventData.endDate },
        endDate: { gt: eventData.startDate },
        status: { not: "CANCELLED" },
        id: { not: eventData.id },
      },
    });

    if (teamConflicts.length > 0) {
      conflicts.push({
        conflictType: "TEAM",
        severity: "HIGH",
        description: `Conflit d'équipe avec ${teamConflicts.length} événement(s)`,
        affectedEvents: teamConflicts.map(c => c.id),
      });
    }
  }

  return conflicts;
}

