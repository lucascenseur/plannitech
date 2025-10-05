import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactUpdateSchema } from "@/types/contact";
import { z } from "zod";

// GET /api/contacts/[id] - Récupérer un contact par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: params.id,
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
        },
        documents: {
          orderBy: {
            uploadedAt: "desc",
          },
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
          orderBy: {
            validFrom: "desc",
          },
        },
        availability: {
          orderBy: {
            startDate: "desc",
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact non trouvé" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Erreur lors de la récupération du contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id] - Mettre à jour un contact
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = contactUpdateSchema.parse(body);

    // Vérifier que le contact existe et appartient à l'organisation
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizations[0]?.organizationId,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact non trouvé" }, { status: 404 });
    }

    const contact = await prisma.contact.update({
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
        },
        documents: {
          orderBy: {
            uploadedAt: "desc",
          },
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
          orderBy: {
            validFrom: "desc",
          },
        },
        availability: {
          orderBy: {
            startDate: "desc",
          },
        },
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la mise à jour du contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Supprimer un contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que le contact existe et appartient à l'organisation
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizations[0]?.organizationId,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact non trouvé" }, { status: 404 });
    }

    // Supprimer le contact (les relations seront supprimées en cascade)
    await prisma.contact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Contact supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

