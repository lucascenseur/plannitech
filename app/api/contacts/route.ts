import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema, contactFiltersSchema } from "@/types/contact";
import { z } from "zod";

// GET /api/contacts - Récupérer la liste des contacts
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
    
    const skills = searchParams.get("skills");
    if (skills) filters.skills = skills.split(",");
    
    const tags = searchParams.get("tags");
    if (tags) filters.tags = tags.split(",");
    
    const groups = searchParams.get("groups");
    if (groups) filters.groups = groups.split(",");
    
    const isIntermittent = searchParams.get("isIntermittent");
    if (isIntermittent === "true") filters.isIntermittent = true;
    
    const isFavorite = searchParams.get("isFavorite");
    if (isFavorite === "true") filters.isFavorite = true;
    
    const availability = searchParams.get("availability");
    if (availability) filters.availability = availability;
    
    const rateRange = searchParams.get("rateRange");
    if (rateRange) filters.rateRange = JSON.parse(rateRange);

    // Validation des filtres
    const validatedFilters = contactFiltersSchema.parse(filters);

    // Construction de la requête Prisma
    const where: any = {
      organizationId: session.user.organizations[0]?.organizationId,
    };

    if (validatedFilters.search) {
      where.OR = [
        { name: { contains: validatedFilters.search, mode: "insensitive" } },
        { email: { contains: validatedFilters.search, mode: "insensitive" } },
        { phone: { contains: validatedFilters.search, mode: "insensitive" } },
        { description: { contains: validatedFilters.search, mode: "insensitive" } },
      ];
    }

    if (validatedFilters.type) {
      where.type = validatedFilters.type;
    }

    if (validatedFilters.status) {
      where.status = validatedFilters.status;
    }

    if (validatedFilters.skills && validatedFilters.skills.length > 0) {
      where.skills = {
        hasSome: validatedFilters.skills,
      };
    }

    if (validatedFilters.tags && validatedFilters.tags.length > 0) {
      where.tags = {
        hasSome: validatedFilters.tags,
      };
    }

    if (validatedFilters.groups && validatedFilters.groups.length > 0) {
      where.groups = {
        hasSome: validatedFilters.groups,
      };
    }

    if (validatedFilters.isIntermittent !== undefined) {
      where.isIntermittent = validatedFilters.isIntermittent;
    }

    if (validatedFilters.isFavorite !== undefined) {
      where.isFavorite = validatedFilters.isFavorite;
    }

    if (validatedFilters.availability) {
      where.availability = {
        some: {
          status: validatedFilters.availability,
        },
      };
    }

    if (validatedFilters.rateRange) {
      where.rates = {
        some: {
          amount: {
            gte: validatedFilters.rateRange.min,
            lte: validatedFilters.rateRange.max,
          },
        },
      };
    }

    const contacts = await prisma.contact.findMany({
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
        collaborations: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
          orderBy: {
            startDate: "desc",
          },
          take: 5,
        },
        documents: {
          orderBy: {
            uploadedAt: "desc",
          },
          take: 5,
        },
        groups: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        rates: {
          where: {
            isActive: true,
          },
          orderBy: {
            validFrom: "desc",
          },
        },
        availability: {
          orderBy: {
            startDate: "desc",
          },
          take: 5,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Créer un nouveau contact
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const contact = await prisma.contact.create({
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
        collaborations: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
        documents: true,
        groups: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        rates: true,
        availability: true,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la création du contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

