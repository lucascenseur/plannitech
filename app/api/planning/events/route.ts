import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventSchema, eventFiltersSchema } from "@/types/planning";
import { z } from "zod";

// GET /api/planning/events - Récupérer la liste des événements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters: any = {};
    
    const search = searchParams.get("search");
    if (search) filters.search = search;
    
    const type = searchParams.get("type");
    if (type) filters.type = type;
    
    const status = searchParams.get("status");
    if (status) filters.status = status;
    
    const priority = searchParams.get("priority");
    if (priority) filters.priority = priority;
    
    const projectId = searchParams.get("projectId");
    if (projectId) filters.projectId = projectId;
    
    const contactId = searchParams.get("contactId");
    if (contactId) filters.contactId = contactId;
    
    const teamId = searchParams.get("teamId");
    if (teamId) filters.teamId = teamId;
    
    const startDate = searchParams.get("startDate");
    if (startDate) filters.startDate = startDate;
    
    const endDate = searchParams.get("endDate");
    if (endDate) filters.endDate = endDate;
    
    const showConflicts = searchParams.get("showConflicts");
    if (showConflicts === "true") filters.showConflicts = true;
    
    const showAvailability = searchParams.get("showAvailability");
    if (showAvailability === "true") filters.showAvailability = true;

    // Validation des filtres
    const validatedFilters = eventFiltersSchema.parse(filters);

    // Construction de la requête Prisma
    const where: any = {
      organizationId: session.user.organizations[0]?.organizationId,
    };

    if (validatedFilters.search) {
      where.OR = [
        { title: { contains: validatedFilters.search, mode: "insensitive" } },
        { description: { contains: validatedFilters.search, mode: "insensitive" } },
        { location: { contains: validatedFilters.search, mode: "insensitive" } },
      ];
    }

    if (validatedFilters.type) {
      where.type = validatedFilters.type;
    }

    if (validatedFilters.status) {
      where.status = validatedFilters.status;
    }

    if (validatedFilters.priority) {
      where.priority = validatedFilters.priority;
    }

    if (validatedFilters.projectId) {
      where.projectId = validatedFilters.projectId;
    }

    if (validatedFilters.contactId) {
      where.contacts = {
        some: {
          contactId: validatedFilters.contactId,
        },
      };
    }

    if (validatedFilters.teamId) {
      where.team = {
        some: {
          teamId: validatedFilters.teamId,
        },
      };
    }

    if (validatedFilters.startDate) {
      where.startDate = { gte: new Date(validatedFilters.startDate) };
    }

    if (validatedFilters.endDate) {
      where.endDate = { lte: new Date(validatedFilters.endDate) };
    }

    const events = await prisma.event.findMany({
      where,
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
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/planning/events - Créer un nouvel événement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    // Vérifier les conflits potentiels
    const conflicts = await checkConflicts(validatedData, session.user.organizations[0]?.organizationId);

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        organizationId: session.user.organizations[0]?.organizationId,
        createdById: session.user.id,
        conflicts: {
          create: conflicts,
        },
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

    // Programmer les rappels
    if (validatedData.reminders && validatedData.reminders.length > 0) {
      await scheduleReminders(event.id, validatedData.reminders, validatedData.startDate);
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la création de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// Fonction pour vérifier les conflits
async function checkConflicts(eventData: any, organizationId: string) {
  const conflicts = [];

  // Vérifier les conflits d'horaire
  const scheduleConflicts = await prisma.event.findMany({
    where: {
      organizationId,
      startDate: { lt: eventData.endDate },
      endDate: { gt: eventData.startDate },
      status: { not: "CANCELLED" },
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

// Fonction pour programmer les rappels
async function scheduleReminders(eventId: string, reminders: any[], startDate: string) {
  for (const reminder of reminders) {
    const scheduledFor = new Date(startDate);
    scheduledFor.setMinutes(scheduledFor.getMinutes() - reminder.minutes);

    await prisma.eventNotification.create({
      data: {
        eventId,
        type: "REMINDER",
        message: `Rappel: ${reminder.minutes} minutes avant l'événement`,
        scheduledFor,
        sent: false,
        recipients: [], // À remplir selon le type de rappel
      },
    });
  }
}

