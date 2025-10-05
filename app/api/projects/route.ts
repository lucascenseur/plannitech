import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, projectFiltersSchema } from "@/types/project";
import { z } from "zod";

// GET /api/projects - Récupérer la liste des projets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get("search") || undefined,
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      venue: searchParams.get("venue") || undefined,
      tags: searchParams.get("tags")?.split(",") || undefined,
    };

    // Validation des filtres
    const validatedFilters = projectFiltersSchema.parse(filters);

    // Construction de la requête Prisma
    const where: any = {
      organizationId: session.user.organizations[0]?.organizationId,
    };

    if (validatedFilters.search) {
      where.OR = [
        { name: { contains: validatedFilters.search, mode: "insensitive" } },
        { description: { contains: validatedFilters.search, mode: "insensitive" } },
        { venue: { contains: validatedFilters.search, mode: "insensitive" } },
      ];
    }

    if (validatedFilters.type) {
      where.type = validatedFilters.type;
    }

    if (validatedFilters.status) {
      where.status = validatedFilters.status;
    }

    if (validatedFilters.startDate) {
      where.startDate = { gte: new Date(validatedFilters.startDate) };
    }

    if (validatedFilters.endDate) {
      where.endDate = { lte: new Date(validatedFilters.endDate) };
    }

    if (validatedFilters.venue) {
      where.venue = { contains: validatedFilters.venue, mode: "insensitive" };
    }

    if (validatedFilters.tags && validatedFilters.tags.length > 0) {
      where.tags = { hasSome: validatedFilters.tags };
    }

    const projects = await prisma.project.findMany({
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
        planningItems: true,
        budgetItems: true,
        technicalSheets: true,
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Créer un nouveau projet
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        organizationId: session.user.organizations[0]?.organizationId,
        createdById: session.user.id,
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
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la création du projet:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

